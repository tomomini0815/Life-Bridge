import { Baby, Briefcase, GraduationCap, Heart, Home, Star, Trophy, Users, Plane, Car, Building, Church } from 'lucide-react';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { GeminiService } from './GeminiService';
import { Task } from '../types/lifeEvent';

export type TimelineStatus = 'completed' | 'active' | 'future';
export type TimelineScenario = 'current' | 'ideal';

export interface TimelineEvent {
    id: string;
    year: string;
    title: string;
    description: string;
    status: TimelineStatus;
    iconName: string;
    scenario: TimelineScenario;
    tasks?: Task[];
}

// Internal Supabase Row Interface
interface TimelineEventRow {
    id: string;
    user_id: string;
    year: string;
    title: string;
    description: string;
    status: string;
    icon_name: string;
    scenario: string;
    tasks: Task[] | null;
    created_at: string;
    updated_at: string;
}

export const ICON_MAP: Record<string, React.ElementType> = {
    'graduation': GraduationCap,
    'job': Briefcase,
    'marriage': Church,
    'home': Home,
    'baby': Baby,
    'star': Star,
    'trophy': Trophy,
    'users': Users,
    'travel': Plane,
    'car': Car,
    'building': Building
};

const STORAGE_KEY = 'life-bridge-timeline';

const DEFAULT_EVENTS: TimelineEvent[] = [
    {
        id: '1',
        year: '2019',
        title: '大学卒業',
        iconName: 'graduation',
        status: 'completed',
        description: '希望を胸に、社会への第一歩を踏み出しました。',
        scenario: 'current',
    },
    {
        id: '2',
        year: '2019',
        title: '新卒入社',
        iconName: 'job',
        status: 'completed',
        description: '株式会社テックフューチャーに入社。エンジニアとしてのキャリアをスタート。',
        scenario: 'current',
    },
    {
        id: '3',
        year: '2023',
        title: '結婚',
        iconName: 'marriage',
        status: 'completed',
        description: 'パートナーと共に歩む新しい人生の幕開け。',
        scenario: 'current',
    },
    {
        id: '4',
        year: '2025',
        title: '引越し',
        iconName: 'home',
        status: 'active',
        description: '家族が増える未来を見据えて、広めのマンションへ。',
        scenario: 'current',
    },
    {
        id: '5',
        year: '2026 (予想)',
        title: '第一子誕生',
        iconName: 'baby',
        status: 'future',
        description: '新しい家族の誕生。パパ・ママとしての生活が始まります。',
        scenario: 'current',
    },
];

export interface UserInputForAI {
    age: number;
    job: string;
    currentStatus: string;
    goals: string;
}

export class TimelineService {
    private static instance: TimelineService;
    private events: TimelineEvent[] = [];
    private currentUserId: string | null = null;

    private constructor() {
        // Initial state is empty until setUser is called
    }

    static getInstance(): TimelineService {
        if (!TimelineService.instance) {
            TimelineService.instance = new TimelineService();
        }
        return TimelineService.instance;
    }

    // Set user and load data
    async setUser(userId: string | null): Promise<void> {
        this.currentUserId = userId;
        if (userId) {
            await this.loadEvents();
            await this.migrateFromLocalStorage();
        } else {
            this.events = [];
        }
    }

    // Helper: Convert DB row to Domain Object
    private rowToEvent(row: TimelineEventRow): TimelineEvent {
        return {
            id: row.id,
            year: row.year,
            title: row.title,
            description: row.description || '',
            status: (row.status as TimelineStatus) || 'future',
            iconName: row.icon_name || 'star',
            scenario: (row.scenario as TimelineScenario) || 'current',
            tasks: row.tasks || undefined,
        };
    }

    // Load events from Supabase
    private async loadEvents(): Promise<void> {
        if (!this.currentUserId) return;

        try {
            const { data, error } = await supabase
                .from('timeline_events')
                .select('*')
                .eq('user_id', this.currentUserId);

            if (error) throw error;

            if (data) {
                this.events = data.map(row => this.rowToEvent(row as unknown as TimelineEventRow));
                this.sortEvents();
            }
        } catch (e) {
            console.error('Failed to load timeline events:', e);
            // Fallback? Using default?
            // If error, maybe keep events empty to avoid overwriting remote with defaults
        }
    }

    // Migrate from LocalStorage
    private async migrateFromLocalStorage(): Promise<void> {
        if (!this.currentUserId) return;

        const migrationKey = `${STORAGE_KEY}_migrated_${this.currentUserId}`;
        if (localStorage.getItem(migrationKey)) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                // If no local data, maybe insert defaults? 
                // Let's NOT insert defaults automatically to DB to keep it clean, 
                // unless it's a completely new user. 
                // But for now, just mark migrated.
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            const localEvents: TimelineEvent[] = JSON.parse(stored);
            if (localEvents.length === 0) {
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            console.log(`Migrating ${localEvents.length} timeline events...`);

            const eventsToInsert = localEvents.map(e => ({
                user_id: this.currentUserId,
                year: e.year,
                title: e.title,
                description: e.description,
                status: e.status,
                icon_name: e.iconName,
                scenario: e.scenario || 'current', // Handle migration
                tasks: e.tasks || null,
            }));

            const { error } = await supabase.from('timeline_events').insert(eventsToInsert);

            if (error) throw error;

            localStorage.setItem(migrationKey, 'true');
            await this.loadEvents(); // Reload to get IDs

        } catch (e) {
            console.error('Migration failed:', e);
        }
    }

