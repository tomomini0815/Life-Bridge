import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Mail, MessageCircle, FileQuestion, BookOpen, ExternalLink } from 'lucide-react';

export function HelpPage() {
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

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
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

                {/* Contact Support Card */}
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-all glass-medium">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-cyan-600" />
                            お問い合わせ
                        </CardTitle>
                        <CardDescription>解決しない場合はこちら</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            機能の不具合やご要望、その他ご不明な点がございましたら、お気軽にお問い合わせください。
                        </p>
                        <Button className="w-full gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white shadow-md">
                            <Mail className="w-4 h-4" /> サポートへ連絡する
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                            <ExternalLink className="w-4 h-4" /> 公式サイトを見る
                        </Button>
                        <div className="mt-4 pt-4 border-t border-border/50 text-center">
                            <p className="text-xs text-muted-foreground">Version 1.2.0 (Beta)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
