import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';

// Helper to translate Supabase errors
const getErrorMessage = (error: any) => {
    const message = error.message.toLowerCase();
    if (message.includes('user already registered')) {
        return 'このメールアドレスは既に登録されています。\nログイン画面からログインしてください。';
    }
    if (message.includes('password should be at least')) {
        return 'パスワードは6文字以上で設定してください。';
    }
    if (message.includes('invalid email')) {
        return '正しいメールアドレスを入力してください。';
    }
    return '登録中にエラーが発生しました。しばらく経ってから再度お試しください。';
};

export function SignupPage() {
    const { signInWithGoogle, signUp, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        } catch (error) {
            console.error(error);
            toast.error('Googleログインに失敗しました');
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
        try {
            await signUp(email, password);
            toast.success("登録完了！ログインしました。", {
                description: "ダッシュボードへ移動します"
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error('登録に失敗しました', {
                description: getErrorMessage(error),
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4">
            <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center mb-4">
                        <LifeBridgeLogo className="w-16 h-16 shadow-xl shadow-teal-500/20" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground">
                        LifeBridgeで新しい人生を始めましょう
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Googleで登録
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
                                またはメールアドレスで登録
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
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
                                placeholder="8文字以上"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                            アカウント作成
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">既にアカウントをお持ちですか？ </span>
                        <Link to="/login" className="text-emerald-600 font-medium hover:underline">
                            ログイン
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
