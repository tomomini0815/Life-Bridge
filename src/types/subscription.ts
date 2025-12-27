export type SubscriptionCategory = 'entertainment' | 'work' | 'utility' | 'health' | 'education' | 'other';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: 'JPY' | 'USD';
    billingCycle: 'monthly' | 'yearly';
    nextPaymentDate: string;
    category: SubscriptionCategory;
    description?: string;
    serviceUrl?: string;
    isEssential: boolean; // For optimization suggestions
    reminderDays?: number[]; // Custom reminder timing (e.g. [0, 1, 3])
}

export const SUBSCRIPTION_CATEGORIES: Record<SubscriptionCategory, { label: string; color: string }> = {
    entertainment: { label: 'エンタメ', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
    work: { label: '仕事・ツール', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    utility: { label: '通信・光熱費', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    health: { label: '健康・フィットネス', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    education: { label: '学習・教養', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    other: { label: 'その他', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
};
