import { Subscription, SubscriptionCategory } from '@/types/subscription';
import { notificationService } from './NotificationService';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'lifebridge_subscriptions';

// Internal row interface
interface SubscriptionRow {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    currency: string;
    billing_cycle: string;
    next_payment_date: string;
    category: string;
    is_essential: boolean;
    reminder_days: number[] | null;
    created_at: string;
    updated_at: string;
}

export class SubscriptionService {
    private static instance: SubscriptionService;
    private subscriptions: Subscription[] = [];
    private currentUserId: string | null = null;

    private constructor() { }

    static getInstance(): SubscriptionService {
        if (!SubscriptionService.instance) {
            SubscriptionService.instance = new SubscriptionService();
        }
        return SubscriptionService.instance;
    }

    async setUser(userId: string | null): Promise<void> {
        this.currentUserId = userId;
        if (userId) {
            await this.loadSubscriptions();
            await this.loadSubscriptions();
            // await this.migrateFromLocalStorage();
        } else {
            this.subscriptions = [];
        }
    }

    private rowToSubscription(row: SubscriptionRow): Subscription {
        return {
            id: row.id,
            name: row.name,
            amount: row.amount,
            currency: (row.currency as 'JPY' | 'USD') || 'JPY',
            billingCycle: (row.billing_cycle as 'monthly' | 'yearly') || 'monthly',
            nextPaymentDate: row.next_payment_date,
            category: (row.category as SubscriptionCategory) || 'entertainment',
            isEssential: row.is_essential,
            reminderDays: row.reminder_days || [],
        };
    }

    private async loadSubscriptions(): Promise<void> {
        if (!this.currentUserId) return;

        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', this.currentUserId);

            if (error) throw error;

            if (data) {
                this.subscriptions = data.map(row => this.rowToSubscription(row as unknown as SubscriptionRow));
                this.notifyChange();

                // Sync reminders: Remove orphans then reschedule active ones
                notificationService.syncSubscriptionReminders(this.subscriptions.map(s => s.id));

                this.subscriptions.forEach(sub => {
                    if (sub.reminderDays && sub.reminderDays.length > 0) {
                        this.scheduleReminder(sub);
                    }
                });
            }
        } catch (e) {
            console.error('Failed to load subscriptions:', e);
        }
    }

    private async migrateFromLocalStorage(): Promise<void> {
        if (!this.currentUserId) return;
        const migrationKey = `${STORAGE_KEY}_migrated_${this.currentUserId}`;
        if (localStorage.getItem(migrationKey)) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            const localSubs: Subscription[] = JSON.parse(stored);
            if (localSubs.length === 0) {
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            console.log(`Migrating ${localSubs.length} subscriptions...`);
            const subsToInsert = localSubs.map(s => ({
                user_id: this.currentUserId,
                name: s.name,
                amount: s.amount,
                currency: s.currency,
                billing_cycle: s.billingCycle,
                next_payment_date: s.nextPaymentDate,
                category: s.category,
                is_essential: s.isEssential,
                reminder_days: s.reminderDays
            }));

            const { error } = await supabase.from('subscriptions').insert(subsToInsert);
            if (error) throw error;

            localStorage.setItem(migrationKey, 'true');
            await this.loadSubscriptions();

        } catch (e) {
            console.error('Migration failed:', e);
        }
    }

    private notifyChange() {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('subscriptionsChanged', { detail: [...this.subscriptions] }));
        }
    }

    getSubscriptions(): Subscription[] {
        return [...this.subscriptions];
    }

    async addSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription | null> {
        if (!this.currentUserId) return null;

        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: this.currentUserId,
                    name: subscription.name,
                    amount: subscription.amount,
                    currency: subscription.currency,
                    billing_cycle: subscription.billingCycle,
                    next_payment_date: subscription.nextPaymentDate,
                    category: subscription.category,
                    is_essential: subscription.isEssential,
                    reminder_days: subscription.reminderDays
                })
                .select()
                .single();

            if (error) throw error;

            const newSub = this.rowToSubscription(data as unknown as SubscriptionRow);
            this.subscriptions.push(newSub);
            this.notifyChange();
            this.scheduleReminder(newSub);
            return newSub;

        } catch (e) {
            console.error('Add subscription failed:', e);
            return null;
        }
    }

    async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null> {
        if (!this.currentUserId) return null;

        try {
            // Map to snake_case
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
            if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
            if (updates.billingCycle !== undefined) dbUpdates.billing_cycle = updates.billingCycle;
            if (updates.nextPaymentDate !== undefined) dbUpdates.next_payment_date = updates.nextPaymentDate;
            if (updates.category !== undefined) dbUpdates.category = updates.category;
            if (updates.isEssential !== undefined) dbUpdates.is_essential = updates.isEssential;
            if (updates.reminderDays !== undefined) dbUpdates.reminder_days = updates.reminderDays;

            const { data, error } = await supabase
                .from('subscriptions')
                .update(dbUpdates)
                .eq('id', id)
                .eq('user_id', this.currentUserId)
                .select()
                .single();

            if (error) throw error;

            const updatedSub = this.rowToSubscription(data as unknown as SubscriptionRow);
            const index = this.subscriptions.findIndex(s => s.id === id);
            if (index !== -1) {
                this.subscriptions[index] = updatedSub;
                this.notifyChange();

                if (updates.nextPaymentDate || updates.name || updates.reminderDays) {
                    this.scheduleReminder(updatedSub);
                }
            }
            return updatedSub;

        } catch (e) {
            console.error('Update subscription failed:', e);
            return null;
        }
    }

    async deleteSubscription(id: string): Promise<boolean> {
        if (!this.currentUserId) return false;

        try {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id)
                .eq('user_id', this.currentUserId);

            if (error) throw error;

            this.subscriptions = this.subscriptions.filter(s => s.id !== id);
            this.notifyChange();
            notificationService.clearSubscriptionReminders(id);
            return true;

        } catch (e) {
            console.error('Delete subscription failed:', e);
            return false;
        }
    }

    private scheduleReminder(subscription: Subscription): void {
        notificationService.scheduleSubscriptionReminder({
            id: subscription.id,
            name: subscription.name,
            nextPaymentDate: subscription.nextPaymentDate,
            amount: subscription.amount,
            currency: subscription.currency,
            reminderDays: subscription.reminderDays
        });
    }
}

export const subscriptionService = SubscriptionService.getInstance();
