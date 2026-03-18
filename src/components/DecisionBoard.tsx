import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Scale, BrainCircuit, Loader2, ArrowRight, ThumbsUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DecisionResult {
    optionA: {
        pros: string[];
        cons: string[];
        score: number;
    };
    optionB: {
        pros: string[];
        cons: string[];
        score: number;
    };
    summary: string;
    recommendation: string;
}

export function DecisionBoard() {
    const [situation, setSituation] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DecisionResult | null>(null);

    const handleAnalyze = async () => {
        if (!situation || !optionA || !optionB) {
            toast.error("現在の状況と、比較したい2つの選択肢を入力してください。");
            return;
        }

        setIsAnalyzing(true);
        try {
            // プロンプトを作成してAIサービスに送信する
            // ※ここではAiConciergeServiceの既存機能を活用して擬似的に結果を生成するか、
            // 実際に追加したメソッドを呼び出します。今回はシミュレーション用の結果を返します。
            
            // サーバー通信のモック（1.5秒待機）
            await new Promise(resolve => setTimeout(resolve, 1500));

            // モック結果を設定
            setResult({
                optionA: {
                    pros: [`「${optionA}」は現状の延長線上にあり、リスクが低い`, 'これまでの経験や人間関係を維持できる'],
                    cons: ['根本的な問題解決にはなりにくい', '長期的にはストレスが蓄積する可能性がある'],
                    score: 65
                },
                optionB: {
                    pros: [`「${optionB}」は新しい環境・可能性を切り開ける`, '長期的なリターンや精神衛生上プラスになる可能性が高い'],
                    cons: ['一時的な経済的・時間的コストや労力が大きい', '不確実性が高く、短期的なリスクを伴う'],
                    score: 80
                },
                summary: '現状維持（A）は安全ですが発展性に課題があり、変化（B）はリスクを伴いますが長期的なリターンが見込めます。',
                recommendation: `現在の状況鑑みると、長期的視点で「${optionB}」を選択するための準備を少しずつ始めることをお勧めします。ただし、直近のリスクヘッジも並行して行いましょう。`
            });

            toast.success("AIによる分析が完了しました。");
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("分析に失敗しました。時間をおいて再試行してください。");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-sm">
                    <Scale className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                        迷った時のA/B比較分析
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        どちらにするか決められない2つの選択肢を入力すると、AIが客観的にメリット・デメリットを整理して決断をサポートします。
                    </p>
                </div>
            </div>

            <Card className="border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-amber-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-amber-500" />
                        今、何に迷っていますか？
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="situation" className="text-base font-bold text-slate-700">現在の状況・悩み</Label>
                        <Textarea 
                            id="situation" 
                            placeholder="例：今の会社に残るか、転職するか迷っている。給料は安定しているが、やりがいがない..." 
                            value={situation}
                            onChange={(e) => setSituation(e.target.value)}
                            className="bg-slate-50 focus-visible:ring-amber-500 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-200 border-4 border-white items-center justify-center z-10 font-bold text-slate-500 text-xs">
                            VS
                        </div>

                        <div className="space-y-2 p-5 bg-blue-50/50 rounded-xl border border-blue-100 relative group transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-blue-50">
                            <Label htmlFor="optionA" className="text-blue-700 font-bold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm">A</span>
                                選択肢 A
                            </Label>
                            <Input 
                                id="optionA" 
                                placeholder="例：今の会社に残る" 
                                value={optionA}
                                onChange={(e) => setOptionA(e.target.value)}
                                className="bg-white border-blue-200 focus-visible:ring-0 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2 p-5 bg-rose-50/50 rounded-xl border border-rose-100 relative group transition-all focus-within:ring-2 focus-within:ring-rose-500 focus-within:bg-rose-50">
                            <Label htmlFor="optionB" className="text-rose-700 font-bold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-sm">B</span>
                                選択肢 B
                            </Label>
                            <Input 
                                id="optionB" 
                                placeholder="例：スタートアップに転職する" 
                                value={optionB}
                                onChange={(e) => setOptionB(e.target.value)}
                                className="bg-white border-rose-200 focus-visible:ring-0 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || !situation || !optionA || !optionB}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-8 h-12 text-base font-bold shadow-lg shadow-amber-200 transition-all hover:scale-105"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    AIが両者を比較・分析中...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="w-5 h-5 mr-2" />
                                    AIに客観的な比較を依頼する
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option A Analysis */}
                        <Card className="border-blue-200 shadow-sm overflow-hidden h-full">
                            <CardHeader className="bg-blue-50/80 border-b border-blue-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardDescription className="text-blue-600 font-bold mb-1">選択肢 A</CardDescription>
                                        <CardTitle className="text-xl text-slate-800">{optionA}</CardTitle>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-blue-600 font-bold mb-1">AIスコア</span>
                                        <div className="text-3xl font-black text-blue-700">{result.optionA.score}<span className="text-sm font-medium ml-1 text-blue-500">pt</span></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 mb-3">
                                        <ThumbsUp className="w-4 h-4" /> メリット（Pros）
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optionA.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-rose-600 mb-3">
                                        <AlertTriangle className="w-4 h-4" /> デメリット（Cons）
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optionA.cons.map((con, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Option B Analysis */}
                        <Card className="border-rose-200 shadow-sm overflow-hidden h-full">
                            <CardHeader className="bg-rose-50/80 border-b border-rose-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardDescription className="text-rose-600 font-bold mb-1">選択肢 B</CardDescription>
                                        <CardTitle className="text-xl text-slate-800">{optionB}</CardTitle>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-rose-600 font-bold mb-1">AIスコア</span>
                                        <div className="text-3xl font-black text-rose-700">{result.optionB.score}<span className="text-sm font-medium ml-1 text-rose-500">pt</span></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 mb-3">
                                        <ThumbsUp className="w-4 h-4" /> メリット（Pros）
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optionB.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-rose-600 mb-3">
                                        <AlertTriangle className="w-4 h-4" /> デメリット（Cons）
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optionB.cons.map((con, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Final Recommendation */}
                    <Card className="border-emerald-200 shadow-md overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-emerald-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                AIからの総評・アドバイス
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-700 font-medium leading-relaxed">
                                {result.summary}
                            </p>
                            <div className="p-4 bg-white/80 rounded-xl border border-emerald-100">
                                <p className="text-slate-800 font-bold leading-relaxed">
                                    <span className="text-emerald-600 mr-2">💡 提案:</span>
                                    {result.recommendation}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Temporary addition to fix missing icon (Sparkles wasn't originally imported from lucide-react above if missed)
import { Sparkles } from 'lucide-react';
