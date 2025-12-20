import { useState, useEffect } from 'react';
import { notificationService, ScheduledReminder } from '@/services/NotificationService';
import { cn } from '@/lib/utils';
import { Bell, BellOff, Clock, Check, X, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionManager } from './SubscriptionManager';

export function ReminderSettings() {
    const [enabled, setEnabled] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState<number[]>([1, 3, 7]);
    const [notificationTime, setNotificationTime] = useState('09:00');
    const [upcomingReminders, setUpcomingReminders] = useState<ScheduledReminder[]>([]);
    const [showPermissionBanner, setShowPermissionBanner] = useState(false);

    useEffect(() => {
        loadSettings();
        checkPermission();
        loadReminders();
    }, []);

    const loadSettings = () => {
        const settings = notificationService.getSettings();
        setEnabled(settings.enabled);
        setDaysBeforeDeadline(settings.daysBeforeDeadline);
        setNotificationTime(settings.notificationTime);
    };

    const checkPermission = () => {
        if ('Notification' in window) {
            setHasPermission(Notification.permission === 'granted');
            setShowPermissionBanner(Notification.permission === 'default');
        }
    };

    const loadReminders = () => {
        const reminders = notificationService.getUpcomingReminders();
        setUpcomingReminders(reminders);
    };

    const handleRequestPermission = async () => {
        const granted = await notificationService.requestPermission();
        setHasPermission(granted);
        setShowPermissionBanner(false);
        if (granted) {
            handleToggleEnabled(true);
        }
    };

    const handleToggleEnabled = (value: boolean) => {
        setEnabled(value);
        notificationService.updateSettings({ enabled: value });
    };

    const handleDaysChange = (day: number, checked: boolean) => {
        const newDays = checked
            ? [...daysBeforeDeadline, day].sort((a, b) => a - b)
            : daysBeforeDeadline.filter((d) => d !== day);

        setDaysBeforeDeadline(newDays);
        notificationService.updateSettings({ daysBeforeDeadline: newDays });
    };

    const handleTimeChange = (time: string) => {
        setNotificationTime(time);
        notificationService.updateSettings({ notificationTime: time });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="glass-medium rounded-3xl p-8 border border-border/50 shadow-soft">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Bell className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground font-display">サブスク管理</h1>
                        <p className="text-muted-foreground">リマインダーと定期支払いの管理</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="subscriptions" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="subscriptions">サブスク管理</TabsTrigger>
                    <TabsTrigger value="reminders">リマインダー設定</TabsTrigger>
                </TabsList>

                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions" className="space-y-6 animate-fade-in">
                    <SubscriptionManager />
                </TabsContent>

                {/* Reminders Tab */}
                <TabsContent value="reminders" className="space-y-6 animate-fade-in">
                    {/* Permission Banner */}
                    {showPermissionBanner && (
                        <div className="glass-medium rounded-2xl p-6 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground mb-1">通知の許可が必要です</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        期限リマインダーを受け取るには、ブラウザの通知を許可してください。
                                    </p>
                                    <Button onClick={handleRequestPermission} size="sm">
                                        <Bell className="w-4 h-4 mr-2" />
                                        通知を許可する
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    <div className="glass-medium rounded-3xl p-6 border border-border/50 shadow-soft">
                        <h2 className="text-xl font-bold mb-6">通知設定</h2>

                        <div className="space-y-6">
                            {/* Enable/Disable */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                <div>
                                    <h3 className="font-bold text-foreground">リマインダーを有効にする</h3>
                                    <p className="text-sm text-muted-foreground">期限が近づいたら通知を受け取る</p>
                                </div>
                                <button
                                    onClick={() => handleToggleEnabled(!enabled)}
                                    disabled={!hasPermission}
                                    className={cn(
                                        "relative w-14 h-8 rounded-full transition-colors",
                                        enabled && hasPermission ? "bg-green-500" : "bg-muted",
                                        !hasPermission && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform",
                                            enabled ? "translate-x-7" : "translate-x-1"
                                        )}
                                    />
                                </button>
                            </div>

                            {/* Days Before Deadline */}
                            <div>
                                <h3 className="font-bold text-foreground mb-3">通知タイミング</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    期限の何日前に通知するか選択してください
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[1, 3, 7, 14].map((day) => (
                                        <label
                                            key={day}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all",
                                                daysBeforeDeadline.includes(day)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={daysBeforeDeadline.includes(day)}
                                                onChange={(e) => handleDaysChange(day, e.target.checked)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                                            />
                                            <span className="text-sm font-medium">{day}日前</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Notification Time */}
                            <div>
                                <h3 className="font-bold text-foreground mb-3">通知時刻</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    通知を受け取る時刻を設定してください
                                </p>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="time"
                                        value={notificationTime}
                                        onChange={(e) => handleTimeChange(e.target.value)}
                                        className="px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Reminders */}
                    <div className="glass-medium rounded-3xl p-6 border border-border/50 shadow-soft">
                        <h2 className="text-xl font-bold mb-6">予定されているリマインダー</h2>

                        {upcomingReminders.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingReminders.map((reminder) => (
                                    <div
                                        key={reminder.id}
                                        className="p-4 rounded-xl bg-muted/30 border border-border/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground mb-1">
                                                    {reminder.taskTitle}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    期限: {reminder.deadline}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {new Date(reminder.reminderDate).toLocaleString('ja-JP', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                        に通知
                                                    </span>
                                                </div>
                                            </div>
                                            {reminder.sent && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700">
                                                    送信済み
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                    <BellOff className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    予定されているリマインダーはありません
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
