import { Memo, CheckboxItem, MemoCategory } from '@/types/memo';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'lifebridge_memos';

// Database row type
interface MemoRow {
    id: string;
    user_id: string;
    title: string;
    content: string;
    checkbox_items: CheckboxItem[] | null;
    category: string;
    tags: string[] | null;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

export class MemoService {
    private static instance: MemoService;
    private memos: Memo[] = [];
    private currentUserId: string | null = null;

    private constructor() {
        // Migration from localStorage will happen on first load
    }

    static getInstance(): MemoService {
        if (!MemoService.instance) {
            MemoService.instance = new MemoService();
        }
        return MemoService.instance;
    }

    // Set current user and load their memos
    async setUser(userId: string | null): Promise<void> {
        if (this.currentUserId === userId) return;

        this.currentUserId = userId;
        if (userId) {
            await this.loadMemos();
            await this.migrateFromLocalStorage();
        } else {
            this.memos = [];
        }
    }

    // Get all memos
    getAllMemos(): Memo[] {
        return [...this.memos].sort((a, b) => {
            // Pinned memos first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Then by updated date
            return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
    }

    // Get memo by ID
    getMemoById(id: string): Memo | undefined {
        return this.memos.find((m) => m.id === id);
    }

    // Get memos by category
    getMemosByCategory(category: MemoCategory): Memo[] {
        return this.memos.filter((m) => m.category === category);
    }

    // Search memos
    searchMemos(query: string): Memo[] {
        const lowerQuery = query.toLowerCase();
        return this.memos.filter(
            (m) =>
                m.title.toLowerCase().includes(lowerQuery) ||
                m.content.toLowerCase().includes(lowerQuery) ||
                m.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }

    // Create new memo
    async createMemo(
        title: string,
        content: string,
        options?: {
            checkboxItems?: CheckboxItem[];
            category?: MemoCategory;
            tags?: string[];
            isPinned?: boolean;
        }
    ): Promise<Memo | null> {
        if (!this.currentUserId) {
            console.error('No user logged in');
            return null;
        }

        const { data, error } = await supabase
            .from('memos')
            .insert({
                user_id: this.currentUserId,
                title,
                content,
                checkbox_items: options?.checkboxItems || null,
                category: options?.category || 'general',
                tags: options?.tags || [],
                is_pinned: options?.isPinned || false,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create memo:', error);
            return null;
        }

        const memo = this.rowToMemo(data);
        this.memos.push(memo);
        return memo;
    }

    // Update memo
    async updateMemo(id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>): Promise<Memo | null> {
        if (!this.currentUserId) {
            console.error('No user logged in');
            return null;
        }

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.checkboxItems !== undefined) dbUpdates.checkbox_items = updates.checkboxItems;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;

        const { data, error } = await supabase
            .from('memos')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', this.currentUserId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update memo:', error);
            return null;
        }

        const index = this.memos.findIndex((m) => m.id === id);
        if (index !== -1) {
            this.memos[index] = this.rowToMemo(data);
            return this.memos[index];
        }

        return null;
    }

    // Toggle checkbox item
    async toggleCheckboxItem(memoId: string, itemId: string): Promise<boolean> {
        const memo = this.getMemoById(memoId);
        if (!memo || !memo.checkboxItems) return false;

        const item = memo.checkboxItems.find((i) => i.id === itemId);
        if (!item) return false;

        item.checked = !item.checked;
        const result = await this.updateMemo(memoId, { checkboxItems: memo.checkboxItems });
        return result !== null;
    }

    // Add checkbox item to memo
    async addCheckboxItem(memoId: string, text: string): Promise<boolean> {
        const memo = this.getMemoById(memoId);
        if (!memo) return false;

        const newItem: CheckboxItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text,
            checked: false,
        };

        const checkboxItems = memo.checkboxItems || [];
        checkboxItems.push(newItem);

        const result = await this.updateMemo(memoId, { checkboxItems });
        return result !== null;
    }

    // Remove checkbox item
    async removeCheckboxItem(memoId: string, itemId: string): Promise<boolean> {
        const memo = this.getMemoById(memoId);
        if (!memo || !memo.checkboxItems) return false;

        const checkboxItems = memo.checkboxItems.filter((i) => i.id !== itemId);
        const result = await this.updateMemo(memoId, { checkboxItems });
        return result !== null;
    }

