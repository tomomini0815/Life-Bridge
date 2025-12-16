import { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MynaService } from '@/services/MynaService';

interface MynaPortalConnectProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: () => void;
}

export function MynaPortalConnect({ isOpen, onClose, onConnect }: MynaPortalConnectProps) {
    const [step, setStep] = useState<'intro' | 'scanning' | 'pin' | 'success'>('intro');
    const [pin, setPin] = useState(['', '', '', '']);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('intro');
            setPin(['', '', '', '']);
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handleStartScan = () => {
        setStep('scanning');

        // Simulate card detection after 2 seconds
        setTimeout(() => {
            setStep('pin');
        }, 2500);
    };

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }

        // If all filled, verify
        if (index === 3 && value) {
            verifyPin();
        }
    };

    const verifyPin = async () => {
        setIsProcessing(true);
        try {
            await MynaService.connect();
            setStep('success');
            setTimeout(() => {
                onConnect();
                onClose();
            }, 2000);
        } catch (e) {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Header with "Official" feel */}
                <div className="bg-pink-500 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-500">
                            🐰
                        </div>
                        マイナポータル連携
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'intro' && (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto">
                                <Smartphone className="w-12 h-12 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">マイナンバーカードの読み取り</h3>
                                <p className="text-muted-foreground text-sm">
                                    お手元のマイナンバーカードをスマートフォンの背面にかざしてください。
                                </p>
                            </div>
                            <Button
                                onClick={handleStartScan}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white h-12 rounded-xl text-lg font-bold shadow-lg shadow-pink-500/30"
                            >
                                読み取りを開始する
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 'scanning' && (
                        <div className="text-center space-y-8 animate-fade-in">
                            <div className="relative w-32 h-48 border-2 border-dashed border-pink-300 rounded-2xl mx-auto flex items-center justify-center bg-pink-50/50">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                                <Smartphone className="w-12 h-12 text-pink-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold animate-pulse">カードを読み取っています...</h3>
                                <p className="text-muted-foreground text-sm mt-2">
                                    カードを動かさないでください
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'pin' && (
                        <div className="text-center space-y-6 animate-fade-in">
                            <ShieldCheck className="w-12 h-12 text-pink-500 mx-auto" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">暗証番号の入力</h3>
                                <p className="text-muted-foreground text-sm">
                                    利用者証明用電子証明書の暗証番号（4桁）を入力してください。
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                {pin.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`pin-${i}`}
                                        type="password"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handlePinChange(i, e.target.value)}
                                        className="w-12 h-16 text-center text-3xl font-bold rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all bg-background"
                                        disabled={isProcessing}
                                    />
                                ))}
                            </div>

                            {isProcessing && (
                                <div className="flex items-center justify-center gap-2 text-pink-500 font-bold">
                                    <div className="w-4 h-4 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                                    認証中...
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6 animate-scale-in">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-green-600 mb-2">連携完了！</h3>
                                <p className="text-muted-foreground">
                                    マイナポータルとの連携が完了しました。<br />
                                    行政手続きをアプリから行えます。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes scan {
          0% { transform: translateY(-40%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(40%); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
