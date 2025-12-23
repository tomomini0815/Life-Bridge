export function LifeBridgeLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Bold "L" Shape with Modern Twist */}
            <path
                d="M 25 20 L 25 75 L 55 75"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="drop-shadow-lg"
            />

            {/* Bold "B" Shape Integrated as Forward Arrow */}
            <path
                d="M 55 35 L 75 35 Q 85 35, 85 45 Q 85 50, 80 52.5 Q 85 55, 85 60 Q 85 70, 75 70 L 55 70"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="drop-shadow-lg"
            />

            {/* Dynamic Arrow/Forward Motion Element */}
            <path
                d="M 70 50 L 90 50 M 85 45 L 90 50 L 85 55"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="drop-shadow-lg"
            />

            {/* Accent Dots for Energy */}
            <circle cx="30" cy="25" r="4" fill="white" className="animate-pulse-soft" />
            <circle cx="60" cy="40" r="4" fill="white" className="animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
            <circle cx="60" cy="65" r="4" fill="white" className="animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
        </svg>
    );
}