    // Delete memo
    async deleteMemo(id: string): Promise<boolean> {
        if (!this.currentUserId) {
            console.error('No user logged in');
            return false;
        }

        const { error } = await supabase
            .from('memos')
            .delete()
            .eq('id', id)
            .eq('user_id', this.currentUserId);

        if (error) {
            console.error('Failed to delete memo:', error);
            return false;
        }

        const index = this.memos.findIndex((m) => m.id === id);
        if (index !== -1) {
            this.memos.splice(index, 1);
        }
        return true;
    }

    // Toggle pin
    async togglePin(id: string): Promise<boolean> {
        const memo = this.getMemoById(id);
        if (!memo) return false;

        const result = await this.updateMemo(id, { isPinned: !memo.isPinned });
        return result !== null;
    }

    // Create memo from chat message
    async createMemoFromChat(messageContent: string, title?: string): Promise<Memo | null> {
        const { checkboxItems, cleanedContent } = this.extractCheckboxItems(messageContent);

        return await this.createMemo(
            title || 'チャットからのメモ',
            cleanedContent,
            {
                checkboxItems: checkboxItems.length > 0 ? checkboxItems : undefined,
                category: 'chat',
                tags: ['AI'],
            }
        );
    }

    // Update memo from raw text (parsing checkboxes)
    async updateMemoFromText(id: string, title: string, rawContent: string): Promise<Memo | null> {
        const { checkboxItems, cleanedContent } = this.extractCheckboxItems(rawContent);

        return await this.updateMemo(id, {
            title,
            content: cleanedContent,
            checkboxItems: checkboxItems.length > 0 ? checkboxItems : [],
        });
    }

    // Extract checkbox items and return cleaned content
    private extractCheckboxItems(text: string): { checkboxItems: CheckboxItem[], cleanedContent: string } {
        const items: CheckboxItem[] = [];
        const lines = text.split('\n');
        const remainingLines: string[] = [];

        lines.forEach((line) => {
            const match = line.match(/^\s*(?:- \[[ x]\]|-|\*|\d+\.|・)\s+(.+)$/);

            if (match) {
                // Check if explicitly checked in markdown
                const isChecked = /^\s*- \[x\]/i.test(line);

                items.push({
                    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    text: this.cleanMarkdown(match[1].trim()),
                    checked: isChecked,
                });
            } else {
                remainingLines.push(this.cleanMarkdown(line));
            }
        });

        const cleanedContent = remainingLines.join('\n').trim();
        return { checkboxItems: items, cleanedContent };
    }

    // Helper: Remove markdown formatting
    private cleanMarkdown(text: string): string {
        return text
            .replace(/^#+\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1');
    }

    // Convert database row to Memo object
    private rowToMemo(row: MemoRow): Memo {
        return {
            id: row.id,
            title: row.title,
            content: row.content,
            checkboxItems: row.checkbox_items || undefined,
            category: row.category as MemoCategory,
            tags: row.tags || [],
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
            isPinned: row.is_pinned,
        };
    }

    // Load memos from Supabase
    private async loadMemos(): Promise<void> {
        if (!this.currentUserId) return;

        try {
            const { data, error } = await supabase
                .from('memos')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            this.memos = (data || []).map(row => this.rowToMemo(row));
        } catch (e) {
            console.error('Failed to load memos from Supabase:', e);
            this.memos = [];
        }
    }

    // Migrate memos from localStorage to Supabase (one-time)
    private async migrateFromLocalStorage(): Promise<void> {
        if (!this.currentUserId) return;

        const migrationKey = `${STORAGE_KEY}_migrated_${this.currentUserId}`;
        if (localStorage.getItem(migrationKey)) {
            // Already migrated for this user
            return;
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            const localMemos = JSON.parse(stored);
            if (!Array.isArray(localMemos) || localMemos.length === 0) {
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            console.log(`Migrating ${localMemos.length} memos from localStorage to Supabase...`);

            // Insert all local memos into Supabase
            const memosToInsert = localMemos.map((m: any) => ({
                user_id: this.currentUserId,
                title: m.title,
                content: m.content,
                checkbox_items: m.checkboxItems || null,
                category: m.category || 'general',
                tags: m.tags || [],
                is_pinned: m.isPinned || false,
                created_at: m.createdAt,
                updated_at: m.updatedAt,
            }));

            const { error } = await supabase
                .from('memos')
                .insert(memosToInsert);

            if (error) {
                console.error('Failed to migrate memos:', error);
                return;
            }

            // Mark as migrated
            localStorage.setItem(migrationKey, 'true');
            console.log('Migration completed successfully');

            // Reload memos from Supabase
            await this.loadMemos();
        } catch (e) {
            console.error('Failed to migrate from localStorage:', e);
        }
    }
}

// Export singleton instance
export const memoService = MemoService.getInstance();
