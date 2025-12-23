export function LifeBridgeLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <img
            src="/lb-logo.png"
            alt="LifeBridge Logo"
            className={`${className} shadow-lg`}
            style={{
                objectFit: 'cover',
            }}
        />
    );
}
