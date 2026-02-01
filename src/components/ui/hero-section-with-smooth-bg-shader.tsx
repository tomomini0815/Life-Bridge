import { MeshGradient } from "@paper-design/shaders-react"
import { useEffect, useState } from "react"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import { LifeBridgeLogo } from "./LifeBridgeLogo"

interface HeroSectionProps {
    title?: string
    highlightText?: string
    description?: string
    buttonText?: string
    secondaryButtonText?: string
    onButtonClick?: () => void
    onSecondaryButtonClick?: () => void
    onLoginClick?: () => void
    colors?: string[]
    distortion?: number
    swirl?: number
    speed?: number
    offsetX?: number
    className?: string
    showStats?: boolean
    stats?: Array<{ value: string; label: string }>
    titleFontWeight?: string
}

export function HeroSection({
    title = "Intelligent AI Agents for",
    highlightText = "Smart Brands",
    description = "Transform your brand and evolve it through AI-driven brand guidelines and always up-to-date core components.",
    buttonText = "Join Waitlist",
    secondaryButtonText = "Learn More",
    onButtonClick,
    onSecondaryButtonClick,
    onLoginClick,
    colors = ["#e0f2f1", "#b2dfdb", "#e8f5e9", "#c8e6c9", "#f1f8e9", "#ffffff"],
    distortion = 0.5,
    swirl = 0.4,
    speed = 0.3,
    offsetX = 0.08,
    className = "",
    showStats = false,
    stats = [],
    titleFontWeight = "font-serif",
}: HeroSectionProps) {
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
    const [mounted, setMounted] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Detect mobile devices
        const checkMobile = () => {
            const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
            setIsMobile(mobile)
        }
        checkMobile()

        const update = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
            checkMobile()
        }
        update()

        const handleScroll = () => setScrollY(window.scrollY)

        window.addEventListener("resize", update)
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("resize", update)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick()
        }
    }

    const handleSecondaryButtonClick = () => {
        if (onSecondaryButtonClick) {
            onSecondaryButtonClick()
        }
    }

    return (
        <section className={`relative w-full overflow-hidden bg-background flex flex-col ${className}`}>
            {/* Animated Mesh Gradient Background */}
            <div className="fixed inset-0 w-screen h-screen">
                {mounted && (
                    <>
                        <MeshGradient
                            width={dimensions.width}
                            height={dimensions.height}
                            colors={colors}
                            distortion={distortion}
                            swirl={swirl}
                            grainMixer={0}
                            grainOverlay={0}
                            speed={speed}
                            offsetX={offsetX}
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-black/40 dark:via-black/10" />
                    </>
                )}
            </div>

            {/* Floating Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50
                    ? 'bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm border-b border-white/20'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <LifeBridgeLogo className="w-10 h-10 drop-shadow-md transition-all duration-300 group-hover:scale-110" />
                        <span className="text-xl font-serif font-bold text-foreground/80 tracking-wide">
                            LifeBridge
                        </span>
                    </div>
                    <button
                        onClick={onLoginClick}
                        className="px-6 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-sm font-medium hover:bg-white/60 transition-all duration-300 hover:shadow-md">
                        ログイン
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-32 pb-16">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-sm font-medium mb-8 animate-fade-in shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                        <Sparkles className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-foreground/70 tracking-wide">
                            人生の転機をスムーズに
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className={`${titleFontWeight} text-foreground text-balance mb-8 animate-slide-up leading-tight tracking-tight`}>
                        <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 text-foreground/80">
                            {title}
                        </span>
                        <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-sm font-sans font-bold">
                            {highlightText}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-foreground/60 text-balance max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up px-4 sm:px-0" style={{ animationDelay: '0.1s' }}>
                        {description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-slide-up w-full sm:w-auto px-6" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={handleButtonClick}
                            className="group relative w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-emerald-400/90 to-teal-400/90 text-white text-lg font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative flex items-center justify-center gap-2 z-10">
                                {buttonText}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </button>

                        {secondaryButtonText && (
                            <button
                                onClick={handleSecondaryButtonClick}
                                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-lg font-medium hover:bg-white/70 transition-all duration-300 hover:shadow-lg text-foreground/80"
                            >
                                {secondaryButtonText}
                            </button>
                        )}
                    </div>

                    {/* Professional Circular Stats */}
                    {showStats && stats.length > 0 && (
                        <div className="animate-slide-up w-full max-w-5xl mx-auto px-4" style={{ animationDelay: '0.3s' }}>
                            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                                {stats.map((stat, index) => (
                                    <div key={stat.label} className="flex flex-col items-center gap-3 group cursor-default">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <p className="text-xl md:text-2xl font-bold text-emerald-600/90 z-10">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <p className="text-xs md:text-sm text-foreground/60 font-medium tracking-wide">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-6 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-2 text-sm text-foreground/60 dark:text-foreground/70">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>安全・安心</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-foreground/30" />
                        <div className="flex items-center gap-2 text-sm text-foreground/60 dark:text-foreground/70">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>完全無料</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-foreground/30" />
                        <div className="flex items-center gap-2 text-sm text-foreground/60 dark:text-foreground/70">
                            <Sparkles className="w-4 h-4 text-teal-500" />
                            <span>AI搭載</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 rounded-full bg-foreground/50 animate-scroll" />
                </div>
            </div>
        </section>
    )
}
