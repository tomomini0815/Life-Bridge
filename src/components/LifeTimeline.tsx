import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Plus, Pencil, Trash2, Calendar, FileText, Type } from 'lucide-react';
import { TimelineEvent, TimelineStatus, TimelineScenario, timelineService, ICON_MAP } from '@/services/TimelineService';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimelineGenerator } from './TimelineGenerator';

export function LifeTimeline() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [scenario, setScenario] = useState<TimelineScenario>('current');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
    const [formData, setFormData] = useState<Partial<TimelineEvent>>({});

    useEffect(() => {
        loadEvents();
    }, [scenario]);

    const loadEvents = () => {
        setEvents(timelineService.getEvents(scenario));
    };

    const handleOpenAdd = () => {
        setEditingEvent(null);
        setFormData({
            year: new Date().getFullYear().toString(),
            status: 'future',
            iconName: 'star',
            scenario: scenario
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (event: TimelineEvent) => {
        setEditingEvent(event);
        setFormData({ ...event });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.year || !formData.title || !formData.description || !formData.status || !formData.iconName) {
            return;
        }

        const eventData = { ...formData, scenario } as Omit<TimelineEvent, 'id'>;

        if (editingEvent) {
            timelineService.updateEvent(editingEvent.id, eventData);
        } else {
            timelineService.addEvent(eventData);
        }
        loadEvents();
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('このイベントを削除してもよろしいですか？')) {
            timelineService.deleteEvent(id);
            loadEvents();
        }
    };

    return (
        <div className="relative py-10 px-6">
            {/* Header Actions */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <Tabs value={scenario} onValueChange={(v) => setScenario(v as TimelineScenario)} className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="current">現状の未来 (Current)</TabsTrigger>
                        <TabsTrigger value="ideal">理想の未来 (Ideal)</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    <TimelineGenerator onGenerate={loadEvents} />
                    <Button onClick={handleOpenAdd} className="shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        追加
                    </Button>
                </div>
            </div>

            {/* Central Line */}
            <div className="absolute left-[29px] md:left-1/2 top-32 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-300 to-indigo-100 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900" />

            <div className="space-y-16 min-h-[400px]">
                {events.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground animate-fade-in">
                        <p>イベントが登録されていません。</p>
                        <p className="text-sm mt-2">「AIで未来を描く」から、あなたの未来をシミュレーションしてみましょう。</p>
                    </div>
                ) : (
                    events.map((event, index) => {
                        const isLeft = index % 2 === 0;
                        const IconComponent = ICON_MAP[event.iconName] || Star;

                        return (
                            <div
                                key={event.id}
                                className={cn(
                                    "relative flex items-start md:items-center group min-h-[120px]",
                                )}
                            >
                                {/* Dot on Line */}
                                <div className={cn(
                                    "absolute left-[20px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 z-10 transition-all duration-500",
                                    event.status === 'completed' ? "bg-indigo-500 border-indigo-200" :
                                        event.status === 'active' ? "bg-yellow-400 border-yellow-200 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse-soft" :
                                            "bg-slate-200 border-slate-100 dark:bg-slate-700 dark:border-slate-600"
                                )} />

                                {/* Content Card */}
                                <div className={cn(
                                    "ml-16 md:ml-0 w-full md:w-[45%] bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 group/card",
                                    isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
                                    event.status === 'active' && "border-yellow-400/50 bg-yellow-50/30 dark:bg-yellow-900/10 ring-1 ring-yellow-400/30"
                                )}
                                >
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(event); }}
                                            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                                            className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        </button>
                                    </div>

                                    <div className="flex items-start justify-between mb-2">
                                        <span className={cn(
                                            "text-sm font-bold px-2 py-0.5 rounded-md",
                                            event.status === 'future' ? "text-muted-foreground bg-slate-100 dark:bg-slate-800" : "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/30"
                                        )}>
                                            {event.year}
                                        </span>
                                        {event.status === 'active' && (
                                            <span className="flex items-center text-xs font-bold text-yellow-600 dark:text-yellow-400 animate-pulse mr-8">
                                                <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                                                NOW
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground pr-8">
                                        <IconComponent className={cn(
                                            "w-5 h-5",
                                            event.status === 'future' ? "text-muted-foreground" : "text-purple-500"
                                        )} />
                                        {event.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="text-center mt-12 animate-fade-in">
                <p className="text-sm text-muted-foreground italic font-medium">
                    To be continued... and LifeBridge is always with you.
                </p>
            </div>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'イベントを編集' : '新しいイベントを追加'}</DialogTitle>
                        <DialogDescription>
                            あなたの人生のタイムラインに新しいページを追加しましょう。
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... (Existing Dialog Content) ... */}
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="year" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> 年
                            </Label>
                            <Input
                                id="year"
                                value={formData.year || ''}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                placeholder="例: 2025"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <Type className="w-4 h-4" /> タイトル
                            </Label>
                            <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="例: 引越し"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status" className="flex items-center gap-2">
                                <Star className="w-4 h-4" /> ステータス
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: TimelineStatus) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="ステータスを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">完了 (Completed)</SelectItem>
                                    <SelectItem value="active">現在 (Active)</SelectItem>
                                    <SelectItem value="future">未来 (Future)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="icon" className="flex items-center gap-2">
                                <Star className="w-4 h-4" /> アイコン
                            </Label>
                            <Select
                                value={formData.iconName}
                                onValueChange={(value) => setFormData({ ...formData, iconName: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="アイコンを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(ICON_MAP).map((key) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const Icon = ICON_MAP[key];
                                                    return <Icon className="w-4 h-4" />;
                                                })()}
                                                <span className="capitalize">{key}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> 詳細
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="詳細を入力してください..."
                                className="h-20"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSave} className="w-full">
                            保存する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
