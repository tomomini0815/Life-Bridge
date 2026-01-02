
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function LoginPage() {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // Redirect is handled by Supabase OAuth flow
        } catch (error) {
            console.error(error);
            toast.error('Googleログインに失敗しました');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4">
            <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30">
                        <span className="text-3xl">🌉</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        LifeBridge
                    </h1>
                    <p className="text-muted-foreground">
                        人生の転機に寄り添うAIパートナー
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 relative overflow-hidden group transition-all"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Chrome className="mr-2 h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                        )}
                        Googleでログイン
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
                                または
                            </span>
                        </div>
                    </div>

                    {/* Placeholder for Email Login - Phase 2 */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>現在、Googleアカウントでのログインを推奨しています。</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
