import { LifeEvent } from '@/types/lifeEvent';
import { Button } from '@/components/ui/button';
import {
    Heart, Shield, Sparkles, ArrowRight,
    CheckCircle2, Clock, MapPin, Briefcase, Baby, Home, Users, Rocket, HandHeart,
    Coins, Map as MapIcon, Bell, Bot, HelpCircle, FileText, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MeshGradient } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';
import { ChatSimulation, FeatureBentoGrid, FAQAccordion, DownloadGuideCta } from '@/components/HighFidelityFeatures';
import { TrustMarquee, SecurityBadges } from '@/components/TrustAndAuthority';


interface LandingPageProps {
    events: LifeEvent[];
    onSelectEvent: (event: LifeEvent) => void;
}

// Curated Emotional/Premium Assets
const IMAGES = {
    marriage: "/assets/images/marriage.png",
    birth: "/assets/images/birth.png",
    moving: "/assets/images/moving.png",
    job: "/assets/images/job.png",
    startup: "/assets/images/startup.png",
    care: "/assets/images/care_jp.png", // Japanese Care Photo
    hero: "https://images.unsplash.com/photo-1628153406562-520e7df68c5b?q=80&w=1000&auto=format&fit=crop",
};

interface HexCardProps {
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: React.ElementType;
    onClick?: () => void;
    className?: string;
    delay?: number;
    type?: 'photo' | 'text';
}

