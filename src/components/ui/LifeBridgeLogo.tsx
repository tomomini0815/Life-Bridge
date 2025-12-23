export function LifeBridgeLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <img
            src="/lb-logo.png"
            alt="LifeBridge Logo"
            className={`${className} rounded-lg shadow-lg flex-shrink-0`}
            style={{
                objectFit: 'contain',
                aspectRatio: '1 / 1',
            }}
        />
    );
}
