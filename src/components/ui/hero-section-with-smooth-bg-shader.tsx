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
    colors = ["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"],
    distortion = 0.8,
    swirl = 0.6,
    speed = 0.42,
    offsetX = 0.08,
    className = "",
    showStats = false,
    stats = [],
    titleFontWeight = "font-bold",
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
        <section className={`relative w-full min-h-screen overflow-hidden bg-background flex items-center justify-center ${className}`}>
            {/* Animated Mesh Gradient Background */}
            <div className="fixed inset-0 w-screen h-screen">
                {mounted && !isMobile && (
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
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-white/20 dark:via-black/5 dark:to-black/20" />
                    </>
                )}
                {/* Static gradient for mobile devices */}
                {isMobile && (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 dark:from-teal-950 dark:via-emerald-950 dark:to-cyan-950" />
                )}
            </div>

            {/* Floating Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50
                    ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/10'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-xl group-hover:shadow-teal-500/50 transition-all duration-300 group-hover:scale-110 p-2">
                            <LifeBridgeLogo className="w-full h-full" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                            LifeBridge
                        </span>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 text-sm font-semibold hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-105">
                        ログイン
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-20">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 text-sm font-semibold mb-8 animate-fade-in shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="bg-gradient-to-r from-teal-700 to-emerald-700 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            人生の転機をスムーズに
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className={`${titleFontWeight} text-foreground text-balance mb-8 animate-slide-up leading-[1.1] tracking-tight`}>
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
                            {title}
                        </span>
                        <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x">
                            {highlightText}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 dark:text-foreground/90 text-balance max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up font-light" style={{ animationDelay: '0.1s' }}>
                        {description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={handleButtonClick}
                            className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-lg font-bold shadow-2xl shadow-teal-500/50 hover:shadow-3xl hover:shadow-teal-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-2">
                                {buttonText}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </button>

                        {secondaryButtonText && (
                            <button
                                onClick={handleSecondaryButtonClick}
                                className="px-8 py-5 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border-2 border-white/30 dark:border-white/10 text-lg font-bold hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                {secondaryButtonText}
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    {showStats && stats.length > 0 && (
                        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="group p-6 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm md:text-base text-foreground/70 dark:text-foreground/80 font-medium">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
