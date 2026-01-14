import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';

// Helper to translate Supabase errors
const getErrorMessage = (error: any) => {
    const message = error.message.toLowerCase();
    if (message.includes('email not confirmed')) {
        return 'メールアドレスの確認が完了していません。\n登録時に入力したメールアドレスに届いている確認メール内のリンクをクリックしてください。';
    }
    if (message.includes('invalid login credentials')) {
        return 'メールアドレスまたはパスワードが間違っています。';
    }
    return '予期せぬエラーが発生しました。もう一度お試しください。';
};

export function LoginPage() {
    const { signInWithGoogle, signInWithEmail, resendVerificationEmail, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showResend, setShowResend] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // Redirect handled by OAuth
        } catch (error) {
            console.error(error);
            toast.error('Googleログインに失敗しました');
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
        setShowResend(false);
        try {
            await signInWithEmail(email, password);
            toast.success("ログインしました");
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            const errorMessage = getErrorMessage(error);
            toast.error('ログインに失敗しました', {
                description: errorMessage,
                duration: 5000,
            });
            if (error.message.toLowerCase().includes('email not confirmed')) {
                setShowResend(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            await resendVerificationEmail(email);
            toast.success('確認メールを再送信しました', {
                description: 'メールボックスを確認してください。迷惑メールフォルダもご確認ください。',
            });
            setShowResend(false);
        } catch (error) {
            console.error(error);
            toast.error('メールの再送信に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4">
            <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center mb-4">
                        <LifeBridgeLogo className="w-16 h-16 shadow-xl shadow-teal-500/20" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
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
                                またはメールアドレスでログイン
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@lifebridge.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "ログイン"}
                        </Button>

                        {showResend && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-800"
                                onClick={handleResendEmail}
                                disabled={isLoading}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                確認メールを再送信する
                            </Button>
                        )}
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">アカウントをお持ちでないですか？ </span>
                        <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                            新規登録
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
