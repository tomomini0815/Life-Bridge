import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FaChurch, FaBaby, FaBriefcase, FaRocket, FaHome, FaHandHoldingHeart, FaStickyNote, FaCalculator, FaBell, FaCalendarAlt } from 'react-icons/fa';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { User, Moon, Sun, Trash2, RefreshCw } from 'lucide-react';

interface UserProfile {
    name: string;
}

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
const PROFILE_KEY = 'lifebridge_user_profile';
const THEME_KEY = 'lifebridge_theme';

export function Settings() {
    const [settings, setSettings] = useState<MenuVisibilitySettings>(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({ name: 'Tomomi' });
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Load settings from localStorage
    useEffect(() => {
        // Menu Visibility
        const storedSettings = localStorage.getItem(STORAGE_KEY);
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
        }

        // Profile
        const storedProfile = localStorage.getItem(PROFILE_KEY);
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                setProfile(parsed);
            } catch (e) {
                console.error('Failed to parse profile:', e);
            }
        }

        // Theme
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) {
            setTheme(storedTheme as 'light' | 'dark');
            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme('dark');
                document.documentElement.classList.add('dark');
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

        // Trigger a custom event to notify AppSidebar
        window.dispatchEvent(new CustomEvent('menuVisibilityChanged', { detail: settings }));
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        setHasChanges(true);
        toast.info('デフォルト設定に戻しました', {
            description: '保存ボタンを押して確定してください',
        });
    };

    const handleSaveProfile = () => {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        toast.success('プロフィールを更新しました');
        // Notify DashboardHome
        window.dispatchEvent(new CustomEvent('userProfileChanged', { detail: profile }));
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleResetData = () => {
        if (confirm('本当にすべてのデータをリセットしますか？この操作は取り消せません。')) {
            localStorage.clear();
            toast.success('データをリセットしました');
            window.location.reload();
        }
    };

    const visibleCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;

    const eventItems = MENU_ITEMS.filter(item => item.category === 'events');
    const toolItems = MENU_ITEMS.filter(item => item.category === 'tools');

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                    <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">設定</h1>
                    <p className="text-muted-foreground mt-1">
                        アプリの全体設定とカスタマイズ
                    </p>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general">一般設定</TabsTrigger>
                    <TabsTrigger value="menu">メニュー表示</TabsTrigger>
                    <TabsTrigger value="data">データ管理</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    {/* Profile */}
                    <div className="glass-medium rounded-2xl p-6 border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">プロフィール設定</h2>
                        </div>
                        <Separator className="mb-6" />
                        <div className="grid gap-4 max-w-md">
                            <div className="grid gap-2">
                                <Label htmlFor="name">表示名</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="あなたの名前"
                                    />
                                    <Button onClick={handleSaveProfile}>保存</Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    この名前はダッシュボードの挨拶などで使用されます。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="glass-medium rounded-2xl p-6 border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                            {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                            <h2 className="text-xl font-bold text-foreground">外観設定</h2>
                        </div>
                        <Separator className="mb-6" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">ダークモード</h3>
                                <p className="text-sm text-muted-foreground">
                                    画面の配色を暗くして、目の負担を軽減します。
                                </p>
                            </div>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Menu Visibility Settings */}
                <TabsContent value="menu" className="space-y-6">
                    <div className="glass-medium rounded-2xl p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">サイドメニュー表示設定</h2>
                                <p className="text-sm text-muted-foreground">表示中の項目: {visibleCount} / {totalCount}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleReset} className="gap-2">
                                    <EyeOff className="w-4 h-4" /> リセット
                                </Button>
                                <Button onClick={handleSave} disabled={!hasChanges} className="gap-2 bg-primary">
                                    <Save className="w-4 h-4" /> 保存
                                </Button>
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="font-bold text-foreground mb-4 pl-2 border-l-4 border-primary">ライフイベント</h3>
                                <div className="space-y-3">
                                    {eventItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 border",
                                                settings[item.id as keyof MenuVisibilitySettings]
                                                    ? "bg-primary/5 border-primary/10"
                                                    : "bg-muted/30 border-transparent opacity-60"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                                            </div>
                                            <Switch
                                                id={item.id}
                                                checked={settings[item.id as keyof MenuVisibilitySettings]}
                                                onCheckedChange={() => handleToggle(item.id as keyof MenuVisibilitySettings)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-foreground mb-4 pl-2 border-l-4 border-amber-500">ツール</h3>
                                <div className="space-y-3">
                                    {toolItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 border",
                                                settings[item.id as keyof MenuVisibilitySettings]
                                                    ? "bg-primary/5 border-primary/10"
                                                    : "bg-muted/30 border-transparent opacity-60"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                                            </div>
                                            <Switch
                                                id={item.id}
                                                checked={settings[item.id as keyof MenuVisibilitySettings]}
                                                onCheckedChange={() => handleToggle(item.id as keyof MenuVisibilitySettings)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Data Management */}
                <TabsContent value="data" className="space-y-6">
                    <div className="glass-medium rounded-2xl p-6 border border-border/50 border-red-200/20 bg-red-50/30 dark:bg-red-900/10">
                        <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
                            <Trash2 className="w-5 h-5" />
                            <h2 className="text-xl font-bold">データ管理</h2>
                        </div>
                        <Separator className="mb-6 bg-red-200/50" />

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-foreground">データの初期化</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    保存されているすべてのデータ（設定、メモ、入力内容など）を削除し、アプリを初期状態に戻します。
                                    <br />
                                    <span className="font-bold text-red-500">この操作は取り消せません。</span>
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleResetData}
                                className="w-full sm:w-auto"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                すべてのデータをリセットして再読み込み
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

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
