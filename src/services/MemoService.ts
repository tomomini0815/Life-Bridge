import { Memo, CheckboxItem, MemoCategory } from '@/types/memo';

const STORAGE_KEY = 'lifebridge_memos';

export class MemoService {
    private static instance: MemoService;
    private memos: Memo[] = [];

    private constructor() {
        this.loadMemos();
    }

    static getInstance(): MemoService {
        if (!MemoService.instance) {
            MemoService.instance = new MemoService();
        }
        return MemoService.instance;
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
    createMemo(
        title: string,
        content: string,
        options?: {
            checkboxItems?: CheckboxItem[];
            category?: MemoCategory;
            tags?: string[];
            isPinned?: boolean;
        }
    ): Memo {
        const now = new Date();
        const memo: Memo = {
            id: `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            content,
            checkboxItems: options?.checkboxItems,
            category: options?.category || 'general',
            tags: options?.tags || [],
            createdAt: now,
            updatedAt: now,
            isPinned: options?.isPinned || false,
        };

        this.memos.push(memo);
        this.saveMemos();
        return memo;
    }

    // Update memo
    updateMemo(id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>): Memo | null {
        const index = this.memos.findIndex((m) => m.id === id);
        if (index === -1) return null;

        this.memos[index] = {
            ...this.memos[index],
            ...updates,
            updatedAt: new Date(),
        };

        this.saveMemos();
        return this.memos[index];
    }

    // Toggle checkbox item
    toggleCheckboxItem(memoId: string, itemId: string): boolean {
        const memo = this.getMemoById(memoId);
        if (!memo || !memo.checkboxItems) return false;

        const item = memo.checkboxItems.find((i) => i.id === itemId);
        if (!item) return false;

        item.checked = !item.checked;
        this.updateMemo(memoId, { checkboxItems: memo.checkboxItems });
        return true;
    }

    // Add checkbox item to memo
    addCheckboxItem(memoId: string, text: string): boolean {
        const memo = this.getMemoById(memoId);
        if (!memo) return false;

        const newItem: CheckboxItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text,
            checked: false,
        };

        const checkboxItems = memo.checkboxItems || [];
        checkboxItems.push(newItem);

        this.updateMemo(memoId, { checkboxItems });
        return true;
    }

    // Remove checkbox item
    removeCheckboxItem(memoId: string, itemId: string): boolean {
        const memo = this.getMemoById(memoId);
        if (!memo || !memo.checkboxItems) return false;

        const checkboxItems = memo.checkboxItems.filter((i) => i.id !== itemId);
        this.updateMemo(memoId, { checkboxItems });
        return true;
    }

    // Delete memo
    deleteMemo(id: string): boolean {
        const index = this.memos.findIndex((m) => m.id === id);
        if (index === -1) return false;

        this.memos.splice(index, 1);
        this.saveMemos();
        return true;
    }

    // Toggle pin
    togglePin(id: string): boolean {
        const memo = this.getMemoById(id);
        if (!memo) return false;

        this.updateMemo(id, { isPinned: !memo.isPinned });
        return true;
    }

    // Create memo from chat message
    createMemoFromChat(messageContent: string, title?: string): Memo {
        // Parse checkbox items from message and get cleaned content
        const { checkboxItems, cleanedContent } = this.extractCheckboxItems(messageContent);

        return this.createMemo(
            title || 'チャットからのメモ',
            cleanedContent,
            {
                checkboxItems: checkboxItems.length > 0 ? checkboxItems : undefined,
                category: 'chat',
                tags: ['AI'],
            }
        );
    }

    // Extract checkbox items and return cleaned content
    private extractCheckboxItems(text: string): { checkboxItems: CheckboxItem[], cleanedContent: string } {
        const items: CheckboxItem[] = [];
        const lines = text.split('\n');
        const remainingLines: string[] = [];

        lines.forEach((line) => {
            // Match patterns:
            // 1. Standard checkboxes: - [ ] item
            // 2. Bullet points: - item, * item
            // 3. Numbered lists: 1. item
            // 4. Japanese bullets: ・ item
            const match = line.match(/^\s*(?:- \[[ x]\]|-|\*|\d+\.|・)\s+(.+)$/);

            if (match) {
                items.push({
                    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    text: this.cleanMarkdown(match[1].trim()),
                    checked: false,
                });
            } else {
                remainingLines.push(this.cleanMarkdown(line));
            }
        });

        // Trim empty lines from start and end of content
        const cleanedContent = remainingLines.join('\n').trim();

        return { checkboxItems: items, cleanedContent };
    }

    // Helper: Remove markdown formatting (bold, italic, headings)
    private cleanMarkdown(text: string): string {
        // Remove bold/italic markers and headings
        return text
            .replace(/^#+\s+/gm, '')         // Headings (# Header)
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **
            .replace(/\*(.*?)\*/g, '$1')     // Italic *
            .replace(/__(.*?)__/g, '$1')     // Bold __
            .replace(/_(.*?)_/g, '$1');      // Italic _
    }

    // Legacy parser (kept but effectively replaced by above)
    private parseCheckboxItems(text: string): CheckboxItem[] {
        return this.extractCheckboxItems(text).checkboxItems;
    }

    // Storage methods
    private loadMemos(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const memos = JSON.parse(stored);
                // Convert date strings back to Date objects
                this.memos = memos.map((m: any) => ({
                    ...m,
                    createdAt: new Date(m.createdAt),
                    updatedAt: new Date(m.updatedAt),
                }));
            }
        } catch (e) {
            console.error('Failed to load memos', e);
            this.memos = [];
        }
    }

    private saveMemos(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memos));
        } catch (e) {
            console.error('Failed to save memos', e);
        }
    }
}

// Export singleton instance
export const memoService = MemoService.getInstance();
