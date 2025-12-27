import { lifeEvents } from '@/data/lifeEvents';
import { LifeEventType } from '@/types/lifeEvent';

export type SearchResultType = 'event' | 'task' | 'page' | 'memo' | 'help';

export interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    description: string;
    path?: string;
    eventId?: LifeEventType;
    icon?: string;
}

// Internal pages configuration
const internalPages: SearchResult[] = [
    { id: 'reminders', type: 'page', title: 'リマインダー設定', description: '通知設定と重要期限の管理', path: 'reminders' },
    { id: 'settings', type: 'page', title: '設定', description: 'アカウントとアプリの設定', path: 'settings' },
    { id: 'simulator', type: 'page', title: '給付金シミュレーター', description: '受給可能な給付金の計算', path: 'simulator' },
    { id: 'memo', type: 'page', title: 'メモ帳', description: '手続きに関するメモの管理', path: 'memo' },
    { id: 'help', type: 'page', title: 'ヘルプセンター', description: 'よくある質問とガイド', path: 'help' },
];

export class SearchService {
    private static instance: SearchService;

    private constructor() { }

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService();
        }
        return SearchService.instance;
    }

    public search(query: string): SearchResult[] {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        const results: SearchResult[] = [];

        // 1. Search Pages
        const pageResults = internalPages.filter(page =>
            page.title.includes(normalizedQuery) ||
            page.description.includes(normalizedQuery)
        );
        results.push(...pageResults);

        // 2. Search Life Events
        lifeEvents.forEach(event => {
            // Search Event itself
            if (
                event.title.includes(normalizedQuery) ||
                event.description.includes(normalizedQuery)
            ) {
                results.push({
                    id: event.id,
                    type: 'event',
                    title: event.title,
                    description: event.description,
                    eventId: event.id as LifeEventType,
                    icon: event.icon,
                });
            }

            // Search Tasks within Event
            event.tasks.forEach(task => {
                if (
                    task.title.includes(normalizedQuery) ||
                    task.description.includes(normalizedQuery)
                ) {
                    results.push({
                        id: task.id,
                        type: 'task',
                        title: task.title,
                        description: task.description,
                        eventId: event.id as LifeEventType,
                        icon: '📋',
                    });
                }
            });
        });

        return results;
    }
}
