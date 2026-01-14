export type FeedbackCategory = 'inquiry' | 'feature' | 'opinion' | 'bug';
export type FeedbackStatus = 'pending' | 'in_progress' | 'resolved';

export interface Feedback {
    id: string;
    userId: string | null;
    category: FeedbackCategory;
    subcategory: string;
    subject: string;
    details: string;
    email?: string;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface FeedbackRow {
    id: string;
    user_id: string | null;
    category: string;
    subcategory: string;
    subject: string;
    details: string;
    email: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SubcategoryOption {
    value: string;
    label: string;
}
