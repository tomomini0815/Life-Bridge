import { useState, useEffect } from 'react';
import {
    Zap, Shield, FileText, CheckCircle2,
    MessageCircle, Calendar, Sparkles, Brain, ChevronDown, Download
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

// --- Chat Simulation Component ---
export function ChatSimulation() {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = "はい、産前産後休業中は給与の約67%、\n育児休業中は最初の6ヶ月間、67%が支給されます。\n申請期限は出産翌日から56日以内です。";
    const [isTyping, setIsTyping] = useState(false);
    const [showReply, setShowReply] = useState(false);

    useEffect(() => {
        const startDelay = setTimeout(() => {
            setIsTyping(true);
            let index = 0;
            const typeInterval = setInterval(() => {
                setDisplayedText(fullText.slice(0, index + 1));
                index++;
                if (index >= fullText.length) {
                    clearInterval(typeInterval);
                    setIsTyping(false);
                    setShowReply(true);
                }
            }, 50); // Typing speed
            return () => clearInterval(typeInterval);
        }, 1500); // Wait for initial "User" message

        return () => clearTimeout(startDelay);
    }, []);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">Live Demo</span>
                    <h2 className="text-4xl md:text-6xl font-medium text-slate-800 mb-6 font-sans">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                            秒速で、答えを。
                        </span>
                    </h2>
                    <p className="text-slate-600 text-lg font-medium">専門的な手続きも、AIなら一瞬で解決します。</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative">
                        {/* Header */}
                        <div className="bg-slate-50/80 px-6 py-4 flex items-center gap-3 border-b border-white/60">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="ml-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">LifeBridge AI Guide</div>
                        </div>

                        {/* Chat Area */}
                        <div className="p-8 md:p-12 min-h-[400px] bg-gradient-to-b from-slate-50/50 to-white/50 flex flex-col gap-6">
                            {/* User Message */}
                            <div className="flex justify-end animate-fade-in-up">
                                <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white px-6 py-4 rounded-2xl rounded-tr-sm shadow-md max-w-[80%]">
                                    <p className="font-medium text-sm md:text-base">
                                        育休の手当って、結局いくらもらえるの？<br />
                                        申請はいつまで？
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 ml-3 flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* AI Message */}
                            <div className="flex justify-start items-start">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 mr-3 flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm shadow-emerald-200/50">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-sm shadow-lg border border-emerald-50 max-w-[90%] relative">
                                    {/* Typing Indicator */}
                                    {displayedText === '' && (
                                        <div className="flex gap-1 h-6 items-center">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce duration-300" />
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75 duration-300" />
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150 duration-300" />
                                        </div>
                                    )}
                                    <p className="text-slate-800 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line">
                                        {displayedText}
                                        {isTyping && <span className="inline-block w-0.5 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />}
                                    </p>

                                    {/* Smart Suggestion Chips */}
                                    {showReply && (
                                        <div className="mt-4 flex flex-wrap gap-2 animate-fade-in pt-2 border-t border-slate-100">
                                            <button className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-100 flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> 申請書を作成する
                                            </button>
                                            <button className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors border border-teal-100 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> 期限をカレンダー登録
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Bento Grid Component ---
export function FeatureBentoGrid() {
    return (
        <section className="py-12 md:py-24 relative">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">Why LifeBridge?</span>
                    <h2 className="text-3xl md:text-5xl font-medium text-slate-800 mb-6 font-sans">
                        必要なのは、<br className="md:hidden" />このアプリだけ。
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Item 1: Roadmap (Span 2) */}
                    <ScrollReveal className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl min-h-[320px] md:min-h-[400px] hover:shadow-2xl transition-all duration-300 cursor-pointer" delay={0.1}>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white z-0" />
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100/50 transition-colors duration-500" />

                        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">パーソナライズされた<br />ロードマップ</h3>
                                <p className="text-slate-500 font-medium">あなたの状況に合わせて、<br />必要な手続きを時間短縮で解決。</p>
                            </div>

                            {/* Abstract Timeline Visual */}
                            <div className="mt-8 flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-1/3 bg-emerald-400 rounded-full group-hover:w-2/3 transition-all duration-1000 ease-out" />
                                </div>
                                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 text-xs font-medium text-emerald-600 flex items-center gap-2 group-hover:-translate-y-1 transition-transform">
                                    <CheckCircle2 className="w-4 h-4" /> Next: 転出届
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Item 2: Speed */}
                    <ScrollReveal className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl min-h-[320px] md:min-h-[400px] text-white hover:shadow-2xl transition-all duration-300 cursor-pointer" delay={0.2}>
                        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white border border-white/30 group-hover:rotate-12 transition-transform">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">圧倒的な<br />スピード</h3>
                                <p className="text-emerald-50 font-medium opacity-90">無駄な待ち時間を、<br />ゼロにします。</p>
                            </div>
                            <div className="text-5xl font-semibold opacity-30 group-hover:opacity-50 transition-opacity font-sans tracking-tighter self-end relative">
                                0.1s
                                <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-300 animate-pulse" />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Item 3: AI Logic */}
                    <ScrollReveal className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl min-h-[320px] hover:shadow-2xl transition-all duration-300 cursor-pointer" delay={0.3}>
                        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-6 text-teal-600 group-hover:scale-110 transition-transform">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">精度の高い<br />AI分析</h3>
                                <p className="text-slate-500 text-sm font-medium">最新の行政データを基に、<br />正確なアドバイスを提供。</p>
                            </div>
                            {/* Decorative Graph */}
                            <div className="flex gap-1 items-end h-16 self-end w-full max-w-[120px] opacity-50 group-hover:opacity-80 transition-opacity">
                                <div className="w-1/4 bg-teal-200 h-[40%] rounded-t-sm group-hover:h-[60%] transition-all duration-500" />
                                <div className="w-1/4 bg-teal-300 h-[60%] rounded-t-sm group-hover:h-[80%] transition-all duration-500 delay-75" />
                                <div className="w-1/4 bg-teal-400 h-[30%] rounded-t-sm group-hover:h-[50%] transition-all duration-500 delay-150" />
                                <div className="w-1/4 bg-teal-500 h-[80%] rounded-t-sm group-hover:h-[90%] transition-all duration-500 delay-200" />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Item 4: Expert Verified (Span 2) */}
                    <ScrollReveal className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-xl min-h-[320px] text-white hover:shadow-2xl transition-all duration-300 cursor-pointer" delay={0.4}>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                        <div className="relative z-10 p-10 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div className="max-w-xs">
                                <div className="w-12 h-12 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-6 border border-slate-600">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">専門家監修の<br />安心感</h3>
                                <p className="text-slate-400 font-medium">
                                    社会保険労務士や行政書士など、<br />
                                    各種専門家の監修を受けた<br />
                                    信頼できる情報のみをお届けします。
                                </p>
                            </div>

                            {/* Trust Visual */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full md:w-auto min-w-[200px] flex flex-col items-center gap-2 group-hover:bg-white/20 transition-colors">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="Expert" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> VERIFIED EXPERTS
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>
    );
}

// --- FAQ Component ---
export function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = [
        { q: "サイトは無料で使えますか？", a: "はい、基本的な情報検索とロードマップ作成は無料でご利用いただけます。行政への直接申請は一部有料オプションとなります。" },
        { q: "クレジットカードの登録は必要ですか？", a: "必要ではありませんが、有料の申請代行はクレジットカード決済がスムーズになります。登録やログインがなくても情報検索は利用可能です。" },
        { q: "セキュリティは大丈夫ですか？", a: "情報セキュリティマネジメントシステム(ISO 27001)に準拠し、個人の証明書やデータの安全管理を徹底しております。" },
        { q: "家族の申請も代行できますか？", a: "はい、配偶者や家族の申請も一括代行可能です。マイナンバーカード認証を使用して、役所での手続きを代行できます。" }
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50/50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium text-slate-800 mb-4">よくある質問</h2>
                    <p className="text-slate-500 font-medium">疑問点を解消して、安心して始めましょう。</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className="font-medium text-slate-700">{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/30">
                                    <span className="text-emerald-500 font-bold mr-2">A.</span>
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA within FAQ */}
                <div className="mt-12 text-center">
                    <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 px-8">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        その他の質問はこちら
                    </Button>
                </div>
            </div>
        </section>
    );
}

// --- Download Guide CTA Section ---
export function DownloadGuideCta() {
    return (
        <section className="py-20 bg-emerald-900 relative overflow-hidden text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-medium mb-6">
                    まずは、全体像を把握しませんか？
                </h2>
                <p className="text-emerald-100 mb-10 text-lg font-medium max-w-2xl mx-auto">
                    「何から始めればいいか分からない」という方のために、<br />
                    ライフステージ別の申請ロードマップ（PDF）を無料でダウンロード中。
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50 h-14 px-8 text-base font-medium shadow-xl w-full md:w-auto">
                        <Download className="w-5 h-5 mr-2" />
                        ガイドブックを無料ダウンロード
                    </Button>
                    <p className="text-xs text-emerald-400 mt-2 md:mt-0 md:ml-4">
                        ※登録不要で閲覧可能です
                    </p>
                </div>
            </div>
        </section>
    );
}
