import { useState, useMemo, useEffect } from 'react';
import { Subscription, SUBSCRIPTION_CATEGORIES, SubscriptionCategory } from '@/types/subscription';
import { Plus, Trash2, Edit2, AlertTriangle, TrendingUp, PieChart, ExternalLink, Calendar as CalendarIcon, Wallet, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { subscriptionService } from '@/services/SubscriptionService';
import { notificationService } from '@/services/NotificationService';
import { useAuth } from '@/contexts/AuthContext';

const BRAND_DOMAINS: Record<string, string> = {
    'amazon': 'amazon.co.jp',
    'prime': 'amazon.co.jp',
    'aws': 'aws.amazon.com',
    'netflix': 'netflix.com',
    'hulu': 'hulu.jp',
    'disney': 'disneyplus.com',
    'youtube': 'youtube.com',
    'google': 'google.com',
    'apple': 'apple.com',
    'icloud': 'apple.com',
    'spotify': 'spotify.com',
    'adobe': 'adobe.com',
    'creative': 'adobe.com',
    'microsoft': 'microsoft.com',
    'office': 'office.com',
    'chatgpt': 'openai.com',
    'openai': 'openai.com',
    'claude': 'anthropic.com',
    'github': 'github.com',
    'notion': 'notion.so',
    'slack': 'slack.com',
    'zoom': 'zoom.us',
    'nintendo': 'nintendo.co.jp',
    'playstation': 'playstation.com',
    'xbox': 'xbox.com',
    'dropbox': 'dropbox.com',
    'evernote': 'evernote.com',
    'deepl': 'deepl.com',
    'canva': 'canva.com',
    'cookpad': 'cookpad.com',
    'udemy': 'udemy.com',
};

const getBrandIconUrl = (name: string): string | null => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const searchName = normalize(name);

    // Direct match check first
    for (const [key, domain] of Object.entries(BRAND_DOMAINS)) {
        if (searchName.includes(key)) {
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        }
    }
    return null;
};

