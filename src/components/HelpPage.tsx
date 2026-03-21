import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Mail, MessageCircle, FileQuestion, BookOpen, ExternalLink, Lightbulb, Bug, CheckCircle2, AlertCircle, Search, UserPlus, Calendar, ListChecks, FileText, Sparkles, Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { FeedbackCategory, SubcategoryOption } from '@/types/feedback';
import { feedbackService } from '@/services/FeedbackService';
import { useAuth } from '@/contexts/AuthContext';

interface HelpPageProps {
    isStandalone?: boolean;
}

interface FormData {
    category: FeedbackCategory | '';
    subcategory: string;
    subject: string;
    details: string;
    email: string;
}

export function HelpPage({ isStandalone = false }: HelpPageProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        category: '',
        subcategory: '',
        subject: '',
        details: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { value: 'inquiry' as const, label: 'お問い合わせ', icon: Mail, description: '一般的な質問や相談' },
        { value: 'feature' as const, label: '機能改善の提案', icon: Lightbulb, description: '新機能や改善のアイデア' },
        { value: 'opinion' as const, label: 'ご意見・ご感想', icon: MessageCircle, description: 'アプリの使用感や感想' },
        { value: 'bug' as const, label: '不具合報告', icon: Bug, description: 'バグや動作不良の報告' }
    ];

    // Subcategories for each category
    const subcategories: Record<FeedbackCategory, SubcategoryOption[]> = {
        inquiry: [
            { value: 'account', label: 'アカウント・ログインについて' },
            { value: 'usage', label: '機能の使い方について' },
            { value: 'data', label: 'データ管理について' },
            { value: 'other', label: 'その他の質問' }
        ],
        feature: [
            { value: 'new_feature', label: '新機能の追加' },
            { value: 'improvement', label: '既存機能の改善' },
            { value: 'ui_ux', label: 'UI/UXの改善' },
            { value: 'performance', label: 'パフォーマンスの改善' }
        ],
        opinion: [
            { value: 'usability', label: '使いやすさについて' },
            { value: 'design', label: 'デザインについて' },
            { value: 'satisfaction', label: '全体的な満足度' },
            { value: 'other', label: 'その他のご意見' }
        ],
        bug: [
            { value: 'auth', label: 'ログイン・認証エラー' },
            { value: 'display', label: 'データの表示エラー' },
            { value: 'function', label: '機能が動作しない' },
            { value: 'performance', label: 'パフォーマンスの問題' },
            { value: 'other', label: 'その他の不具合' }
        ]
    };

    const faqs = [
        {
            category: '基本的な使い方',
            question: "初めて使います。まず何をすればいいですか？",
            answer: "まず、画面左のサイドバーから現在直面しているライフイベント（例：結婚、出産、転職など）を選択してください。すると、そのイベントに必要な手続きが優先順位順に表示されます。各手続きをクリックすると、必要書類、申請先、期限などの詳細情報が確認できます。"
        },
        {
            category: '基本的な使い方',
            question: "タスクの優先順位はどのように決まっていますか？",
            answer: "AIが以下の3つの要素を分析して最適な順序を提案します：①申請期限（締切が近いものを優先）、②依存関係（他の手続きの前提条件となるものを優先）、③重要度（給付金額や法的義務の重要性）。例えば、出産の場合、出生届（14日以内）が最優先で表示されます。"
        },
        {
            category: '基本的な使い方',
            question: "複数のライフイベントを同時に管理できますか？",
            answer: "はい、可能です。例えば「転職」と「引越し」を同時に選択すると、両方のタスクが統合されて表示されます。AIが期限や依存関係を考慮して、最適な実行順序を提案します。サイドバーから複数のイベントを選択してください。"
        },
        {
            category: '基本的な使い方',
            question: "「目標の逆算プラン」とは何ですか？",
            answer: "結婚、出産、起業など、11種類の主要なライフイベントに対して、目標日から逆算して「いつまでに何をすべきか」を5つのフェーズで具体的に計画する機能です。各フェーズには具体的なタスクリストが含まれており、着実に目標に近づくことができます。"
        },
        {
            category: 'アカウント・設定',
            question: "ダークモードに切り替えたい",
            answer: "サイドバー下部の「設定」アイコンをクリック → 「外観設定」タブを選択 → 「ダークモード」のトグルスイッチをONにしてください。設定は即座に反映され、次回ログイン時も保持されます。"
        },
        {
            category: 'アカウント・設定',
            question: "リマインダー通知の頻度を変更したい",
            answer: "設定ページの「通知設定」タブから、以下の項目を個別に設定できます：①期限7日前の通知、②期限3日前の通知、③期限当日の通知、④新しいタスク追加時の通知。重要な期限のみ通知したい場合は、期限3日前と当日のみONにすることをおすすめします。"
        },
        {
            category: 'アカウント・設定',
            question: "データは自動で保存されますか？",
            answer: "はい、すべての変更は自動的にクラウドに保存されます。タスクの完了チェック、メモの追加、設定変更など、すべての操作が即座に保存されるため、手動保存の必要はありません。別のデバイスからログインしても、同じデータにアクセスできます。"
        },
        {
            category: 'AI機能',
            question: "「AIで未来を描く」では何ができますか？",
            answer: "現在の年齢や家族構成、目標に基づき、今年（2026年）から将来にわたる具体的なライフプランをAIが生成します。単なる予定の列挙ではなく、必要な資金額や具体的なアクション、チェックリストまで含めた精度の高いシミュレーションが可能です。"
        },
        {
            category: 'AI機能',
            question: "AIコンシェルジュにはどんな質問ができますか？",
            answer: "ライフイベントに関するあらゆる質問が可能です。例：『出産育児一時金の申請に必要な書類は？』『健康保険の扶養追加はいつまでにすればいい？』『児童手当の所得制限はいくら？』など。専門用語を使わず、普段の言葉で質問してください。"
        },
        {
            category: 'AI機能',
            question: "AIの回答はどこまで信頼できますか？",
            answer: "厚生労働省、国税庁、各自治体の公式情報を基に回答していますが、制度は頻繁に改正されるため、最終的な判断の前には必ず公式サイトや窓口でご確認ください。また、個別の状況（所得、家族構成など）により条件が異なる場合があります。"
        },
        {
            category: 'AI機能',
            question: "過去の質問履歴は保存されますか？",
            answer: "はい、AIコンシェルジュとの会話履歴は自動保存されます。チャット画面上部の「履歴」ボタンから、過去の質問と回答を確認できます。同じ質問を繰り返す必要がなく、以前の回答を見返すことができます。"
        },
        {
            category: '給付金・補助金',
            question: "自分が受け取れる給付金の総額を知りたい",
            answer: "サイドバーの「給付金シミュレーター」をクリックしてください。年収、家族構成、居住地などを入力すると、受給可能な給付金が一覧表示され、合計金額も自動計算されます。例えば出産の場合、出産育児一時金50万円、児童手当など、すべての給付金が表示されます。"
        },
        {
            category: '給付金・補助金',
            question: "給付金の申請期限を過ぎてしまった場合は？",
            answer: "給付金によって対応が異なります。出産育児一時金など一部の給付金は、期限を過ぎても遡って申請できる場合があります。まずはAIコンシェルジュに『〇〇の期限を過ぎてしまった』と相談してください。可能な対応策を提案します。"
        },
        {
            category: '給付金・補助金',
            question: "申請書類の書き方がわからない",
            answer: "各タスクの詳細ページに「記入例」のリンクがあります。また、AIコンシェルジュに『〇〇の申請書の書き方を教えて』と質問すると、記入のポイントや注意点を説明します。不明な項目がある場合は、具体的に質問してください。"
        },
        {
            category: 'その他',
            question: "家族でアカウントを共有できますか？",
            answer: "現在、1つのアカウントは1人のユーザー専用です。ただし、配偶者の方も無料でアカウントを作成できます。将来的には、家族間でタスクを共有できる機能を追加予定です。"
        },
        {
            category: 'その他',
            question: "オフラインでも使えますか？",
            answer: "基本的な閲覧は可能ですが、タスクの完了チェックやAIコンシェルジュの利用にはインターネット接続が必要です。オフライン時の変更は、次回オンライン時に自動的に同期されます。"
        },
        {
            category: 'その他',
            question: "セキュリティは大丈夫ですか？",
            answer: "すべてのデータは業界標準の暗号化技術（SSL/TLS）で保護され、Supabaseの安全なクラウド環境に保存されます。個人情報は厳重に管理され、第三者に提供されることはありません。詳細はプライバシーポリシーをご確認ください。"
        }
    ];

    const getSubcategories = (category: FeedbackCategory): SubcategoryOption[] => {
        return subcategories[category] || [];
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.category) {
            newErrors.category = 'カテゴリーを選択してください';
        }
        if (formData.category && !formData.subcategory) {
            newErrors.subcategory = '詳細カテゴリーを選択してください';
        }
        if (!formData.subject.trim()) {
            newErrors.subject = '件名を入力してください';
        }
        if (!formData.details.trim()) {
            newErrors.details = '詳細内容を入力してください';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCategoryChange = (value: string) => {
        setFormData({
            ...formData,
            category: value as FeedbackCategory,
            subcategory: '' // Reset subcategory when category changes
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const result = await feedbackService.submitFeedback({
                userId: user?.id || null,
                category: formData.category as FeedbackCategory,
                subcategory: formData.subcategory,
                subject: formData.subject,
                details: formData.details,
                email: formData.email || undefined
            });

            if (result) {
                console.log('Feedback submitted successfully:', result);
                setSubmitStatus('success');

                // Reset form
                setFormData({
                    category: '',
                    subcategory: '',
                    subject: '',
                    details: '',
                    email: ''
                });

                // Hide success message after 5 seconds
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const content = (
        <div className="w-full space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">お問い合わせ＆サポート</h1>
                    <p className="text-muted-foreground mt-1">
                        困ったときのガイドとよくある質問
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
                {/* Left Column: Contact & Feedback Form */}
                <div className="space-y-6 flex flex-col">

                    {/* Inquiry & Feedback Form */}
                    <Card className="border-border/50 shadow-sm glass-medium flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-cyan-600" />
                                お問い合わせ・フィードバック
                            </CardTitle>
                            <CardDescription>
                                機能の不具合やご要望、その他ご不明な点がございましたら、お気軽にお問い合わせください。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Category Selection */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">
                                        カテゴリー <span className="text-red-500">*</span>
                                    </Label>
                                    <RadioGroup
                                        value={formData.category}
                                        onValueChange={handleCategoryChange}
                                        className="grid grid-cols-1 gap-3"
                                    >
                                        {categories.map((cat) => {
                                            const Icon = cat.icon;
                                            return (
                                                <label
                                                    key={cat.value}
                                                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.category === cat.value
                                                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                                                        : 'border-border hover:border-cyan-300 hover:bg-muted/50'
                                                        }`}
                                                >
                                                    <RadioGroupItem value={cat.value} id={cat.value} className="mt-1" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Icon className="w-4 h-4" />
                                                            <span className="font-medium">{cat.label}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </RadioGroup>
                                    {errors.category && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Subcategory Selection - Only shown when category is selected */}
                                {formData.category && (
                                    <div className="space-y-2 animate-fade-in">
                                        <Label htmlFor="subcategory">
                                            詳細カテゴリー <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.subcategory}
                                            onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                                        >
                                            <SelectTrigger id="subcategory" className={errors.subcategory ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="選択してください" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getSubcategories(formData.category).map((sub) => (
                                                    <SelectItem key={sub.value} value={sub.value}>
                                                        {sub.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.subcategory && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.subcategory}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <Separator />

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject">
                                        件名 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="subject"
                                        placeholder="例：ログインができない、新機能の提案など"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className={errors.subject ? 'border-red-500' : ''}
                                    />
                                    {errors.subject && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    <Label htmlFor="details">
                                        詳細内容 <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="details"
                                        placeholder={
                                            formData.category === 'bug'
                                                ? '発生した状況、再現手順、期待される動作などを詳しくお書きください'
                                                : formData.category === 'feature'
                                                    ? '提案の背景・理由、期待される効果などをお書きください'
                                                    : '詳しい内容をお書きください'
                                        }
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        rows={6}
                                        className={errors.details ? 'border-red-500' : ''}
                                    />
                                    {errors.details && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.details}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        メールアドレス <span className="text-muted-foreground text-xs">(任意)</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="返信を希望される場合はご入力ください"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Status Messages */}
                                {submitStatus === 'success' && (
                                    <Alert className="bg-green-50 dark:bg-green-950/30 border-green-500">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800 dark:text-green-200">
                                            送信が完了しました。ご連絡ありがとうございます！
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {submitStatus === 'error' && (
                                    <Alert className="bg-red-50 dark:bg-red-950/30 border-red-500">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800 dark:text-red-200">
                                            送信に失敗しました。時間をおいて再度お試しください。
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white shadow-md"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            送信中...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            送信する
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Guide & FAQ */}
                <div className="space-y-6 flex flex-col">
                    {/* Quick Guide Card */}
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all glass-medium flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                使い方ガイド
                            </CardTitle>
                            <CardDescription>LifeBridgeの基本的な使い方</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3.5 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <UserPlus className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">1. アカウント作成・ログイン</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">画面右上の「ログイン」ボタンをクリック。Googleアカウントで即座にログイン、またはメールアドレスで新規登録できます。登録後、すぐに全機能をご利用いただけます。</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">2. ライフイベント・目標の設定</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">サイドバーからイベントを選択。さらに「AIで未来を描く」で長期的なタイムラインを、「目標の逆算プラン」で具体的なアクションプランをAIが自動生成し、あなたの人生を可視化します。</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <ListChecks className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">3. タスクリストを確認</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">AIが期限、依存関係、重要度を分析し、最適な順序でタスクを表示。各タスクには期限、優先度、ステータスが表示され、何から始めるべきか一目で分かります。</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">4. 手続きを実行</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">各タスクをクリックすると、必要書類、記入例、申請先の公式サイトリンクが表示されます。オンライン申請が可能なものは、直接申請ページへ遷移できます。</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">5. 完了チェック</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">手続きが完了したら、タスクのチェックボックスをクリック。進捗バーが自動更新され、残りのタスク数が表示されます。完了済みタスクは履歴として保存されます。</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">6. AIコンシェルジュに相談</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">画面右下のチャットアイコンをクリックすると、AIコンシェルジュが起動。「出産育児一時金の申請方法は？」など、自然な言葉で質問してください。24時間いつでも回答します。</p>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Latest Updates Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-cyan-600" />
                                    <h3 className="font-semibold text-foreground">最新アップデート</h3>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-100 dark:border-cyan-900/30">
                                        <Zap className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-0.5 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">AIライフプランニング（タイムライン）進化</p>
                                            <p className="text-xs text-muted-foreground">現在（2026年）から始まる詳細な未来予想図をAIが描きます。具体的なタスクや資金額も併せて提案。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30">
                                        <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-0.5 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">目標逆算プランを11カテゴリに拡充</p>
                                            <p className="text-xs text-muted-foreground">結婚から相続まで、主要なライフイベント全ての詳細な逆算プランが利用可能になりました。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-100 dark:border-violet-900/30">
                                        <MessageCircle className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-0.5 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">AIコンシェルジュの回答精度向上</p>
                                            <p className="text-xs text-muted-foreground">最新の公的情報を基に、より詳細で正確な回答を提供できるようになりました。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQs - Full Width Section Below */}
            <Card className="border-border/50 shadow-sm glass-medium mt-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileQuestion className="w-5 h-5 text-cyan-600" />
                        <CardTitle className="text-2xl">よくある質問</CardTitle>
                    </div>
                    <CardDescription>カテゴリー別に整理されたFAQ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="FAQを検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* FAQ Tabs */}
                    <Tabs defaultValue="基本的な使い方" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-1">
                            <TabsTrigger value="基本的な使い方" className="text-xs sm:text-sm">基本</TabsTrigger>
                            <TabsTrigger value="アカウント・設定" className="text-xs sm:text-sm">設定</TabsTrigger>
                            <TabsTrigger value="AI機能" className="text-xs sm:text-sm">AI</TabsTrigger>
                            <TabsTrigger value="給付金・補助金" className="text-xs sm:text-sm">給付金</TabsTrigger>
                            <TabsTrigger value="その他" className="text-xs sm:text-sm">その他</TabsTrigger>
                        </TabsList>

                        {['基本的な使い方', 'アカウント・設定', 'AI機能', '給付金・補助金', 'その他'].map((category) => {
                            const categoryFaqs = faqs.filter(faq => {
                                const matchesCategory = faq.category === category;
                                const matchesSearch = searchQuery === '' ||
                                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
                                return matchesCategory && matchesSearch;
                            });

                            return (
                                <TabsContent key={category} value={category} className="space-y-3 mt-4">
                                    {categoryFaqs.length === 0 ? (
                                        <Card className="border-border/50">
                                            <CardContent className="py-8 text-center text-muted-foreground">
                                                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>該当する質問が見つかりませんでした</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        categoryFaqs.map((faq, index) => (
                                            <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all glass-medium">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base font-semibold text-foreground flex items-start gap-2">
                                                        <HelpCircle className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                                                        <span>{faq.question}</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );

    if (isStandalone) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        ホームに戻る
                    </Button>
                    {content}
                </div>
            </div>
        );
    }

    return content;
}
