import { useState } from 'react';
import { X, Printer, Download, MapPin, Search, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PdfService } from '@/services/PdfService';
import { toast } from 'sonner';

interface KonbiniPrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskTitle: string;
}

export function KonbiniPrintModal({ isOpen, onClose, taskTitle }: KonbiniPrintModalProps) {
    const [step, setStep] = useState<'preview' | 'generating' | 'ready'>('preview');
    const [printNumber, setPrintNumber] = useState('');

    const handleGenerate = async () => {
        setStep('generating');

        // Simulate API call to register print job
        setTimeout(() => {
            // Generate random reservation code
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            setPrintNumber(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
            setStep('ready');
        }, 2000);
    };

    const handleDownload = async () => {
        try {
            const pdfBytes = await PdfService.generateApplicationPdf({});
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Application_${taskTitle}.pdf`;
            link.click();
            toast.success("PDFをダウンロードしました");
        } catch (error) {
            console.error(error);
            toast.error("PDF生成に失敗しました");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden relative border border-border/50">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white font-bold text-lg">
                        <Printer className="w-6 h-6" />
                        コンビニプリント予約
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'preview' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50">
                                <div className="w-12 h-16 bg-white shadow-sm border border-border flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{taskTitle} 申請書</h3>
                                    <p className="text-sm text-muted-foreground">自動入力済み・捺印不要</p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">
                                この申請書をコンビニのマルチコピー機で印刷するための予約番号を発行します。<br />
                                発行された番号をコンビニで入力するだけで印刷できます。
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleGenerate}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-emerald-500/20"
                                >
                                    予約番号を発行する
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDownload}
                                    className="h-12 w-12 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                    title="PDFを直接ダウンロード"
                                >
                                    <Download className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                            <div className="relative">
                                <Printer className="w-16 h-16 text-emerald-200" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                            <p className="font-bold text-lg animate-pulse">PDFを生成して予約中...</p>
                        </div>
                    )}

                    {step === 'ready' && (
                        <div className="space-y-8 animate-scale-in">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                                    <Check className="w-4 h-4" /> 予約完了 (有効期限: 7日間)
                                </div>
                                <h3 className="text-sm text-muted-foreground mb-2">ユーザー番号 / プリント予約番号</h3>
                                <div className="text-5xl font-mono font-bold tracking-wider text-foreground select-all bg-muted/30 py-4 rounded-2xl border border-border/50">
                                    {printNumber}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-muted-foreground">対応コンビニエンスストア</h4>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {['セブン-イレブン', 'ローソン', 'ファミリーマート'].map((store) => (
                                        <span key={store} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium whitespace-nowrap shadow-sm">
                                            {store}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11"
                                    onClick={() => window.open('https://www.google.com/maps/search/convenience+store', '_blank')}
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    近くのコンビニを探す
                                </Button>
                                <Button
                                    onClick={onClose}
                                    className="flex-1 bg-primary text-primary-foreground h-11"
                                >
                                    閉じる
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
