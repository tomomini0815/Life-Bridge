import { LifeEvent } from '@/types/lifeEvent';
import { Button } from '@/components/ui/button';
import { DashboardMockupReal } from './DashboardMockupReal';
import {
    Heart, Shield, Sparkles, ArrowRight,
    CheckCircle2, Clock, MapPin, Briefcase, Baby, Home, Users, Rocket, HandHeart,
    Coins, Map as MapIcon, Bell, Bot, HelpCircle, FileText, AlertCircle,
    HeartCrack, GraduationCap, Building2, PiggyBank, Scale, StickyNote,
    Accessibility, HeartOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MeshGradient } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';
import { ChatSimulation, FeatureBentoGrid, FAQAccordion, DownloadGuideCta } from '@/components/HighFidelityFeatures';
import { TrustMarquee, SecurityBadges } from '@/components/TrustAndAuthority';



interface LandingPageProps {
    events: any[];
    onSelectEvent: (event: any) => void;
    onOpenChat: () => void;
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
    divorce: "/assets/images/divorce_v2.png",
    exam: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    homePurchase: "/assets/images/home_purchase_v2.png",
    finance: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop",
    inheritance: "/assets/images/inheritance_v2.png",
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
            className={`relative w-[140px] h-[162px] md:w-[280px] md:h-[320px] group cursor-pointer transition-all duration-700 hover:z-20 ${className}`}
            delay={delay}
        >
            <div
                className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:hexagon-glow"
                style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    backgroundColor: type === 'text' ? '#ffffff' : '#f5f5f4',
                    overflow: 'hidden'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
            >
                {/* Shimmer Effect Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
                </div>

                {type === 'photo' && image && (
                    <>
                        <div className="absolute inset-0">
                            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] brightness-[1.15] contrast-[0.95]" />
                            <div className="absolute inset-0 bg-white/30 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/5 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-20" />
                            {/* Inner border glow */}
                            <div className="absolute inset-0 border border-white/10 pointer-events-none" style={{ clipPath: "polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)" }} />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center z-10 overflow-hidden group">
                            <div className="relative p-4 md:p-8 pb-6 md:pb-12 w-full">
                                <h3 className="text-sm md:text-2xl font-medium tracking-widest mb-1 md:mb-3 text-white [text-shadow:_0_3px_6px_rgba(0,0,0,0.8),_0_0_12px_rgba(0,0,0,0.6)]">{title}</h3>
                                <div className="w-6 md:w-12 h-0.5 bg-teal-400/80 mx-auto mb-2 md:mb-4 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                                <p className="hidden md:block text-xs font-medium text-slate-100 leading-relaxed max-w-[200px] mx-auto [text-shadow:_0_2px_4px_rgba(0,0,0,0.7)]">{description}</p>
                                <p className="text-[8px] md:text-[11px] font-semibold opacity-90 tracking-[0.3em] uppercase mt-2 md:mt-4 text-teal-300 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">{subtitle}</p>
                            </div>
                        </div>
                    </>
                )}

                {type === 'text' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center py-6 md:py-8 px-4 md:px-6 text-center bg-white border border-slate-100/50">
                        {/* No background patterns - clean white as per image */}
                        
                        <div className="relative z-10 w-full mb-3 md:mb-6">
                            <span className="text-emerald-500/60 font-kaisei text-[9px] md:text-sm lg:text-base mb-1 md:mb-2 block tracking-wider italic">LifeBridge</span>
                            <h3 className="text-sm md:text-xl lg:text-2xl font-bold mb-1.5 md:mb-3 text-slate-800 leading-tight tracking-tight px-1 whitespace-pre-line">{title}</h3>
                            {/* Line separator removed to match image */}
                            <p className="text-[9px] md:text-xs lg:text-sm text-slate-500 leading-relaxed max-w-[95%] mx-auto font-medium">{subtitle}</p>
                        </div>

                        {/* Button positioned higher, directly below the text group */}
                        <div className="flex mx-auto w-8 h-8 md:w-11 md:h-11 rounded-full border border-slate-100 items-center justify-center text-slate-400 bg-white shadow-sm transition-all duration-500 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:scale-110 group-hover:shadow-md">
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}


