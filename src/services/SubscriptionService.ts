import { Subscription } from '@/types/subscription';
import { notificationService } from './NotificationService';

const STORAGE_KEY = 'lifebridge_subscriptions';

export class SubscriptionService {
    private static instance: SubscriptionService;
    private subscriptions: Subscription[] = [];

    private constructor() {
        this.subscriptions = this.loadSubscriptions();
    }

    static getInstance(): SubscriptionService {
        if (!SubscriptionService.instance) {
            SubscriptionService.instance = new SubscriptionService();
        }
        return SubscriptionService.instance;
    }

    // Load subscriptions from local storage
    private loadSubscriptions(): Subscription[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load subscriptions', e);
        }
        return [];
    }

    // Save subscriptions to local storage
    private saveSubscriptions(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.subscriptions));
            // Dispatch event for reactive updates if needed across components
            window.dispatchEvent(new CustomEvent('subscriptionsChanged', { detail: this.subscriptions }));
        } catch (e) {
            console.error('Failed to save subscriptions', e);
        }
    }

    // Get all subscriptions
    getSubscriptions(): Subscription[] {
        return [...this.subscriptions];
    }

    // Add a new subscription
    addSubscription(subscription: Omit<Subscription, 'id'>): Subscription {
        const newSubscription: Subscription = {
            ...subscription,
            id: crypto.randomUUID(),
        };

        this.subscriptions.push(newSubscription);
        this.saveSubscriptions();
        this.scheduleReminder(newSubscription);

        return newSubscription;
    }

    // Update an existing subscription
    updateSubscription(id: string, updates: Partial<Subscription>): Subscription | null {
        const index = this.subscriptions.findIndex(s => s.id === id);
        if (index === -1) return null;

        const updatedSubscription = { ...this.subscriptions[index], ...updates };
        this.subscriptions[index] = updatedSubscription;
        this.saveSubscriptions();

        // Reschedule reminder if date or name changed
        if (updates.nextPaymentDate || updates.name) {
            this.scheduleReminder(updatedSubscription);
        }

        return updatedSubscription;
    }

    // Delete a subscription
    deleteSubscription(id: string): void {
        const subscription = this.subscriptions.find(s => s.id === id);
        if (!subscription) return;

        this.subscriptions = this.subscriptions.filter(s => s.id !== id);
        this.saveSubscriptions();

        // Cancel reminders for this subscription
        // Note: NotificationService handles cancelling by TaskID. 
        // We'll use subscription ID as the "TaskID" context for reminders.
        notificationService.clearTaskReminders(id);
    }

    // Schedule reminder via NotificationService
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
