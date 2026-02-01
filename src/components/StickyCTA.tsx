import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show only after scrolling down a bit (e.g., past the hero)
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-white/90 backdrop-blur-lg border border-emerald-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex-1">
                    <p className="text-xs font-bold text-emerald-600 mb-0.5">無料診断はこちら</p>
                    <p className="text-[10px] text-slate-500">3分で完了・登録不要</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-10 px-4">
                        <Download className="w-4 h-4 mr-1" />
                        <span className="text-xs font-bold">資料</span>
                    </Button>
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 h-10 px-5">
                        <span className="text-xs font-bold mr-1">今すぐ開始</span>
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
