import { Shield, Lock, Award, Building2, CheckCircle2 } from 'lucide-react';

// --- Trust Marquee Component ---
// --- Trust Marquee Component ---
export function TrustMarquee() {
    // 6 Major Life Events & Content
    const events = [
        { label: "結婚", detail: "氏名変更・口座名義・扶養手続き・パスポート更新", icon: Award },
        { label: "出産", detail: "出生届・児童手当・出産育児一時金・健康保険加入", icon: Shield },
        { label: "引越し", detail: "転出転入届・マイナンバー住所変更・ライフライン", icon: Building2 },
        { label: "就職・転職", detail: "年金切り替え・確定申告・住民税納付・保険証返却", icon: Lock },
        { label: "起業", detail: "開業届・青色申告承認申請・法人登記・事業用口座", icon: Building2 },
        { label: "介護", detail: "介護認定申請・ケアプラン作成・負担限度額認定", icon: CheckCircle2 },
    ];

    return (
        <section className="py-3 bg-emerald-900 border-t border-emerald-800 overflow-hidden">
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-12">
                    {/* Duplicate list for seamless loop */}
                    {[...events, ...events, ...events].map((event, i) => (
                        <div key={i} className="flex items-center gap-4 text-emerald-100/90 font-medium text-lg">
                            <span className="px-3 py-1 bg-emerald-800 rounded text-emerald-300 font-bold text-sm tracking-wider border border-emerald-700/50">
                                {event.label}
                            </span>
                            <span className="font-['Zen_Old_Mincho'] tracking-wide opacity-90">
                                {event.detail}
                            </span>
                            <span className="text-emerald-700 mx-4">/</span>
                        </div>
                    ))}
                </div>

                {/* Fade masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-emerald-900 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-emerald-900 to-transparent pointer-events-none" />
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
            `}</style>
        </section>
    );
}

// --- Security Badges Component ---
export function SecurityBadges() {
    return (
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 opacity-80 scale-90 md:scale-100 origin-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 text-xs font-bold">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 text-xs font-bold">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>APPI Compliant</span>
            </div>
        </div>
    );
}
