export interface CheckboxItem {
    id: string;
    text: string;
    checked: boolean;
}

export interface Memo {
    id: string;
    title: string;
    content: string;
    checkboxItems?: CheckboxItem[];
    category?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    isPinned?: boolean;
}

export type MemoCategory = 'general' | 'tasks' | 'chat' | 'important';
