import { useState } from 'react';
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
import { timelineService, UserInputForAI } from '@/services/TimelineService';
import { Loader2, Sparkles } from 'lucide-react';

interface TimelineGeneratorProps {
    onGenerate: () => void;
}

export function TimelineGenerator({ onGenerate }: TimelineGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UserInputForAI>({
        age: 30,
        job: '',
        currentStatus: '',
        goals: ''
    });

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            await timelineService.generateAiEvents(formData);
            setIsOpen(false);
            onGenerate(); // Refresh parent
        } catch (error) {
            console.error("Failed to generate timeline", error);
            // Ideally show toast
            alert("AI生成に失敗しました。時間をおいて再試行してください。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AIで未来を描く
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        AI未来タイムライン生成
                    </DialogTitle>
                    <DialogDescription>
                        あなたの現状と夢を教えてください。AIが「現状の延長線上の未来」と「理想の未来」の2つのシナリオを提案します。
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="age">現在の年齢</Label>
                        <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="job">現在の職業</Label>
                        <Input
                            id="job"
                            value={formData.job}
                            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                            placeholder="例: ITエンジニア"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="currentStatus">現状・悩み</Label>
                        <Textarea
                            id="currentStatus"
                            value={formData.currentStatus}
                            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                            placeholder="例: 仕事は順調だが、毎日忙しくて自分の時間が取れない。貯金は少しずつできている。"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="goals">将来の夢・目標</Label>
                        <Textarea
                            id="goals"
                            value={formData.goals}
                            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            placeholder="例: 40歳までに独立したい。海外に移住してのんびり暮らしたい。家族との時間を大切にしたい。"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                未来を構想中...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                タイムラインを生成
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
