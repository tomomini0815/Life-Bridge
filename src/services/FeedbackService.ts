import { Feedback, FeedbackRow, FeedbackCategory } from '@/types/feedback';
import { supabase } from '@/lib/supabase';

export class FeedbackService {
    private static instance: FeedbackService;

    private constructor() { }

    static getInstance(): FeedbackService {
        if (!FeedbackService.instance) {
            FeedbackService.instance = new FeedbackService();
        }
        return FeedbackService.instance;
    }

    /**
     * Submit new feedback
     */
    async submitFeedback(data: {
        userId: string | null;
        category: FeedbackCategory;
        subcategory: string;
        subject: string;
        details: string;
        email?: string;
    }): Promise<Feedback | null> {
        try {
            const { data: result, error } = await supabase
                .from('feedback')
                .insert({
                    user_id: data.userId,
                    category: data.category,
                    subcategory: data.subcategory,
                    subject: data.subject,
                    details: data.details,
                    email: data.email || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) {
                console.error('Failed to submit feedback:', error);
                return null;
            }

            return this.rowToFeedback(result);
        } catch (e) {
            console.error('Failed to submit feedback:', e);
            return null;
        }
    }

    /**
     * Get all feedback for a specific user
     */
    async getUserFeedback(userId: string): Promise<Feedback[]> {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to get user feedback:', error);
                return [];
            }

            return (data || []).map(row => this.rowToFeedback(row));
        } catch (e) {
            console.error('Failed to get user feedback:', e);
            return [];
        }
    }

    /**
     * Get feedback by ID
     */
    async getFeedbackById(id: string): Promise<Feedback | null> {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Failed to get feedback:', error);
                return null;
            }

            return this.rowToFeedback(data);
        } catch (e) {
            console.error('Failed to get feedback:', e);
            return null;
        }
    }

    /**
     * Update feedback status (for admin use)
     */
    async updateFeedbackStatus(
        id: string,
        status: 'pending' | 'in_progress' | 'resolved'
    ): Promise<Feedback | null> {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Failed to update feedback status:', error);
                return null;
            }

            return this.rowToFeedback(data);
        } catch (e) {
            console.error('Failed to update feedback status:', e);
            return null;
        }
    }

    /**
     * Convert database row to Feedback object
     */
    private rowToFeedback(row: FeedbackRow): Feedback {
        return {
            id: row.id,
            userId: row.user_id,
            category: row.category as FeedbackCategory,
            subcategory: row.subcategory,
            subject: row.subject,
            details: row.details,
            email: row.email || undefined,
            status: row.status as 'pending' | 'in_progress' | 'resolved',
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}

// Export singleton instance
export const feedbackService = FeedbackService.getInstance();