export function LandingPageTest({ events, onSelectEvent, onOpenChat }: LandingPageProps) {
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-emerald-200">
            {/* Navigation (Fixed) */}

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
                            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs md:text-sm font-semibold tracking-[0.2em] shadow-lg ring-4 ring-emerald-50/60 backdrop-blur-sm">
                                LIFE EVENT CONCIERGE
                            </div>
                        </div>

                        <h1 className="text-slate-900 mb-6 leading-[1.2] tracking-wide text-balance">
                            <span className="block text-xl md:text-3xl font-semibold text-emerald-800/80 mb-4">
                                <span className="text-3xl md:text-5xl font-semibold text-emerald-700">複雑な行政手続きを</span><br className="lg:hidden" />リスト化しわかりやすく
                            </span>
                            <span className="block text-5xl md:text-7xl lg:text-9xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-800 drop-shadow-sm pb-2 tracking-tight">
                                ナビゲーション
                            </span>
                            <span className="block text-sm md:text-base text-emerald-600/70 font-semibold tracking-[0.3em] uppercase mt-4">
                                - Your Personal Guide -
                            </span>
                        </h1>

                        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
                            ライフイベントを<span className="text-emerald-600 font-semibold text-xl px-1">選択するだけ</span>で、<br />
                            必要な手続きがすべて分かる。<br />
                            あなただけの『手続きロードマップ』を、瞬時に作成します。
                        </p>

                        <div className="flex flex-row items-center justify-center gap-3 mb-0 w-full px-4 sm:px-0">
                            <Button className="h-14 px-4 sm:px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200 text-base sm:text-lg font-medium flex-1 sm:flex-initial transition-transform hover:scale-105 mx-auto sm:mx-0" onClick={() => navigate('/login')}>
                                無料で試す
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" className="h-14 px-4 sm:px-8 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-base sm:text-lg font-medium flex-1 sm:flex-initial bg-white/60 backdrop-blur-sm" onClick={() => document.getElementById('life-events-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                詳しく見る
                            </Button>
                        </div>
                    </div>

                    {/* Bottom: Wide Hero Image (Roadmap) */}
                    <div className="w-full max-w-[1200px] relative animate-fade-in-up delay-200 pointer-events-none -z-10 mb-0 md:mb-[-220px]">
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
                <div className="w-full relative z-20 mt-[-140px] md:-mt-52">
                    <TrustMarquee />
                </div>

                {/* --- Honeycomb Mosaic --- */}
                <div id="life-events-section" className="relative w-full max-w-6xl mx-auto py-16 md:py-24 px-4 overflow-hidden">
                    {/* Decorative background glow behind the whole section */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-emerald-50/10 via-white/0 to-teal-50/10 pointer-events-none -z-10 blur-3xl opacity-60" />

                    <div className="text-center mb-16 md:mb-20 relative">
                        {/* Decorative background glow behind title */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-100/30 rounded-full blur-[100px] -z-10" />
                        
                        <span className="text-teal-600 font-semibold tracking-[0.2em] text-[10px] md:text-sm uppercase mb-3 md:mb-4 block opacity-70">Curated Life Journeys</span>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-4 tracking-tight leading-tight">
                            ライフイベントから選ぶ
                        </h2>
                        <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full mb-6 md:mb-8 shadow-[0_2px_6px_rgba(45,212,191,0.2)]" />
                        <p className="text-slate-600 font-medium mt-3">
                            人生の節目に必要な手続きを、<br className="md:hidden" />
                            AIが最適なロードマップとして可視化します。
                        </p>
                    </div>

                    {/* PC staggered look / Mobile: 2-1-2-1 pattern */}
                    <div className="flex flex-col items-center md:block pb-24 relative">
                        {/* Row 1 */}
                        <div className="flex flex-wrap justify-center gap-1 md:gap-8 items-center md:-mb-24">
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
                            <div className="hidden md:block">
                                <HexagonCard
                                    type="text"
                                    title="ふたりの未来"
                                    subtitle="新生活のスタートに必要な手続きを、漏れなくスムーズに。"
                                    delay={0.1}
                                    className="md:translate-y-24" // Stagger down
                                    onClick={() => onSelectEvent({ id: 'marriage', title: '結婚', category: 'marriage' } as any)}
                                />
                            </div>
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
                        <div className="flex flex-wrap justify-center gap-1 md:gap-4 items-center md:pl-36 md:-mb-24 -mt-8 md:mt-0">
                            <div className="hidden md:block">
                                <HexagonCard
                                    type="text"
                                    title="新しい家族"
                                    subtitle="出生届から児童手当まで。大切な時間を手続きで邪魔させません。"
                                    delay={0.3}
                                    onClick={() => onSelectEvent({ id: 'birth', title: '出産', category: 'birth' } as any)}
                                />
                            </div>
                            <HexagonCard
                                type="photo"
                                image={IMAGES.birth}
                                title="出産"
                                subtitle="BIRTH"
                                icon={Baby}
                                delay={0.4}
                                className="md:translate-y-24" // Stagger down
                                onClick={() => onSelectEvent({ id: 'birth', title: '出産', category: 'birth' } as any)}
                            />
                            <div className="hidden md:block">
                                <HexagonCard
                                    type="text"
                                    title="キャリア"
                                    subtitle="就職・転職に伴う年金や税金の切り替えも、AIがガイドします。"
                                    delay={0.5}
                                    onClick={() => onSelectEvent({ id: 'job', title: '転職', category: 'job' } as any)}
                                />
                            </div>
                        </div>

                        {/* Row 3 - Desktop single row (3 items) / Mobile 2+1 */}
                        <div className="contents md:flex md:flex-row md:justify-center md:gap-4 md:items-center md:-mb-24 md:mt-0">
                            <div className="flex flex-wrap justify-center gap-1 md:contents -mt-8 md:mt-0">
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.job}
                                    title="就職・転職"
                                    subtitle="CAREER"
                                    description="年金・税金の切り替え・住民税の納付"
                                    icon={Briefcase}
                                    delay={0.6}
                                    className="md:translate-y-24" // Stagger down
                                    onClick={() => onSelectEvent({ id: 'job', title: '転職', category: 'job' } as any)}
                                />
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.startup}
                                    title="起業"
                                    subtitle="STARTUP"
                                    description="開業届作成・社会保険・補助金申請"
                                    icon={Rocket}
                                    delay={0.7}
                                    onClick={() => onSelectEvent({ id: 'startup', title: '起業', category: 'startup' } as any)}
                                />
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 md:contents -mt-8 md:mt-0">
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.homePurchase}
                                    title="マイホーム"
                                    subtitle="HOME"
                                    description="理想の住まいを、確かな計画で。ローンから登記の手順まで。"
                                    icon={Home}
                                    delay={0.8}
                                    className="md:translate-y-24" // Stagger down
                                    onClick={() => onSelectEvent({ id: 'homePurchase', title: 'マイホーム', category: 'home' } as any)}
                                />
                            </div>
                        </div>

                        {/* Row 4 - Desktop single row (3 items) / Mobile 2+1 */}
                        <div className="contents md:flex md:flex-row md:justify-center md:gap-4 md:items-center md:pl-36 md:-mb-24 md:mt-0">
                            <div className="flex flex-wrap justify-center gap-1 md:contents -mt-8 md:mt-0">
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.divorce}
                                    title="離婚"
                                    subtitle="DIVORCE"
                                    description="公正証書作成・氏名変更・ひとり親支援"
                                    icon={HeartOff}
                                    delay={0.9}
                                    onClick={() => onSelectEvent({ id: 'divorce', title: '離婚', category: 'divorce' } as any)}
                                />
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.exam}
                                    title="受験"
                                    subtitle="EXAM"
                                    description="受験料の振込・奨学金の手続き・在学証明書"
                                    icon={GraduationCap}
                                    delay={1.0}
                                    className="md:translate-y-24" // Stagger down
                                    onClick={() => onSelectEvent({ id: 'exam', title: '受験', category: 'exam' } as any)}
                                />
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 md:contents -mt-8 md:mt-0">
                                <HexagonCard
                                    type="photo"
                                    image={IMAGES.care}
                                    title="介護"
                                    subtitle="CARE"
                                    description="要介護認定・福祉用具・補助金の手続き"
                                    icon={Accessibility}
                                    delay={1.1}
                                    onClick={() => onSelectEvent({ id: 'care', title: '介護', category: 'care' } as any)}
                                />
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="flex flex-wrap justify-center gap-1 md:gap-4 items-center -mt-8 md:mt-0">
                            <HexagonCard
                                type="photo"
                                image={IMAGES.finance}
                                title="財務・資産"
                                subtitle="FINANCE"
                                description="収支把握・保険見直し・資産運用"
                                icon={PiggyBank}
                                delay={1.2}
                                onClick={() => onSelectEvent({ id: 'finance', title: '財務', category: 'money' } as any)}
                            />
                            <div className="hidden md:block">
                                <HexagonCard
                                    type="text"
                                    title="安心をすべての人へ"
                                    subtitle="LifeBridgeがあなたの人生の複雑な手続きを、シームレスに繋ぎます。"
                                    delay={1.3}
                                    className="md:translate-y-24 cursor-pointer" // Stagger down
                                    onClick={onOpenChat}
                                />
                            </div>
                            <HexagonCard
                                type="photo"
                                image={IMAGES.inheritance}
                                title="相続"
                                subtitle="INHERITANCE"
                                description="大切な想いと資産を、次世代へ。相続人調査や遺産分割を支援。"
                                icon={Scale}
                                delay={1.4}
                                onClick={() => onSelectEvent({ id: 'inheritance', title: '相続', category: 'money' } as any)}
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
                            <div className="text-center mb-12 md:mb-16">
                                <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">LifeBridge Value</span>
                                <h2 className="text-2xl md:text-3xl font-medium text-slate-800 font-sans">
                                    LifeBridgeの提供価値
                                </h2>
                                <p className="text-slate-600 mt-3 font-medium">すべての機能を、ひとつのプラットフォームで。</p>
                            </div>

                            {/* Realistic Device Mockups Presentation */}
                            <div className="relative mb-20 md:mb-32">
                                <DashboardMockupReal />
                            </div>

                            {/* Infographic Container */}
                            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 md:h-[650px] mt-10">

                                {/* Connecting Lines (Desktop Only) */}
                                <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 650" preserveAspectRatio="none">
                                    {/* Top Left - Simulation */}
                                    <path d="M 400 325 L 180 120" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                    {/* Top Right - Roadmap */}
                                    <path d="M 400 325 L 620 120" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                    {/* Mid Left - A/B */}
                                    <path d="M 400 325 L 180 325" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                    {/* Mid Right - Memo */}
                                    <path d="M 400 325 L 620 325" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                    {/* Bottom Left - Reminder */}
                                    <path d="M 400 325 L 180 530" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                    {/* Bottom Right - AI */}
                                    <path d="M 400 325 L 620 530" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                </svg>

                                {/* Center Hub */}
                                <div className="relative z-20 w-48 h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-8 border-slate-50 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                                    <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-pulse" />
                                    <LifeBridgeLogo className="w-12 h-12 text-teal-600 mb-2" />
                                    <div className="text-center">
                                        <span className="block text-sm font-semibold text-slate-400 tracking-wider">TOTAL</span>
                                        <span className="block text-xl font-bold text-slate-800 tracking-tight">SUPPORT</span>
                                    </div>
                                </div>

                                {/* Top Left Card (Simulation) */}
                                <div className="relative z-10 w-full md:absolute md:top-[40px] md:left-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4 transition-transform hover:scale-105 border border-emerald-100 hover:border-emerald-300 group">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                                            <Coins className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-lg font-semibold text-slate-800 text-emerald-900 group-hover:text-emerald-700">給付金シミュレーション</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">「もらえるお金」を瞬時に試算。<br />受給漏れをゼロにします。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right Card (Roadmap) */}
                                <div className="relative z-10 w-full md:absolute md:top-[40px] md:right-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center flex-row-reverse md:flex-row gap-4 transition-transform hover:scale-105 border border-teal-100 hover:border-teal-300 group">
                                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                                            <MapIcon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                                            <h3 className="text-lg font-semibold text-slate-800 text-teal-900 group-hover:text-teal-700">最短ルート案内</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">今の状況に合わせた<br />最適な手続き順序を自動生成。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mid Left Card (Decision) - NEW */}
                                <div className="relative z-10 w-full md:absolute md:top-[50%] md:-translate-y-1/2 md:left-[2%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4 transition-transform hover:scale-105 border-teal-100 hover:border-teal-300 group">
                                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                                            <Scale className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-lg font-semibold text-slate-800 text-teal-900 group-hover:text-teal-700">A/B比較分析</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">「起業する？残る？」<br />迷った時の定量的な判断基準を提示。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mid Right Card (Memo) - NEW */}
                                <div className="relative z-10 w-full md:absolute md:top-[50%] md:-translate-y-1/2 md:right-[2%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center flex-row-reverse md:flex-row gap-4 transition-transform hover:scale-105 border-emerald-100 hover:border-emerald-300 group">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                                            <StickyNote className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                                            <h3 className="text-lg font-semibold text-slate-800 text-emerald-900 group-hover:text-emerald-700">スマートメモ帳</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">情報の一元管理。<br />AIが自動で整理・タグ付けします。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Left Card (Reminders) */}
                                <div className="relative z-10 w-full md:absolute md:bottom-[40px] md:left-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4 transition-transform hover:scale-105 border-emerald-100 hover:border-emerald-300 group">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                                            <Bell className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-lg font-semibold text-slate-800 text-emerald-900 group-hover:text-emerald-700">手続きリマインダー</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">サブスクや申請期限をプッシュ通知。<br />「うっかり忘れ」を防ぎます。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Right Card (AI Concierge) */}
                                <div className="relative z-10 w-full md:absolute md:bottom-[40px] md:right-[5%] md:w-[350px]">
                                    <div className="bg-white rounded-full shadow-lg p-2 flex items-center flex-row-reverse md:flex-row gap-4 transition-transform hover:scale-105 border-teal-100 hover:border-teal-300 group">
                                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                                            <Bot className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                                            <h3 className="text-lg font-semibold text-slate-800 text-teal-900 group-hover:text-teal-700">AIコンシェルジュ</h3>
                                            <p className="text-xs text-slate-500 leading-tight mt-1">24時間365日、<br />疑問や不安を即座に解消。</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* --- Pain Points Section (Dark Green Theme) --- */}
                <div className="w-full bg-emerald-950/85 backdrop-blur-2xl py-16 md:py-24 relative overflow-hidden">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent" />

                    <div className="max-w-6xl mx-auto px-4 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 drop-shadow-md">
                                こんなことでお困りではないですか？
                            </h2>
                            <p className="text-teal-200 font-medium">
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
                            <div className="absolute top-[8%] left-[-15%] md:top-[2%] md:left-[-4%] w-44 md:w-60 animate-float-slow z-20 scale-[0.6] md:scale-95 origin-top-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-medium text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">結婚</span>で必要な<br />手続きは？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 2: Childbirth Benefits */}
                            <div className="absolute top-[12%] left-[5%] md:top-[12%] md:left-[16%] w-48 md:w-64 animate-float-medium z-30 scale-[0.55] md:scale-95 origin-top hidden md:block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-8 left-16 md:left-22" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-medium text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">出産</span>で<br />もらえる給付金は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 3: Moving Procedures */}
                            <div className="absolute top-[2%] left-[30%] -translate-x-1/2 md:top-[12%] md:left-auto md:right-[16%] md:translate-x-0 w-48 md:w-64 animate-float-fast z-30 scale-[0.6] md:scale-95 origin-top md:origin-top-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-8 left-16 md:left-22" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-medium text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">引っ越し</span>で<br />必要な届出は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 4: Job Change */}
                            <div className="absolute top-[35%] left-[-15%] md:top-[30%] md:left-[-8%] w-44 md:w-56 animate-float-medium z-20 scale-[0.6] md:scale-95 origin-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-medium text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">転職</span>したら<br />保険はどうなる？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 5: Care / Nursing */}
                            <div className="absolute top-[8%] right-[-15%] md:top-[2%] md:right-[-4%] w-52 md:w-68 animate-float-slow z-20 scale-[0.6] md:scale-95 origin-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-8 left-16 md:left-22" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -top-7 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-6 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -left-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -top-2 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-6 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-14 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full top-22 -right-6" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 left-12 md:left-16" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-7 left-24 md:left-28" />
                                        <div className="absolute w-14 h-14 md:w-18 md:h-18 bg-white rounded-full -bottom-6 right-12 md:right-16" />
                                        <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-white rounded-full -bottom-5 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-base md:text-xl font-medium text-slate-800 leading-tight"><span className="text-lg md:text-2xl text-emerald-700">介護</span>の<br />手続き、何から？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 6: Starting a Business */}
                            <div className="absolute bottom-[20%] left-[-10%] md:bottom-[-2%] md:left-[-2%] w-44 md:w-60 animate-float-fast z-30 scale-[0.6] md:scale-95 origin-bottom-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
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
                            <div className="absolute bottom-[20%] right-[-10%] md:bottom-[12%] md:left-[18%] w-40 md:w-52 animate-float-medium z-30 scale-[0.55] md:scale-95 origin-bottom-left">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-4 py-5 md:px-6 md:py-7 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">退職</span>後の<br />手続きは？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 8: Death/Inheritance */}
                            <div className="absolute bottom-[5%] right-[-5%] md:bottom-[5%] md:right-[10%] w-40 md:w-52 animate-float-slow z-20 scale-[0.55] md:scale-95 origin-bottom-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-4 py-5 md:px-6 md:py-7 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">相続</span>の<br />届出は？</h3>
                                    </div>
                                </div>
                            </div>



                            {/* Bubble 10: Exam (New) */}
                            <div className="absolute top-[35%] right-[-15%] md:top-[30%] md:right-[-8%] w-44 md:w-56 animate-float-medium z-20 scale-[0.6] md:scale-95 origin-right">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight">子供の<span className="text-lg md:text-xl text-emerald-700">受験</span><br />費用は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 11: Home Purchase (New) */}
                            <div className="absolute bottom-[5%] left-[-5%] md:top-[58%] md:left-[-4%] w-48 md:w-60 animate-float-slow z-20 scale-[0.6] md:scale-[0.90] origin-bottom-left md:origin-left opacity-90">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight"><span className="text-lg md:text-xl text-emerald-700">マイホーム</span>の<br />資金計画は？</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bubble 12: Finance (New) */}
                            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 md:-translate-x-0 md:top-[58%] md:left-auto md:right-[-4%] w-44 md:w-56 animate-float-medium z-40 scale-[0.6] md:scale-[0.85] origin-right hidden md:block opacity-90">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-3xl" />
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 left-6 md:left-8" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -top-7 left-14 md:left-18" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -top-6 right-6 md:right-8" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-5 -right-2" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -left-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -left-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -left-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -top-2 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-4 -right-5" />
                                        <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-full top-10 -right-4" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full top-16 -right-5" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -left-2" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 left-8 md:left-10" />
                                        <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full -bottom-6 left-16 md:left-20" />
                                        <div className="absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-full -bottom-5 right-8 md:right-10" />
                                        <div className="absolute w-12 h-12 md:w-14 md:h-14 bg-white rounded-full -bottom-4 -right-2" />
                                    </div>
                                    <div className="relative px-5 py-6 md:px-7 md:py-8 text-center z-20">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight">将来の<br /><span className="text-lg md:text-xl text-emerald-700">家計</span>は平気？</h3>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                    </div>

                    {/* Section: Solution Bridge (Clean Transition) */}
                    <div className="w-full relative py-20">
                        {/* Smooth Fade from Dark Section above */}
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#022c22]/90 to-transparent z-10 pointer-events-none -translate-y-px" />
                        
                        {/* Subdued Background to anchor the MeshGradient */}
                        <div className="absolute inset-0 bg-emerald-50/20 backdrop-blur-md" />
                        
                        <div className="max-w-6xl mx-auto px-4 relative z-10">

                            {/* Solution Bridge Banner */}
                            <div className="bg-gradient-to-r from-emerald-100/80 to-teal-100/80 backdrop-blur-md rounded-3xl p-10 text-center shadow-xl border border-white/50 mx-auto max-w-4xl relative overflow-hidden">
                                <div className="relative z-10">
                                <div className="flex items-center justify-center gap-4 mb-4 text-emerald-700">
                                    <Sparkles className="w-6 h-6" />
                                    <h3 className="text-xl md:text-2xl font-bold">そんなあなたのために、LifeBridgeがあります</h3>
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
                <div className="w-full bg-emerald-50/40 backdrop-blur-xl pt-8 pb-24">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-[40px] p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative Circles */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                                <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-md">
                                    大切な手続きを、<br />もう忘れない
                                </h2>
                                <p className="text-emerald-50 text-lg mb-10 font-bold">
                                    120万円以上の給付金を見逃している人も。<br />
                                    LifeBridgeで、あなたが受け取れる<br className="md:hidden" />すべてを確認しましょう。
                                </p>

                                <Button
                                    className="bg-white text-teal-700 hover:bg-emerald-50 px-6 sm:px-10 py-6 sm:py-8 rounded-full text-lg sm:text-xl font-bold shadow-xl transition-transform hover:scale-105 group-hover:shadow-2xl mx-auto flex items-center justify-center w-[90%] sm:w-auto"
                                    onClick={() => navigate('/login')}
                                >
                                    今すぐ無料で始める
                                    <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full py-12 border-t border-slate-200 bg-white/40 backdrop-blur-md">
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
                                    onClick={() => navigate('/help')}
                                    className="hover:text-foreground transition-colors"
                                >
                                    お問い合わせ
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                © 2025-2026 LifeBridge. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}
