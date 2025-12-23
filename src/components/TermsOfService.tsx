import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function TermsOfService() {
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

                <h1 className="text-4xl font-bold mb-8">利用規約</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">第1条(適用)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            本利用規約(以下「本規約」といいます)は、LifeBridge(以下「当社」といいます)が提供するサービス(以下「本サービス」といいます)の利用条件を定めるものです。登録ユーザーの皆さま(以下「ユーザー」といいます)には、本規約に従って本サービスをご利用いただきます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第2条(利用登録)</h2>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</li>
                            <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります。
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                                    <li>本規約に違反したことがある者からの申請である場合</li>
                                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                                </ul>
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第3条(ユーザーIDおよびパスワードの管理)</h2>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                            <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                            <li>当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第4条(禁止事項)</h2>
                        <p className="text-muted-foreground mb-4">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>当社、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>当社のサービスの運営を妨害するおそれのある行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>不正アクセスをし、またはこれを試みる行為</li>
                            <li>他のユーザーに成りすます行為</li>
                            <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                            <li>その他、当社が不適切と判断する行為</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第5条(本サービスの提供の停止等)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                            <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                            <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第6条(免責事項)</h2>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>当社は、本サービスに事実上または法律上の瑕疵(安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます)がないことを明示的にも黙示的にも保証しておりません。</li>
                            <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第7条(サービス内容の変更等)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第8条(利用規約の変更)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">第9条(準拠法・裁判管轄)</h2>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                            <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
                        </ol>
                    </section>

                    <div className="mt-12 pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            制定日: 2025年12月23日<br />
                            最終更新日: 2025年12月23日
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
