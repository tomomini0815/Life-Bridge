import { Baby, Briefcase, GraduationCap, Heart, Home, Star, Trophy, Users, Plane, Car, Building, LucideIcon } from 'lucide-react';

export type TimelineStatus = 'completed' | 'active' | 'future';

export interface TimelineEvent {
    id: string;
    year: string;
    title: string;
    iconName: string;
    status: TimelineStatus;
    description: string;
}

export const ICON_MAP: Record<string, LucideIcon> = {
    'graduation': GraduationCap,
    'job': Briefcase,
    'marriage': Heart,
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
    },
    {
        id: '2',
        year: '2019',
        title: '新卒入社',
        iconName: 'job',
        status: 'completed',
        description: '株式会社テックフューチャーに入社。エンジニアとしてのキャリアをスタート。',
    },
    {
        id: '3',
        year: '2023',
        title: '結婚',
        iconName: 'marriage',
        status: 'completed',
        description: 'パートナーと共に歩む新しい人生の幕開け。',
    },
    {
        id: '4',
        year: '2025',
        title: '引越し',
        iconName: 'home',
        status: 'active',
        description: '家族が増える未来を見据えて、広めのマンションへ。',
    },
    {
        id: '5',
        year: '2026 (予想)',
        title: '第一子誕生',
        iconName: 'baby',
        status: 'future',
        description: '新しい家族の誕生。パパ・ママとしての生活が始まります。',
    },
];

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
        } else {
            this.events = [...DEFAULT_EVENTS];
            this.saveEvents();
        }
    }

    private saveEvents() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    }

    getEvents(): TimelineEvent[] {
        return [...this.events];
    }

    addEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
        const newEvent = { ...event, id: crypto.randomUUID() };
        this.events.push(newEvent);
        // Sort by year (numeric check if possible, else string sort)
        this.events.sort((a, b) => {
            const yearA = parseInt(a.year) || 9999;
            const yearB = parseInt(b.year) || 9999;
            if (yearA !== yearB) return yearA - yearB;
            return a.year.localeCompare(b.year);
        });
        this.saveEvents();
        return newEvent;
    }

    updateEvent(id: string, updates: Partial<Omit<TimelineEvent, 'id'>>): TimelineEvent | null {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) return null;

        this.events[index] = { ...this.events[index], ...updates };
        this.events.sort((a, b) => {
            const yearA = parseInt(a.year) || 9999;
            const yearB = parseInt(b.year) || 9999;
            if (yearA !== yearB) return yearA - yearB;
            return a.year.localeCompare(b.year);
        });
        this.saveEvents();
        return this.events[index];
    }

    deleteEvent(id: string) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
    }
}

export const timelineService = TimelineService.getInstance();
