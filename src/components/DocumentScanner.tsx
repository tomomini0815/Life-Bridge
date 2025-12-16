import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, ScanLine, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OCRService, ExtractedData } from '@/services/OCRService';

interface DocumentScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete: (data: ExtractedData) => void;
}

export function DocumentScanner({ isOpen, onClose, onScanComplete }: DocumentScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [scanStep, setScanStep] = useState<'camera' | 'processing' | 'success'>('camera');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, capturedImage]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const imageSrc = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageSrc);
            setScanStep('processing');
            processImage(imageSrc);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCapturedImage(result);
                setScanStep('processing');
                processImage(result, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async (imageSrc: string, file?: File) => {
        setIsScanning(true);

        // Convert base64 to File if not provided
        const imageFile = file || await (await fetch(imageSrc)).blob().then(blob => new File([blob], "capture.jpg", { type: "image/jpeg" }));

        try {
            const result = await OCRService.scanDocument(imageFile);
            setIsScanning(false);
            setScanStep('success');

            // Wait a bit to show success state before closing/completing
            setTimeout(() => {
                onScanComplete(result);
                handleClose();
            }, 1500);
        } catch (error) {
            console.error("Scanning failed", error);
            setIsScanning(false);
            // Handle error state here
        }
    };

    const handleClose = () => {
        stopCamera();
        setCapturedImage(null);
        setScanStep('camera');
        onClose();
    };

    const handleReset = () => {
        setCapturedImage(null);
        setScanStep('camera');
        startCamera();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-transparent rounded-3xl overflow-hidden shadow-2xl mx-4">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Camera View / Image Preview */}
                <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-white/10">

                    {capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Scanning Overlay UI */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Guide Corners */}
                        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/50 rounded-tl-3xl opacity-80" />
                        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/50 rounded-tr-3xl opacity-80" />
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/50 rounded-bl-3xl opacity-80" />
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/50 rounded-br-3xl opacity-80" />

                        {/* Scanning Beam Animation */}
                        {(scanStep === 'camera' || scanStep === 'processing') && (
                            <div className={cn(
                                "absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]",
                                scanStep === 'camera' ? "animate-[scan_3s_ease-in-out_infinite] opacity-50" : "animate-[scan_1s_linear_infinite] opacity-100 top-1/2"
                            )} />
                        )}

                        {/* Processing Overlay */}
                        {scanStep === 'processing' && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4" />
                                <p className="text-white font-bold text-lg animate-pulse">AI解析中...</p>
                                <p className="text-white/70 text-sm mt-2">文字情報を読み取っています</p>
                            </div>
                        )}

                        {/* Success Overlay */}
                        {scanStep === 'success' && (
                            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center animate-fade-in">
                                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 mb-4 animate-[scale-in_0.3s_ease-out]">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <p className="text-white font-bold text-2xl drop-shadow-md">スキャン完了！</p>
                                <p className="text-white/90 text-sm mt-2">データを自動入力します</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20">
                    <div className="flex items-center justify-between gap-6">
                        {/* File Upload Trigger */}
                        <div className="flex flex-col items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={scanStep !== 'camera'}
                            >
                                <Upload className="w-5 h-5" />
                            </Button>
                            <span className="text-xs text-white/70">写真を選択</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>

                        {/* Shutter Button */}
                        <div className="relative">
                            <button
                                onClick={handleCapture}
                                disabled={scanStep !== 'camera'}
                                className={cn(
                                    "w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200",
                                    scanStep !== 'camera' ? "opacity-50 scale-90 cursor-not-allowed" : "hover:scale-105 active:scale-95 shadow-lg shadow-white/20"
                                )}
                            >
                                <div className="w-16 h-16 rounded-full bg-white block" />
                            </button>
                        </div>

                        {/* Reset / Flash (Placeholder for Reset) */}
                        <div className="flex flex-col items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                                onClick={handleReset}
                                disabled={!capturedImage || scanStep === 'processing' || scanStep === 'success'}
                            >
                                <RotateCcw className="w-5 h-5" />
                            </Button>
                            <span className="text-xs text-white/70">撮り直し</span>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-white/50">
                            書類を枠内に合わせてください
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          50% { top: 90%; }
        }
      `}</style>
        </div>
    );
}
