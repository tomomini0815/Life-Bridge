import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    delay?: number; // seconds
    threshold?: number;
}

export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    threshold = 0.1,
    style,
    ...props
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{
                ...style,
                animationDelay: `${delay}s`,
                animationFillMode: 'forwards',
            }}
            {...props}
        >
            {children}
        </div>
    );
}