export function SubscriptionManager() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [reminderSettings, setReminderSettings] = useState<number[]>([0, 1, 3]); // Default: Today, Yesterday, 3 days before
    const [filterReview, setFilterReview] = useState(false);

    // Reset reminders when modal opens/closes or editing changes
    useEffect(() => {
        if (isModalOpen) {
            if (editingSubscription && editingSubscription.reminderDays) {
                setReminderSettings(editingSubscription.reminderDays);
            } else if (editingSubscription) {
                // Default for existing subs without settings
                setReminderSettings([0, 1, 3]);
            } else {
                // Default for new subs
                setReminderSettings([0, 1, 3]);
            }
        }
    }, [isModalOpen, editingSubscription]);

    const toggleReminder = (day: number) => {
        setReminderSettings(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    // Initial load and event listener
    useEffect(() => {
        if (user) {
            subscriptionService.setUser(user.id);
        }
        setSubscriptions(subscriptionService.getSubscriptions());

        const handleChange = (e: CustomEvent<Subscription[]>) => {
            setSubscriptions(e.detail);
        };

        const handleNavigate = (e: CustomEvent<{ subscriptionId: string }>) => {
            const sub = subscriptionService.getSubscriptions().find(s => s.id === e.detail.subscriptionId);
            if (sub) {
                setEditingSubscription(sub);
                setIsModalOpen(true);
            }
        };

        window.addEventListener('subscriptionsChanged', handleChange as EventListener);
        window.addEventListener('navigate-to-subscription', handleNavigate as EventListener);

        return () => {
            window.removeEventListener('subscriptionsChanged', handleChange as EventListener);
            window.removeEventListener('navigate-to-subscription', handleNavigate as EventListener);
        };
    }, []);



    // Stats Calculation
    const stats = useMemo(() => {
        let monthlyTotal = 0;
        let yearlyTotal = 0;
        const categoryTotals: Record<string, number> = {};

        subscriptions.forEach(sub => {
            let monthlyAmount = sub.amount;
            if (sub.currency === 'USD') {
                monthlyAmount = sub.amount * 150; // Simple USD to JPY conversion
            }

            if (sub.billingCycle === 'yearly') {
                monthlyAmount = monthlyAmount / 12;
            }

            monthlyTotal += monthlyAmount;
            yearlyTotal += (sub.billingCycle === 'yearly' ? (sub.currency === 'USD' ? sub.amount * 150 : sub.amount) : monthlyAmount * 12);

            categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount;
        });

        return { monthlyTotal, yearlyTotal, categoryTotals };
    }, [subscriptions]);

    const handleDelete = async (id: string) => {
        await subscriptionService.deleteSubscription(id);
        toast.success('サブスクリプションを削除しました');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const subData = {
            name: formData.get('name') as string,
            amount: Number(formData.get('amount')),
            currency: formData.get('currency') as 'JPY' | 'USD',
            billingCycle: formData.get('billingCycle') as 'monthly' | 'yearly',
            nextPaymentDate: formData.get('nextPaymentDate') as string,
            category: formData.get('category') as SubscriptionCategory,
            isEssential: formData.get('isEssential') === 'on',
            reminderDays: reminderSettings,
        };

        if (editingSubscription) {
            await subscriptionService.updateSubscription(editingSubscription.id, subData);
            toast.success('サブスクリプションを更新しました');
        } else {
            await subscriptionService.addSubscription(subData);
            toast.success('サブスクリプションを追加しました');
        }

        setIsModalOpen(false);
        setEditingSubscription(null);
    };

    const openAddModal = () => {
        setEditingSubscription(null);
        setIsModalOpen(true);
    };

    const openEditModal = (sub: Subscription) => {
        setEditingSubscription(sub);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/40 rounded-2xl p-6 text-orange-900 dark:text-orange-100 shadow-soft">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm font-medium">月額固定費（概算）</span>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                        ¥{Math.round(stats.monthlyTotal).toLocaleString()}
                    </div>
                    <p className="text-sm mt-2 opacity-80">
                        年間予測: ¥{Math.round(stats.yearlyTotal).toLocaleString()}
                    </p>
                </div>

                <div className="glass-medium rounded-2xl p-6 border border-border/50">
                    <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                        <PieChart className="w-5 h-5" />
                        <span className="text-sm font-medium">カテゴリー分析</span>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(stats.categoryTotals)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([cat, amount]) => (
                                <div key={cat} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full", SUBSCRIPTION_CATEGORIES[cat as SubscriptionCategory].color.split(' ')[0])} />
                                        <span>{SUBSCRIPTION_CATEGORIES[cat as SubscriptionCategory].label}</span>
                                    </div>
                                    <span className="font-semibold">¥{Math.round(amount).toLocaleString()}</span>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="glass-medium rounded-2xl p-6 border-2 border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10">
                    <div className="flex items-center gap-3 mb-3 text-amber-600 dark:text-amber-500">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-bold">コスト最適化の提案</span>
                    </div>
                    <p className="text-sm text-foreground/80 mb-3">
                        エンタメ系の支出が全体の{stats.monthlyTotal > 0 ? Math.round((stats.categoryTotals['entertainment'] || 0) / stats.monthlyTotal * 100) : 0}%を占めています。
                    </p>
                    <Button
                        size="sm"
                        variant={filterReview ? "secondary" : "outline"}
                        className={cn(
                            "w-full border-amber-200 text-amber-700",
                            filterReview ? "bg-amber-200 hover:bg-amber-300" : "bg-white/50 hover:bg-amber-100"
                        )}
                        onClick={() => setFilterReview(!filterReview)}
                    >
                        {filterReview ? '全て表示' : '見直しリストを確認'}
                    </Button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">登録済みサブスクリプション</h2>
                <div className="flex items-center gap-2">

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={openAddModal}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" /> 追加する
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] glass-medium">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingSubscription ? 'サブスクリプションを編集' : 'サブスクリプションを追加'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">サービス名</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="例: Netflix"
                                        className="bg-white/50"
                                        defaultValue={editingSubscription?.name}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">金額</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            required
                                            placeholder="1000"
                                            className="bg-white/50"
                                            defaultValue={editingSubscription?.amount}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">通貨</Label>
                                        <Select name="currency" defaultValue={editingSubscription?.currency || "JPY"}>
                                            <SelectTrigger className="bg-white/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="billingCycle">支払いサイクル</Label>
                                        <Select name="billingCycle" defaultValue={editingSubscription?.billingCycle || "monthly"}>
                                            <SelectTrigger className="bg-white/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">月払い</SelectItem>
                                                <SelectItem value="yearly">年払い</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>次回更新日</Label>
                                        <Input
                                            id="nextPaymentDate"
                                            name="nextPaymentDate"
                                            type="date"
                                            required
                                            className="bg-white/50"
                                            defaultValue={editingSubscription?.nextPaymentDate}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">カテゴリー</Label>
                                    <Select name="category" defaultValue={editingSubscription?.category || "entertainment"}>
                                        <SelectTrigger className="bg-white/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SUBSCRIPTION_CATEGORIES).map(([key, info]) => (
                                                <SelectItem key={key} value={key}>{info.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <Label>通知タイミング</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { day: 0, label: '当日' },
                                            { day: 1, label: '1日前' },
                                            { day: 3, label: '3日前' },
                                            { day: 7, label: '1週間前' }
                                        ].map((option) => (
                                            <div key={option.day} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`reminder-${option.day}`}
                                                    checked={reminderSettings.includes(option.day)}
                                                    onChange={() => toggleReminder(option.day)}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <Label htmlFor={`reminder-${option.day}`} className="cursor-pointer text-sm font-normal">
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isEssential"
                                        name="isEssential"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        defaultChecked={editingSubscription?.isEssential}
                                    />
                                    <Label htmlFor="isEssential" className="cursor-pointer">必須サービスとしてマーク（生活に不可欠）</Label>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">
                                        {editingSubscription ? '更新する' : '登録する'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Subscription List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.filter(sub => !filterReview || !sub.isEssential).map((sub) => (
                    <div key={sub.id} className="group relative bg-white/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm overflow-hidden",
                                SUBSCRIPTION_CATEGORIES[sub.category].color,
                                getBrandIconUrl(sub.name) ? "bg-white p-2" : ""
                            )}>
                                {getBrandIconUrl(sub.name) ? (
                                    <img
                                        src={getBrandIconUrl(sub.name)!}
                                        alt={sub.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            // Fallback to text if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerText = sub.name.charAt(0);
                                        }}
                                    />
                                ) : (
                                    sub.name.charAt(0)
                                )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => openEditModal(sub)}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="glass-medium">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>サブスクリプションの削除</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                「{sub.name}」を削除してもよろしいですか？<br />
                                                この操作は取り消せません。
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(sub.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                削除する
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-tight" title={sub.name}>{sub.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono">
                                    {sub.currency === 'JPY' ? '¥' : '$'}{sub.amount.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    / {sub.billingCycle === 'monthly' ? '月' : '年'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/30">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>次回: {sub.nextPaymentDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-7 px-3 text-xs font-medium transition-all gap-1.5 rounded-full",
                                        sub.reminderDays && sub.reminderDays.length > 0
                                            ? "bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-gray-300 border border-transparent"
                                    )}
                                    onClick={async () => {
                                        const newReminders = (sub.reminderDays && sub.reminderDays.length > 0) ? [] : [0, 1, 3];
                                        await subscriptionService.updateSubscription(sub.id, { reminderDays: newReminders });
                                        toast.success(newReminders.length > 0 ? 'リマインダーをONにしました' : 'リマインダーをOFFにしました');
                                    }}
                                >
                                    <Bell className={cn("w-3 h-3", sub.reminderDays && sub.reminderDays.length > 0 && "fill-current")} />
                                    {sub.reminderDays && sub.reminderDays.length > 0 ? "通知ON" : "通知OFF"}
                                </Button>
                                {!sub.isEssential && (
                                    <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-900/20">
                                        <AlertTriangle className="w-3 h-3" /> 見直し候補
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
