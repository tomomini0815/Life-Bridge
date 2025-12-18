import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FaChurch, FaBaby, FaBriefcase, FaRocket, FaHome, FaHandHoldingHeart, FaStickyNote, FaCalculator, FaBell, FaCalendarAlt } from 'react-icons/fa';

interface MenuVisibilitySettings {
    marriage: boolean;
    birth: boolean;
    job: boolean;
    startup: boolean;
    moving: boolean;
    care: boolean;
    memos: boolean;
    benefits: boolean;
    reminders: boolean;
    timeline: boolean;
}

const MENU_ITEMS = [
    { id: 'marriage', label: '結婚', icon: <FaChurch />, category: 'events' },
    { id: 'birth', label: '出産', icon: <FaBaby />, category: 'events' },
    { id: 'job', label: '転職', icon: <FaBriefcase />, category: 'events' },
    { id: 'startup', label: '起業', icon: <FaRocket />, category: 'events' },
    { id: 'moving', label: '引越し', icon: <FaHome />, category: 'events' },
    { id: 'care', label: '介護', icon: <FaHandHoldingHeart />, category: 'events' },
    { id: 'memos', label: 'メモ帳', icon: <FaStickyNote />, category: 'tools' },
    { id: 'benefits', label: '給付金シミュレーター', icon: <FaCalculator />, category: 'tools' },
    { id: 'reminders', label: 'リマインダー', icon: <FaBell />, category: 'tools' },
    { id: 'timeline', label: 'ライフタイムライン', icon: <FaCalendarAlt />, category: 'tools' },
] as const;

const DEFAULT_SETTINGS: MenuVisibilitySettings = {
    marriage: true,
    birth: true,
    job: true,
    startup: true,
    moving: true,
    care: true,
    memos: true,
    benefits: true,
    reminders: true,
    timeline: true,
};

const STORAGE_KEY = 'lifebridge_menu_visibility';

export function Settings() {
    const [settings, setSettings] = useState<MenuVisibilitySettings>(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
        }
    }, []);

    const handleToggle = (id: keyof MenuVisibilitySettings) => {
        setSettings(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setHasChanges(false);
        toast.success('設定を保存しました', {
            description: 'サイドメニューの表示設定を更新しました',
        });

        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('menuVisibilityChanged', { detail: settings }));
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        setHasChanges(true);
        toast.info('デフォルト設定に戻しました', {
            description: '保存ボタンを押して確定してください',
        });
    };

    const visibleCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;

    const eventItems = MENU_ITEMS.filter(item => item.category === 'events');
    const toolItems = MENU_ITEMS.filter(item => item.category === 'tools');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                    <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">設定</h1>
                    <p className="text-muted-foreground mt-1">
                        サイドメニューの表示項目をカスタマイズできます
                    </p>
                </div>
            </div>

            {/* Stats Card */}
            <div className="glass-medium rounded-2xl p-6 border border-border/50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">表示中のメニュー項目</p>
                        <p className="text-3xl font-bold text-foreground mt-1">
                            {visibleCount} <span className="text-lg text-muted-foreground">/ {totalCount}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="gap-2"
                        >
                            <EyeOff className="w-4 h-4" />
                            リセット
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Save className="w-4 h-4" />
                            保存
                        </Button>
                    </div>
                </div>
            </div>

            {/* Life Events Section */}
            <div className="glass-medium rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-foreground">ライフイベント</h2>
                    <span className="text-sm text-muted-foreground">
                        ({eventItems.filter(item => settings[item.id as keyof MenuVisibilitySettings]).length}/{eventItems.length})
                    </span>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3">
                    {eventItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-xl transition-all duration-200",
                                settings[item.id as keyof MenuVisibilitySettings]
                                    ? "bg-primary/5 border border-primary/10"
                                    : "bg-muted/30 border border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <Label htmlFor={item.id} className="text-base font-medium cursor-pointer">
                                        {item.label}
                                    </Label>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {settings[item.id as keyof MenuVisibilitySettings] ? (
                                    <Eye className="w-4 h-4 text-primary" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                )}
                                <Switch
                                    id={item.id}
                                    checked={settings[item.id as keyof MenuVisibilitySettings]}
                                    onCheckedChange={() => handleToggle(item.id as keyof MenuVisibilitySettings)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Section */}
            <div className="glass-medium rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-foreground">ツール</h2>
                    <span className="text-sm text-muted-foreground">
                        ({toolItems.filter(item => settings[item.id as keyof MenuVisibilitySettings]).length}/{toolItems.length})
                    </span>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3">
                    {toolItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-xl transition-all duration-200",
                                settings[item.id as keyof MenuVisibilitySettings]
                                    ? "bg-primary/5 border border-primary/10"
                                    : "bg-muted/30 border border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <Label htmlFor={item.id} className="text-base font-medium cursor-pointer">
                                        {item.label}
                                    </Label>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {settings[item.id as keyof MenuVisibilitySettings] ? (
                                    <Eye className="w-4 h-4 text-primary" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                )}
                                <Switch
                                    id={item.id}
                                    checked={settings[item.id as keyof MenuVisibilitySettings]}
                                    onCheckedChange={() => handleToggle(item.id as keyof MenuVisibilitySettings)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Reminder */}
            {hasChanges && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <div className="glass-medium rounded-full px-6 py-3 border border-primary/20 shadow-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-sm font-medium">変更が保存されていません</p>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary/90 h-8"
                        >
                            保存
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