    getEvents(scenario: TimelineScenario = 'current'): TimelineEvent[] {
        return this.events.filter(e => e.scenario === scenario);
    }

    async addEvent(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent | null> {
        if (!this.currentUserId) {
            // Fallback for non-logged in (preview)? 
            // Ideally we force login, but for now allow memory-only if no user?
            // No, let's enforce user check or return null
            console.warn("No user logged in, cannot save event");
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('timeline_events')
                .insert({
                    user_id: this.currentUserId,
                    year: event.year,
                    title: event.title,
                    description: event.description,
                    status: event.status,
                    icon_name: event.iconName,
                    scenario: event.scenario,
                    tasks: event.tasks || null
                })
                .select()
                .single();

            if (error) throw error;

            const newEvent = this.rowToEvent(data as unknown as TimelineEventRow);
            this.events.push(newEvent);
            this.sortEvents();
            return newEvent;
        } catch (e) {
            console.error('Add event failed:', e);
            return null;
        }
    }

    async updateEvent(id: string, updates: Partial<Omit<TimelineEvent, 'id'>>): Promise<TimelineEvent | null> {
        if (!this.currentUserId) return null;

        try {
            // Map camelCase to snake_case for DB
            const dbUpdates: any = {};
            if (updates.year !== undefined) dbUpdates.year = updates.year;
            if (updates.title !== undefined) dbUpdates.title = updates.title;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.status !== undefined) dbUpdates.status = updates.status;
            if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
            if (updates.scenario !== undefined) dbUpdates.scenario = updates.scenario;
            if (updates.tasks !== undefined) dbUpdates.tasks = updates.tasks;

            const { data, error } = await supabase
                .from('timeline_events')
                .update(dbUpdates)
                .eq('id', id)
                .eq('user_id', this.currentUserId)
                .select()
                .single();

            if (error) throw error;

            const updatedEvent = this.rowToEvent(data as unknown as TimelineEventRow);
            const index = this.events.findIndex(e => e.id === id);
            if (index !== -1) {
                this.events[index] = updatedEvent;
                this.sortEvents();
            }
            return updatedEvent;

        } catch (e) {
            console.error('Update event failed:', e);
            return null;
        }
    }

    async deleteEvent(id: string): Promise<boolean> {
        if (!this.currentUserId) return false;

        try {
            const { error } = await supabase
                .from('timeline_events')
                .delete()
                .eq('id', id)
                .eq('user_id', this.currentUserId);

            if (error) throw error;

            this.events = this.events.filter(e => e.id !== id);
            return true;
        } catch (e) {
            console.error('Delete event failed:', e);
            return false;
        }
    }

    private sortEvents() {
        this.events.sort((a, b) => {
            const yearA = parseInt(a.year) || 9999;
            const yearB = parseInt(b.year) || 9999;
            if (yearA !== yearB) return yearA - yearB;
            return a.year.localeCompare(b.year);
        });
    }

    async generateAiEvents(input: UserInputForAI): Promise<void> {
        if (!GeminiService.isEnabled()) throw new Error("AI Service Unavailable");
        if (!this.currentUserId) throw new Error("User must be logged in to save AI events");

        const prompt = `
        Create two life timelines for a user based on the following input:
        Age: ${input.age}
        Job: ${input.job}
        Current Status: ${input.currentStatus}
        Goals: ${input.goals}

        Timeline 1 (Current Path): Realistic future based on current status.
        Timeline 2 (Ideal Path): Future where all goals are achieved successfully.

        Return ONLY a JSON array of objects with these fields:
        - year: string (YYYY format)
        - title: string (Short event title in Japanese)
        - description: string (1-2 sentences in Japanese)
        - iconName: string (one of: graduation, job, marriage, home, baby, star, trophy, users, travel, car, building)
        - status: 'future'
        - scenario: 'current' or 'ideal'

        Generate about 5-8 future events for EACH scenario (total 10-16 events).
        Start from next year and cover the timeline until the user is around 80 years old.
        Ensure events are distributed across different life stages.
        `;

        try {
            const jsonStr = await GeminiService.generateText(prompt, "You are a JSON generator. Output valid JSON only, no markdown code blocks.");
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const newEvents = JSON.parse(cleanJson);

            // Add events sequentially
            for (const e of newEvents) {
                await this.addEvent({
                    year: e.year,
                    title: e.title,
                    description: e.description,
                    iconName: e.iconName,
                    status: 'future',
                    scenario: e.scenario
                });
            }

        } catch (e) {
            console.error("AI Generation Failed", e);
            throw e;
        }
    }
}

export const timelineService = TimelineService.getInstance();
