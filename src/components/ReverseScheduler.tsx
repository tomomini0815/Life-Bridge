import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, ArrowRight, CheckCircle2, Target, BookOpen, Brain, Zap, ListFilter, Briefcase, Building, MapPin, GraduationCap, Home, Lightbulb, UserCheck, Search, Plane, Rocket, Flag, ClipboardList, PenTool, TrendingUp, Handshake, Trophy, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { differenceInMonths, differenceInDays, format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Phase {
    id: string;
    name: string;
    icon: React.ElementType;
    monthsBefore: number;
    description: string;
    tasks: string[];
    color: string;
}

const defaultPhases: Phase[] = [
    {
        id: 'phase1',
        name: '目標の具体化と準備',
        icon: Route,
        monthsBefore: 6,
        description: '目標達成の基準を明確にし、必要な環境や道具を整えながら無理のない計画を立てます。',
        tasks: ['目標達成の基準（状態・数値など）を明確にする', '必要なもの（道具・環境・予算・時間）を準備する', '現実に即したスケジュールと小さな中間目標を立てる'],
        color: 'text-slate-500 bg-slate-50 border-slate-200'
    },
    {
        id: 'phase2',
        name: '実行と中間チェック',
        icon: TrendingUp,
        monthsBefore: 3,
        description: '計画に沿って習慣化・実行を継続し、進捗や無理がないかを定期的に確認・修正します。',
        tasks: ['立てた計画を日々の習慣に落とし込んで実行する', '現在地と目標とのギャップを客観的に確認する', '進捗の遅れや無理があれば、やり方や計画を柔軟に修正する'],
        color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    {
        id: 'phase3',
        name: '最終調整とラストスパート',
        icon: Trophy,
        monthsBefore: 1,
        description: '目標達成に向けて残された課題を消化し、モチベーションと体調を整えてゴールを目指します。',
        tasks: ['残されている課題を集中してクリアする', '体調やモチベーションを整え、万全の状態で本番に臨む', 'これまでの過程を振り返り、次のステップへの準備をする'],
        color: 'text-rose-500 bg-rose-50 border-rose-200'
    }
];

const categoryPhases: Record<string, Phase[]> = {
    exam: [
        {
            id: 'exam-1',
            name: '情報収集・志望校決定',
            icon: Search,
            monthsBefore: 12,
            description: '学校見学や試験要項の確認を行い、目標となる志望校や試験を決定します。',
            tasks: ['学校見学・オープンキャンパス参加', '受験科目と配点・試験制度の確認', '過去問の入手と全体的な傾向分析'],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'exam-2',
            name: '基礎固め・苦手克服',
            icon: BookOpen,
            monthsBefore: 6,
            description: '基礎的な参考書を周回し、苦手分野を洗い出して徹底的に対策します。',
            tasks: ['基礎参考書の周回完了', '苦手分野の洗い出しと集中対策', '定期的な模試受験による定点観測'],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'exam-3',
            name: '直前演習・本番準備',
            icon: Target,
            monthsBefore: 2,
            description: '過去問演習による実践力の強化と、本番に向けた事務手続きや体調管理を行います。',
            tasks: ['過去問演習と時間配分の見直し', '受験票の写真撮影と出願手続きの完了', '本番を想定した生活リズム（朝型）への移行'],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        }
    ],
    qualification: [
        {
            id: 'qual-1',
            name: '計画とインプット',
            icon: ClipboardList,
            monthsBefore: 6,
            description: '適切なテキストを選定し、試験範囲の全体像を把握しながらインプットを進めます。',
            tasks: ['学習サイト・テキストの選定と購入', '総学習時間の見積もりと週単位の計画作成', '主要出題範囲のインプット（1周目）完了'],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'qual-2',
            name: '問題演習・アウトプット',
            icon: PenTool,
            monthsBefore: 3,
            description: '問題集を繰り返し解き、知識のアウトプットと定着を図ります。',
            tasks: ['分野別問題集の周回（2〜3周）', '間違えた問題の抽出と専用ノート作成', 'オンライン模試・過去問の腕試し受験'],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'qual-3',
            name: '過去問と総仕上げ',
            icon: CheckCircle2,
            monthsBefore: 1,
            description: '実際の試験形式に慣れ、弱点を最終的につぶしていきます。',
            tasks: ['直近3回分の過去問演習と復習', '頻出・苦手分野の最終暗記と確認', '試験会場への行き方と当日の持ち物準備'],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        }
    ],
    job: [
        {
            id: 'job-1',
            name: '自己分析・キャリア設計',
            icon: UserCheck,
            monthsBefore: 6,
            description: 'これまでの経験を棚卸しし、今後のキャリアの方向性や強み・弱みを明確にします。',
            tasks: ['過去のキャリア棚卸しと強みの言語化', '希望する業界・職種・条件のリストアップ', '転職エージェントへの登録と初回面談'],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'job-2',
            name: '書類作成・企業応募',
            icon: Briefcase,
            monthsBefore: 3,
            description: '応募書類を完成させ、実際の企業へのエントリーと選考を進めます。',
            tasks: ['履歴書・職務経歴書の作成と専門家添削', '必要に応じたポートフォリオの準備', '企業ごとの志望動機作成とエントリー開始'],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'job-3',
            name: '面接対策・内定後準備',
            icon: Handshake,
            monthsBefore: 1,
            description: '面接の実践的な練習を行い、内定獲得後の交渉や退職準備を進めます。',
            tasks: ['頻出質問の回答準備と模擬面接での練習', '企業研究に基づく逆質問の準備', '内定後の条件（給与・入社日）交渉と現職の退職準備'],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        }
    ],
    moving: [
        {
            id: 'move-1',
            name: '物件探し・計画',
            icon: Home,
            monthsBefore: 2,
            description: '新居の条件をまとめ、実際の物件探しと現住居の退去準備を始めます。',
            tasks: ['新居の希望条件と予算のリストアップ', '不動産屋訪問と気になる物件の内見', '現住居の管理会社への退去予告通知'],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'move-2',
            name: '新居契約・荷造り',
            icon: Plane,
            monthsBefore: 1,
            description: '契約手続きを完了させ、計画的に荷造りや不用品の処分を進めます。',
            tasks: ['賃貸契約の締結と初期費用の支払い', '引越し業者の相見積もりと依頼先決定', '不要品の処分（メルカリ、粗大ゴミ手配）と荷造り開始'],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'move-3',
            name: '各種手続きと引越し本番',
            icon: MapPin,
            monthsBefore: 0,
            description: 'インフラの手続きを済ませ、当日の引越しから新生活の立ち上げを行います。',
            tasks: ['電気・水道・ガス・ネット等の開解栓・移転手続き', '役所での転出・転入届、郵便物の転送手続き', '引越し当日の立ち会いと新居のレイアウト・荷解き'],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        }
    ],
    startup: [
        {
            id: 'start-1',
            name: '事業コンセプトと市場調査',
            icon: Lightbulb,
            monthsBefore: 12,
            description: 'ビジネスの核となるアイデアを固め、市場での可能性や競合を調査します。',
            tasks: ['ビジネスモデルの立案とターゲット顧客の設定', '競合調査と自社サービスの優位性（USP）の確認', '起業に必要な初期費用と運転資金の見積もり'],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'start-2',
            name: '資金調達とサービス開発',
            icon: Rocket,
            monthsBefore: 6,
            description: '事業計画を書類に落とし込み、必要な資金を調達しながらサービスを形にします。',
            tasks: ['創業計画書（事業計画書）の作成とブラッシュアップ', '金融機関等への融資申し込み手続き', 'MVP（最小限のプロダクト/サービス）の開発とテスト検証'],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'start-3',
            name: '登記と事業開始準備',
            icon: Building,
            monthsBefore: 1,
            description: '法的な設立手続きを完了し、顧客を迎えるためのインフラを整えます。',
            tasks: ['法人設立登記・税務署等への開業届の提出', '法人口座の開設と会計システムの導入', '事業用ホームページの公開、名刺の作成と集客開始'],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        }
    ]
};


export function ReverseScheduler() {
    const [targetDate, setTargetDate] = useState<string>('');
    const [goalName, setGoalName] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const categories = [
        { id: 'exam', label: '受験・進学' },
        { id: 'qualification', label: '資格取得' },
        { id: 'job', label: '就職・転職' },
        { id: 'moving', label: '引越し' },
        { id: 'startup', label: '起業・独立' },
        { id: 'other', label: 'その他' }
    ];

    const scheduleInfo = useMemo(() => {
        if (!targetDate) return null;
        
        const target = parseISO(targetDate);
        const today = new Date();
        const monthsRemaining = differenceInMonths(target, today);
        const daysRemaining = differenceInDays(target, today);

        if (daysRemaining < 0) return { error: '未来の日付を選択してください。' };

        const currentPhases = category ? (categoryPhases[category] || defaultPhases) : defaultPhases;

        // 進行度の判定: 現在の残り月数と比較して、どのフェーズにいるか（最も近い未来のフェーズ）を特定
        let currentPhaseIndex = 0;
        
        // フェーズは monthsBefore が大きい順（遠い順）に並んでいる想定
        for (let i = currentPhases.length - 1; i >= 0; i--) {
             if (monthsRemaining <= currentPhases[i].monthsBefore) {
                 currentPhaseIndex = i;
             } else {
                 break;
             }
        }

        return {
            target,
            monthsRemaining,
            daysRemaining,
            currentPhaseIndex,
            phases: currentPhases
        };
    }, [targetDate, category]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                        目標の逆算プラン
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        受験、資格取得、引越しなど、期限のある目標に向けて「いつ・何をすべきか」をフェーズ別に可視化します。
                    </p>
                </div>
            </div>

            <Card className="border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-amber-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-500" />
                        いつまでに、何を達成したいですか？
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="flex items-center gap-1.5"><ListFilter className="w-4 h-4 text-amber-500"/>カテゴリ</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-slate-50 border-amber-200 focus:ring-amber-500">
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goalName">目標・試験名</Label>
                            <Input 
                                id="goalName" 
                                placeholder="例：〇〇大学受験、基本情報技術者" 
                                value={goalName}
                                onChange={(e) => setGoalName(e.target.value)}
                                className="bg-slate-50 focus-visible:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetDate">目標日（本番の日）</Label>
                            <Input 
                                id="targetDate" 
                                type="date" 
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="bg-slate-50 focus-visible:ring-amber-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {scheduleInfo?.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm rounded-xl">
                    {scheduleInfo.error}
                </div>
            )}

            {scheduleInfo && !scheduleInfo.error && (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Countdown Banner */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 rounded-2xl p-8 text-amber-950 text-center shadow-md relative overflow-hidden border border-amber-200/60">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/60 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-white/70 border border-amber-200/50 text-amber-700 rounded-full mb-3 text-sm font-semibold shadow-sm backdrop-blur-sm">
                                {category ? categories.find(c => c.id === category)?.label : 'カテゴリ未選択'}
                            </div>
                            <h3 className="text-amber-800 font-medium mb-2">{goalName || '目標日'}まで</h3>
                            <div className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-black tracking-tight text-amber-900 font-['Montserrat',sans-serif]">
                                {scheduleInfo.monthsRemaining > 0 && (
                                    <>
                                        <span>{scheduleInfo.monthsRemaining}<span className="text-2xl md:text-3xl font-medium ml-1">ヶ月</span></span>
                                        <span className="text-amber-300 font-light">/</span>
                                    </>
                                )}
                                <span>{scheduleInfo.daysRemaining}<span className="text-2xl md:text-3xl font-medium ml-1">日</span></span>
                            </div>
                            <p className="mt-4 text-amber-700 flex items-center justify-center gap-2 font-medium">
                                <Clock className="w-4 h-4" />
                                {format(scheduleInfo.target, 'yyyy年MM月dd日', { locale: ja })}
                            </p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-8 md:pl-0">
                        {/* Vertical line connector */}
                        <div className="absolute left-[39px] md:left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-amber-200 to-rose-200 -translate-x-1/2 md:block rounded-full" />

                        <div className="space-y-12">
                            {scheduleInfo.phases.map((phase, index) => {
                                const isCurrent = scheduleInfo.currentPhaseIndex === index;
                                const isPast = scheduleInfo.currentPhaseIndex > index;
                                const Icon = phase.icon;

                                return (
                                    <div key={phase.id} className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
                                        {/* Timeline Node */}
                                        <div className={cn(
                                            "absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 outline outline-4 outline-white z-10 transition-colors",
                                            isCurrent ? "bg-white border-amber-500" : 
                                            isPast ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200 shadow-sm"
                                        )}>
                                            {isPast ? <CheckCircle2 className="w-5 h-5 text-slate-400" /> : <Icon className={cn("w-5 h-5", isCurrent ? "text-amber-600 -ml-0.5" : "text-slate-400")} />}
                                            
                                            {/* Pulse effect for current phase */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full border-2 border-amber-500 animate-ping opacity-20" />
                                            )}
                                        </div>

                                        {/* Content - Alternating left/right */}
                                        <div className={cn(
                                            "w-full md:w-[calc(50%-48px)]",
                                            index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                                        )}>
                                            <div className={cn(
                                                "p-6 rounded-2xl border transition-all duration-300",
                                                isCurrent ? "bg-white shadow-xl border-amber-200 ring-1 ring-amber-50" : 
                                                isPast ? "bg-slate-50/50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm opacity-80"
                                            )}>
                                                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3", phase.color)}>
                                                    {phase.monthsBefore}ヶ月前〜
                                                </div>
                                                <h4 className={cn("text-lg font-bold mb-2", isCurrent ? "text-slate-800" : "text-slate-600")}>
                                                    {phase.name}
                                                </h4>
                                                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                                    {phase.description}
                                                </p>
                                                
                                                <ul className={cn("space-y-2 text-sm text-left", index % 2 === 0 ? "md:items-end flex flex-col" : "")}>
                                                    {phase.tasks.map((task, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-slate-600">
                                                            <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                            <span>{task}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
