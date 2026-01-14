import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, Mail, MessageCircle, FileQuestion, BookOpen, ExternalLink, Lightbulb, Bug, CheckCircle2, AlertCircle } from 'lucide-react';
import { FeedbackCategory, SubcategoryOption } from '@/types/feedback';
import { feedbackService } from '@/services/FeedbackService';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
    category: FeedbackCategory | '';
    subcategory: string;
    subject: string;
    details: string;
    email: string;
}

export function HelpPage() {
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
            question: "データのバックアップはとれますか？",
            answer: "現在、データはブラウザ（ローカルストレージ）に保存されています。設定ページの「データ管理」からリセットすることは可能ですが、クラウドバックアップ機能は今後のアップデートで追加予定です。"
        },
        {
            question: "ダークモードの設定方法は？",
            answer: "画面左下の「設定」アイコン、またはサイドバーの「設定」メニューから設定ページを開き、「外観設定」タブで「ダークモード」のスイッチを切り替えることで設定できます。"
        },
        {
            question: "AIチャットは無料で使えますか？",
            answer: "はい、現在のベータ版ではすべての機能を無料でご利用いただけます。補助金や手続きに関する質問など、お気軽にご相談ください。"
        },
        {
            question: "間違って完了にしたタスクを戻したい",
            answer: "完了したタスクのチェックボックスを再度クリックすることで、未完了の状態に戻すことができます。"
        },
        {
            question: "新しいライフイベントを追加したい",
            answer: "現在は「結婚」「出産」「転職」「起業」「引越し」「介護」の6つのイベントに対応しています。その他のイベントについては、今後のアップデートをお待ちください。"
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
                userId: user?.uid || null,
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

    return (
        <div className="w-full space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">ヘルプ＆サポート</h1>
                    <p className="text-muted-foreground mt-1">
                        困ったときのガイドとよくある質問
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Guide Card */}
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-all glass-medium">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            使い方ガイド
                        </CardTitle>
                        <CardDescription>LifeBridgeの基本的な使い方</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-medium text-foreground">1. イベントを選ぶ</h3>
                            <p className="text-sm text-muted-foreground">サイドバーから、現在直面しているライフイベント（結婚、引越しなど）を選択します。</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="font-medium text-foreground">2. タスクを確認・実行</h3>
                            <p className="text-sm text-muted-foreground">表示されたタスクリストを確認し、必要な手続きを進めます。完了したらチェックを入れましょう。</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="font-medium text-foreground">3. 困ったらAIに相談</h3>
                            <p className="text-sm text-muted-foreground">右下のチャットウィジェットから、いつでもAIコンシェルジュに質問できます。</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links Card */}
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-all glass-medium">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-cyan-600" />
                            クイックリンク
                        </CardTitle>
                        <CardDescription>便利なリンク集</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full gap-2 justify-start">
                            <ExternalLink className="w-4 h-4" /> 公式サイトを見る
                        </Button>
                        <Button variant="outline" className="w-full gap-2 justify-start">
                            <BookOpen className="w-4 h-4" /> ユーザーガイド
                        </Button>
                        <div className="mt-4 pt-4 border-t border-border/50 text-center">
                            <p className="text-xs text-muted-foreground">Version 1.2.0 (Beta)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inquiry & Feedback Form */}
            <Card className="border-border/50 shadow-sm glass-medium">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-cyan-600" />
                        お問い合わせ・フィードバック
                    </CardTitle>
                    <CardDescription>
                        機能の不具合やご要望、その他ご不明な点がございましたら、お気軽にお問い合わせください。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                カテゴリー <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
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

            {/* FAQs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <FileQuestion className="w-5 h-5 text-cyan-600" />
                    <h2 className="text-xl font-bold text-foreground">よくある質問</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                            <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground bg-muted/30 p-4 rounded-lg mt-1">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
