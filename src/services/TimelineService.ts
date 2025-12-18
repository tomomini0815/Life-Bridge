import { FaBaby, FaBriefcase, FaGraduationCap, FaHeart, FaHome, FaStar, FaTrophy, FaUsers, FaPlane, FaCar, FaBuilding, FaChurch } from 'react-icons/fa';
import React from 'react';

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

export const ICON_MAP: Record<string, React.ElementType> = {
    'graduation': FaGraduationCap,
    'job': FaBriefcase,
    'marriage': FaChurch,
    'home': FaHome,
    'baby': FaBaby,
    'star': FaStar,
    'trophy': FaTrophy,
    'users': FaUsers,
    'travel': FaPlane,
    'car': FaCar,
    'building': FaBuilding
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

    private constructor() {
        this.loadEvents();
    }

    static getInstance(): TimelineService {
        if (!TimelineService.instance) {
            TimelineService.instance = new TimelineService();
        }
        return TimelineService.instance;
    }

    private loadEvents() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.events = JSON.parse(stored);
            // Migration: Add scenario if missing
            if (this.events.length > 0 && !this.events[0].scenario) {
                this.events = this.events.map(e => ({ ...e, scenario: 'current' }));
            }
        } else {
            this.events = [...DEFAULT_EVENTS];
            this.saveEvents();
        }
    }

    private saveEvents() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    }

    getEvents(scenario: TimelineScenario = 'current'): TimelineEvent[] {
        return this.events.filter(e => e.scenario === scenario);
    }

    addEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
        const newEvent = { ...event, id: crypto.randomUUID() };
        this.events.push(newEvent);
        this.sortEvents();
        this.saveEvents();
        return newEvent;
    }

    updateEvent(id: string, updates: Partial<Omit<TimelineEvent, 'id'>>): TimelineEvent | null {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) return null;

        this.events[index] = { ...this.events[index], ...updates };
        this.sortEvents();
        this.saveEvents();
        return this.events[index];
    }

    deleteEvent(id: string) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
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

        Generate about 3-5 future events for EACH scenario (total 6-10 events).
        Start from next year.
        `;

        try {
            const jsonStr = await GeminiService.generateText(prompt, "You are a JSON generator. Output valid JSON only, no markdown code blocks.");
            // Clean markdown if present
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const newEvents = JSON.parse(cleanJson);

            // Filter out existing future events to replace them, or just append?
            // Let's replace 'future' events for simplicity, or maybe just add them.
            // For now, let's keep existing 'completed'/'active' events and remove all 'future' events to avoid duplicates
            // before adding new ones. But user might have manually added future events.
            // Let's just ADD new events for now.
            // Actually, best strictly to clear previous AI generated stuff... but we don't track 'isAiGenerated'.
            // Let's just append. User can delete.

            newEvents.forEach((e: any) => {
                this.addEvent({
                    year: e.year,
                    title: e.title,
                    description: e.description,
                    iconName: e.iconName,
                    status: 'future',
                    scenario: e.scenario
                });
            });

        } catch (e) {
            console.error("AI Generation Failed", e);
            throw e;
        }
    }
}

export const timelineService = TimelineService.getInstance();
