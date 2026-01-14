import { supabase } from '@/lib/supabase';
import { AiMessage } from './AiConciergeService';

interface ChatMessageRow {
    id: string;
    user_id: string;
    role: 'user' | 'assistant';
    content: string;
    actions: string[] | null;
    timestamp: string;
    created_at: string;
}

export class ChatService {
    private static instance: ChatService;
    private currentUserId: string | null = null;

    private constructor() { }

    static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    setUser(userId: string | null) {
        this.currentUserId = userId;
    }

    async loadMessages(): Promise<AiMessage[]> {
        if (!this.currentUserId) return [];

        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', this.currentUserId)
                .order('timestamp', { ascending: true }); // Oldest first?

            if (error) throw error;

            if (data) {
                return data.map(this.rowToMessage);
            }
        } catch (e) {
            console.error('Failed to load chat messages:', e);
        }
        return [];
    }

    async saveMessage(message: Omit<AiMessage, 'id'>): Promise<AiMessage | null> {
        if (!this.currentUserId) return null;

        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                    user_id: this.currentUserId,
                    role: message.role,
                    content: message.content,
                    actions: message.actions || null,
                    timestamp: message.timestamp.toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            return this.rowToMessage(data as unknown as ChatMessageRow);
        } catch (e) {
            console.error('Failed to save chat message:', e);
            return null;
        }
    }

    private rowToMessage(row: ChatMessageRow): AiMessage {
        return {
            id: row.id,
            role: row.role,
            content: row.content,
            timestamp: new Date(row.timestamp),
            actions: row.actions || undefined,
        };
    }
}

export const chatService = ChatService.getInstance();
