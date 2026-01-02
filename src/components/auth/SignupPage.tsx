import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { LifeBridgeLogo } from '@/components/ui/LifeBridgeLogo';

export function SignupPage() {
    const { signUp, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
                description: error.message
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
                        <Chrome className="mr-2 h-5 w-5 text-red-500" />
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
                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                            アカウント作成
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">既にアカウントをお持ちですか？ </span>
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                            ログイン
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
