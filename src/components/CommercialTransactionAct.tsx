import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CommercialTransactionAct() {
    const navigate = useNavigate();

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

                <h1 className="text-4xl font-bold mb-8">特定商取引法に基づく表記</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">販売業者</h3>
                            <p className="text-muted-foreground">LifeBridge</p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">運営責任者</h3>
                            <p className="text-muted-foreground">代表者名</p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">所在地</h3>
                            <p className="text-muted-foreground">
                                〒000-0000<br />
                                東京都〇〇区〇〇 0-0-0
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                ※お客様からのお問い合わせは、本サービス内のお問い合わせフォームよりお願いいたします。
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">電話番号</h3>
                            <p className="text-muted-foreground">
                                お問い合わせフォームよりご連絡ください
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                ※営業時間: 平日 10:00〜18:00(土日祝日を除く)
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">メールアドレス</h3>
                            <p className="text-muted-foreground">support@lifebridge.app</p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">サービス内容</h3>
                            <p className="text-muted-foreground">
                                人生の転機における手続き支援サービス<br />
                                ライフイベント管理・給付金シミュレーション・AI相談サービス
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">販売価格</h3>
                            <p className="text-muted-foreground">
                                基本サービス: 無料<br />
                                プレミアムプラン: 月額980円(税込)<br />
                                ※各サービスページに表示された価格に従います
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">商品代金以外の必要料金</h3>
                            <p className="text-muted-foreground">
                                インターネット接続料金、通信料金等はお客様のご負担となります。
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">支払方法</h3>
                            <p className="text-muted-foreground">
                                クレジットカード決済<br />
                                対応カード: VISA、MasterCard、JCB、American Express、Diners Club
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">支払時期</h3>
                            <p className="text-muted-foreground">
                                クレジットカード決済の場合、各カード会社の引き落とし日に準じます。<br />
                                月額プランの場合、毎月の契約更新日に自動決済されます。
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">サービス提供時期</h3>
                            <p className="text-muted-foreground">
                                決済完了後、即時ご利用いただけます。
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">返品・キャンセルについて</h3>
                            <p className="text-muted-foreground">
                                デジタルコンテンツという商品の性質上、原則として返品・返金には応じかねます。<br />
                                ただし、以下の場合は返金対応いたします:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                                <li>サービスに重大な不具合があり、利用できない場合</li>
                                <li>当社の責めに帰すべき事由により、サービスが提供できない場合</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                月額プランの解約はいつでも可能です。解約後は次回更新日以降、課金されません。
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">動作環境</h3>
                            <p className="text-muted-foreground">
                                <strong>推奨ブラウザ:</strong><br />
                                Google Chrome(最新版)、Safari(最新版)、Microsoft Edge(最新版)、Firefox(最新版)
                            </p>
                            <p className="text-muted-foreground mt-2">
                                <strong>推奨デバイス:</strong><br />
                                PC、スマートフォン、タブレット
                            </p>
                        </div>

                        <div className="border-t border-border pt-4">
                            <h3 className="text-lg font-semibold mb-2">免責事項</h3>
                            <p className="text-muted-foreground">
                                本サービスは情報提供を目的としており、法的助言を提供するものではありません。<br />
                                実際の手続きや申請については、必ず関係機関にご確認ください。<br />
                                本サービスの利用により生じた損害について、当社は一切の責任を負いかねます。
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            最終更新日: 2025年12月23日
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