function HexagonCard({ image, title, subtitle, description, icon: Icon, onClick, className = "", delay = 0, type = 'photo' }: HexCardProps) {
    return (
        <ScrollReveal
            className={`relative w-[160px] h-[184px] md:w-[280px] md:h-[320px] group cursor-pointer transition-transform hover:z-10 ${className}`}
            delay={delay}
        >
            <div
                className="absolute inset-0 w-full h-full shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    backgroundColor: type === 'text' ? 'rgba(255, 255, 255, 0.9)' : '#f5f5f4',
                    backdropFilter: type === 'text' ? 'blur(20px)' : 'none',
                }}
                onClick={onClick}
            >
                {type === 'photo' && image && (
                    <>
                        <div className="absolute inset-0">
                            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-90" />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-4 md:p-8 text-center z-10 pb-6 md:pb-10">
                            <h3 className="text-sm md:text-xl font-bold tracking-wide drop-shadow-md mb-1 md:mb-2">{title}</h3>
                            <div className="w-4 md:w-8 h-0.5 bg-teal-400 mb-1 md:mb-3" />
                            <p className="hidden md:block text-xs font-medium text-slate-200 leading-relaxed max-w-[180px]">{description}</p>
                            <p className="text-[8px] md:text-[10px] font-bold opacity-60 tracking-widest uppercase mt-1 md:mt-3">{subtitle}</p>
                        </div>
                        {Icon && (
                            <div className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                        )}
                    </>
                )}

                {type === 'text' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center text-slate-700">
                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 opacity-[0.1] bg-[size:20px_20px] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear_gradient(to_bottom,#0f172a_1px,transparent_1px)]" />

                        <div className="relative z-10">
                            <span className="text-teal-600 font-serif italic text-xs md:text-lg mb-1 md:mb-3 block animate-pulse">LifeBridge</span>
                            <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-4 text-slate-800 leading-tight">{title}</h3>
                            <p className="text-[10px] md:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 md:line-clamp-none">{subtitle}</p>
                            <div className="hidden md:flex mt-8 mx-auto w-10 h-10 rounded-full border border-slate-300 items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-all duration-300 shadow-sm">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}

export function LandingPageTest({ events, onSelectEvent }: LandingPageProps) {
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

    useEffect(() => {
        const update = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", update);
        update();
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">

            {/* --- Mesh Gradient Background --- */}
            <div className="fixed inset-0 z-0 select-none pointer-events-none">
                <MeshGradient
                    width={dimensions.width}
                    height={dimensions.height}
                    colors={["#b2dfdb", "#80cbc4", "#c8e6c9", "#a5d6a7", "#e0f2f1", "#ffffff"]}
                    distortion={0.5}
                    swirl={0.4}
                    speed={0.4}
                />
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 px-6 py-5 flex justify-between items-center transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="/lb-logo.png" alt="LifeBridge" className="w-10 h-10 rounded-full shadow-md" />
                    <span className="text-xl font-bold tracking-tight text-teal-700">LifeBridge</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button className="rounded-full bg-teal-600 text-white px-6 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" onClick={() => navigate('/login')}>
                        LOGIN
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-32 pb-0 px-0 flex flex-col items-center w-full"> {/* px-0 for full width sections */}

                {/* Intro Text & Hero Image (Centered Layout for Wide Roadmap) */}
                <div className="flex flex-col items-center w-full max-w-7xl mx-auto mb-4 md:mb-8 relative z-10">

                    {/* Top: Centered Text Content */}
                    <div className="text-center max-w-4xl mx-auto relative z-20 mb-[-60px] md:mb-[-140px]"> {/* More aggressive negative margin to pull image up */}

                        {/* Glossy Badge */}
                        <div className="inline-block mb-6 group cursor-default">
                            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs md:text-sm font-bold tracking-[0.2em] shadow-lg flex items-center gap-2 ring-4 ring-emerald-50/60 backdrop-blur-sm">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                                LIFE EVENT CONCIERGE
                            </div>
                        </div>

                        <h1 className="text-slate-900 mb-6 leading-[1.2] tracking-wide text-balance">
                            <span className="block text-xl md:text-3xl font-bold text-emerald-800/80 mb-4 font-['Kaisei_Decol']">
                                <span className="text-3xl md:text-5xl font-black text-emerald-700">複雑な行政手続きを</span><br className="lg:hidden" />リスト化しわかりやすく
                            </span>
                            <span className="block text-5xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-800 drop-shadow-sm pb-2 tracking-tight">
                                ナビゲーション
                            </span>
                            <span className="block text-sm md:text-base text-emerald-600/70 font-bold tracking-[0.3em] uppercase mt-4">
                                - Your Personal Guide -
                            </span>
                        </h1>

                        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium mb-10 max-w-xl mx-auto font-['Kaisei_Decol']">
                            ライフイベントを<span className="text-emerald-600 font-bold text-xl px-1">選択するだけ</span>で、<br />
                            必要な手続きがすべて分かる。<br />
                            あなただけの『手続きロードマップ』を、瞬時に作成します。
                        </p>

                        <div className="flex flex-row items-center justify-center gap-3 mb-0 w-full px-4 sm:px-0">
                            <Button className="h-14 px-4 sm:px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200 text-base sm:text-lg font-bold flex-1 sm:flex-initial transition-transform hover:scale-105" onClick={() => navigate('/login')}>
                                無料で試す
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" className="h-14 px-4 sm:px-8 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-base sm:text-lg font-bold flex-1 sm:flex-initial bg-white/60 backdrop-blur-sm" onClick={() => document.getElementById('life-events-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                詳しく見る
                            </Button>
                        </div>
                    </div>

                    {/* Bottom: Wide Hero Image (Roadmap) */}
                    <div className="w-full max-w-[1200px] relative animate-fade-in-up delay-200 pointer-events-none -z-10 mb-[-100px] md:mb-[-220px]">
                        {/* Image with crop effect via mix-blend-mode and negative margins */}
                        <div className="relative transform scale-[1.2] md:scale-110 origin-center mt-[-40px] md:mt-[-340px]">
                            <img
                                src="/hero-roadmap-wide.png"
                                alt="LifeBridge Roadmap Journey"
                                className="w-full h-auto mix-blend-multiply opacity-90 drop-shadow-2xl"
                                style={{ maskImage: 'linear-gradient(to bottom, transparent 30%, black 45%, black 55%, transparent 70%)' }}
                            />
                        </div>
                    </div>

                </div>

                {/* Trust Marquee (Full Width) */}
                <div className="w-full relative z-20 -mt-32 md:-mt-52">
                    <TrustMarquee />
                </div>

                {/* --- Honeycomb Mosaic --- */}
                <div id="life-events-section" className="relative w-full max-w-5xl mx-auto py-12 md:py-24 px-4">
                    <div className="text-center mb-16 font-['Zen_Old_Mincho']">
                        <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3 block">Life Events</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4">ライフイベントから選ぶ</h2>
                        <p className="text-slate-500 font-['Kaisei_Decol']">あなたの現在の状況を選択してください。</p>
                    </div>

                    {/* PC Layout: Staggered Rows */}
                    <div className="flex flex-wrap justify-center -ml-10 md:-ml-16 pb-20">
                        {/* Row 1 */}
                        <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-8 items-center md:-mb-24">
                            <HexagonCard
                                type="photo"
                                image={IMAGES.marriage}
                                title="結婚"
                                subtitle="MARRIAGE"
                                description="氏名変更・口座名義・扶養手続きなど"
                                icon={Heart}
                                onClick={() => onSelectEvent({ id: 'marriage', title: '結婚', category: 'marriage' } as any)}
                            />
                            {/* Decorative Text Hex */}
                            <HexagonCard
                                type="text"
                                title="ふたりの未来"
                                subtitle="新生活のスタートに必要な手続きを、漏れなくスムーズに。"
                                delay={0.1}
                                className="md:translate-y-24" // Stagger down
                            />
                            <HexagonCard
                                type="photo"
                                image={IMAGES.moving}
                                title="引越し"
                                subtitle="MOVING"
                                description="転出/転入届・マイナンバー・ライフライン"
                                icon={MapPin}
                                delay={0.2}
                                onClick={() => onSelectEvent({ id: 'moving', title: '引越し', category: 'moving' } as any)}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-8 items-center md:pl-36 md:-mb-24 pt-[-20px] md:pt-0">
                            <HexagonCard
                                type="text"
                                title="新しい家族"
                                subtitle="出生届から児童手当まで。大切な時間を手続きで邪魔させません。"
                                delay={0.3}
                            />
                            <HexagonCard
                                type="photo"
                                image={IMAGES.birth}
                                title="出産"
                                subtitle="BIRTH"
                                description="出生届・児童手当・健康保険証の発行"
                                icon={Baby}
                                delay={0.4}
                                className="md:translate-y-24" // Stagger down
                                onClick={() => onSelectEvent({ id: 'birth', title: '出産', category: 'birth' } as any)}
                            />
                            <HexagonCard
                                type="text"
                                title="キャリア"
                                subtitle="就職・転職に伴う年金や税金の切り替えも、AIがガイドします。"
                                delay={0.5}
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-8 items-center pt-[-20px] md:pt-0">
                            <HexagonCard
                                type="photo"
                                image={IMAGES.job}
                                title="就職・転職"
                                subtitle="CAREER"
                                description="年金切り替え・税金納付・保険証の返却"
                                icon={Briefcase}
                                delay={0.6}
                                onClick={() => onSelectEvent({ id: 'job', title: '転職', category: 'job' } as any)}
                            />
                            <HexagonCard
                                type="photo"
                                image={IMAGES.startup}
                                title="起業"
                                subtitle="STARTUP"
                                description="開業届・青色申告承認申請・口座開設"
                                icon={Rocket}
                                delay={0.7}
                                className="md:translate-y-24" // Stagger down
                                onClick={() => onSelectEvent({ id: 'startup', title: '起業', category: 'startup' } as any)}
                            />
                            <HexagonCard
                                type="photo"
                                image={IMAGES.care}
                                title="介護"
                                subtitle="CARE"
                                description="介護保険申請・認定調査・ケアプラン作成"
                                icon={HandHeart}
                                delay={0.8}
                                onClick={() => onSelectEvent({ id: 'care', title: '介護', category: 'care' } as any)}
                            />
                        </div>
                    </div>
                </div>

                {/* FAQ & Download CTA (New) */}
                <div className="w-full">
                    {/* Main Features Infographic (New Design) */}
                    <div className="w-full bg-slate-50/50 py-16 mb-16 overflow-hidden relative">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl" />
                        </div>

                        <div className="max-w-6xl mx-auto px-6 relative z-10">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-['Zen_Old_Mincho']">LifeBridgeの提供価値</h2>
                                <p className="text-slate-500 mt-3 font-['Kaisei_Decol']">すべての機能を、ひとつのプラットフォームで。</p>
                            </div>

                            {/* Infographic Container */}
                            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 md:h-[500px]">

                                {/* Connecting Lines (Desktop Only) */}
                                <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 500" preserveAspectRatio="none">
                                    {/* Top Left */}
                                    <path d="M 400 250 L 250 150" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                    {/* Top Right */}
                                    <path d="M 400 250 L 550 150" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                    {/* Bottom Left */}
                                    <path d="M 400 250 L 250 350" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                    {/* Bottom Right */}
                                    <path d="M 400 250 L 550 350" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                </svg>

                                {/* Center Hub */}
                                <div className="relative z-20 w-48 h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-8 border-slate-50 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                                    <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-pulse" />
                                    <LifeBridgeLogo className="w-12 h-12 text-teal-600 mb-2" />
                                    <div className="text-center">
                                        <span className="block text-sm font-bold text-slate-400 tracking-wider">TOTAL</span>
                                        <span className="block text-xl font-black text-slate-800 tracking-tight">SUPPORT</span>
                                    </div>
                                </div>

                                {/* Top Left Card (Simulation) */}
                                <div className="relative z-10 w-full md:absolute md:top-[50px] md:left-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4 transition-transform hover:scale-105 border border-emerald-100 hover:border-emerald-300 group">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                                            <Coins className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-lg font-bold text-slate-800 text-emerald-900 group-hover:text-emerald-700">給付金シミュレーション</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">「もらえるお金」を瞬時に試算。<br />受給漏れをゼロにします。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right Card (Roadmap) */}
                                <div className="relative z-10 w-full md:absolute md:top-[50px] md:right-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center flex-row-reverse md:flex-row gap-4 transition-transform hover:scale-105 border border-teal-100 hover:border-teal-300 group">
                                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                                            <MapIcon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                                            <h3 className="text-lg font-bold text-slate-800 text-teal-900 group-hover:text-teal-700">最短ルート案内</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">今の状況に合わせた<br />最適な手続き順序を自動生成。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Left Card (Reminders) */}
                                <div className="relative z-10 w-full md:absolute md:bottom-[50px] md:left-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4 transition-transform hover:scale-105 border border-indigo-100 hover:border-indigo-300 group">
                                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 transition-colors">
                                            <Bell className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-lg font-bold text-slate-800 text-indigo-900 group-hover:text-indigo-700">手続きリマインダー</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">申請期限をプッシュ通知。<br />「うっかり忘れ」を防ぎます。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Right Card (AI Concierge - New) */}
                                <div className="relative z-10 w-full md:absolute md:bottom-[50px] md:right-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center flex-row-reverse md:flex-row gap-4 transition-transform hover:scale-105 border border-amber-100 hover:border-amber-300 group">
                                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                                            <Bot className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                                            <h3 className="text-lg font-bold text-slate-800 text-amber-900 group-hover:text-amber-700">AIコンシェルジュ</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">24時間365日、<br />疑問や不安を即座に解消。</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* --- Pain Points Section (Dark Green Theme) --- */}
                <div className="w-full bg-gradient-to-b from-emerald-900 via-teal-900 to-emerald-950 py-16 md:py-24 relative overflow-hidden">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent" />

                    <div className="max-w-6xl mx-auto px-4 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-4xl font-bold text-white font-['Zen_Old_Mincho'] mb-4 drop-shadow-md">
                                こんなことでお困りではないですか？
                            </h2>
                            <p className="text-teal-200 font-['Kaisei_Decol']">
                                人生の転機には、たくさんの不安がつきもの。
                            </p>
                        </div>

                        {/* Main Visual Container */}
                        <div className="relative w-full max-w-4xl mx-auto h-[550px] md:h-[650px] flex items-end justify-center">

                            {/* Central Image (Worried Woman) */}
                            <img
                                src="/assets/images/worried_woman_no_text.png"
                                alt="Worried Woman"
                                className="h-[300px] md:h-[450px] object-contain relative z-10 drop-shadow-2xl"
                                style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}
                            />

                            {/* Thought Bubbles (Extra Fluffy Cloud Style - もこもこ) */}
                            {/* Bubble 1: Marriage Worries */}
                            <div className="absolute top-[2%] left-[-12%] md:left-[3%] w-44 md:w-60 animate-float-slow z-20 scale-[0.6] md:scale-100 origin-top-left">
                                <div className="relative">
                                    {/* Base white rectangle - lowest layer */}
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    {/* Extra fluffy cloud circles - middle layer to cover edges */}
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        {/* Left side bumps - more circles to cover edge */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        {/* Right side bumps - more circles to cover edge */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    {/* Text content - highest layer */}
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">結婚</span>で必要な<br />手続きは？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 2: Childbirth Benefits - hidden on mobile */}
                            <div className="absolute top-[-2%] left-[22%] md:left-[32%] w-48 md:w-64 animate-float-medium z-20 scale-[0.55] md:scale-100 origin-top hidden md:block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-8 left-16 md:left-22" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">出産</span>で<br />もらえる給付金は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 3: Moving Procedures */}
                            <div className="absolute top-[2%] right-[-12%] md:right-[3%] w-48 md:w-64 animate-float-fast z-20 scale-[0.6] md:scale-100 origin-top-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-8 left-16 md:left-22" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">引っ越し</span>で<br />必要な届出は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 4: Job Change */}
                            <div className="absolute top-[26%] left-[-15%] md:left-[-5%] w-44 md:w-56 animate-float-medium z-20 scale-[0.6] md:scale-100 origin-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">転職</span>したら<br />保険はどうなる？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 5: Care / Nursing */}
                            <div className="absolute top-[22%] right-[-15%] md:right-[-5%] w-52 md:w-68 animate-float-slow z-20 scale-[0.6] md:scale-100 origin-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-16 h-16 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-12" />
                                        <div className="absolute w-18 h-18 md:w-22 md:h-22 bg-white rounded-full -top-8 left-18 md:left-24" />
                                        <div className="absolute w-16 h-16 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-12" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-14 -left-5" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-14 -right-5" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-16 h-16 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-18 h-18 md:w-22 md:h-22 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-16 h-16 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-base md:text-xl font-bold text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">介護</span>の<br />手続き、何から？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 6: Starting a Business */}
                            <div className="absolute bottom-[32%] left-[-18%] md:left-[-8%] w-44 md:w-60 animate-float-fast z-10 scale-[0.6] md:scale-100 origin-bottom-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">起業</span>したけど<br />届出は大丈夫？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 7: Retirement */}
                            <div className="absolute bottom-[8%] left-[-5%] md:left-[8%] w-40 md:w-52 animate-float-medium z-10 scale-[0.55] md:scale-100 origin-bottom-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-4 -left-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 left-6 md:left-8" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-12 md:left-16" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 right-6 md:right-8" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-4 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-2 -left-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-4 -left-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-2 -right-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-4 -right-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -bottom-3 -left-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 left-6 md:left-8" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-12 md:left-16" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 right-6 md:right-8" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -bottom-3 -right-2" />
                                    </div>
                                    <div className="relative px-4 py-5 md:px-6 md:py-7 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">退職</span>後の<br />手続きは？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 8: Death/Inheritance */}
                            <div className="absolute bottom-[8%] right-[-5%] md:right-[8%] w-40 md:w-52 animate-float-slow z-10 scale-[0.55] md:scale-100 origin-bottom-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        {/* Top row of bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-4 -left-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 left-6 md:left-8" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-12 md:left-16" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 right-6 md:right-8" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-4 -right-2" />
                                        {/* Left side bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-2 -left-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-4 -left-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        {/* Right side bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -top-2 -right-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-4 -right-4" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        {/* Bottom row of bumps */}
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -bottom-3 -left-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 left-6 md:left-8" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-12 md:left-16" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 right-6 md:right-8" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full -bottom-3 -right-2" />
                                    </div>
                                    <div className="relative px-4 py-5 md:px-6 md:py-7 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">相続</span>の<br />届出は？</h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Solution Bridge Banner */}
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-10 text-center shadow-inner mx-auto max-w-4xl relative overflow-hidden mt-16 md:mt-24">
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-4 mb-4 text-emerald-700">
                                    <Sparkles className="w-6 h-6" />
                                    <h3 className="text-xl md:text-2xl font-bold font-['Zen_Old_Mincho']">そんなあなたのために、LifeBridgeがあります</h3>
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    AIが最適な順序を提案し、期限を管理し、もらえる給付金を教えてくれる。<br />
                                    <strong className="text-teal-800">あなたは、ただ指示に従うだけ。</strong>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="w-full bg-gradient-to-b from-emerald-50 to-white pt-8 pb-24">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-[40px] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative Circles */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-md font-['Zen_Old_Mincho']">
                                    大切な手続きを、<br />もう忘れない
                                </h2>
                                <p className="text-emerald-50 text-lg mb-10 font-bold">
                                    120万円以上の給付金を見逃している人も。<br />
                                    LifeBridgeで、あなたが受け取れる<br className="md:hidden" />すべてを確認しましょう。
                                </p>

                                <Button
                                    className="bg-white text-teal-700 hover:bg-emerald-50 px-10 py-8 rounded-full text-xl font-bold shadow-xl transition-transform hover:scale-105 group-hover:shadow-2xl"
                                    onClick={() => navigate('/login')}
                                >
                                    今すぐ無料で始める
                                    <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full py-12 border-t border-slate-200 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <img src="/lb-logo.png" alt="LifeBridge" className="w-10 h-10 rounded-full shadow-lg" />
                                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                                    LifeBridge
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                <button
                                    onClick={() => navigate('/terms')}
                                    className="hover:text-foreground transition-colors"
                                >
                                    利用規約
                                </button>
                                <button
                                    onClick={() => navigate('/privacy')}
                                    className="hover:text-foreground transition-colors"
                                >
                                    プライバシーポリシー
                                </button>
                                <button
                                    onClick={() => navigate('/commercial-transaction')}
                                    className="hover:text-foreground transition-colors"
                                >
                                    特定商取引法
                                </button>
                                <button
                                    onClick={() => navigate('/help')}
                                    className="hover:text-foreground transition-colors"
                                >
                                    お問い合わせ
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                © 2025 LifeBridge. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}
