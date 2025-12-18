import { useState } from 'react';
import { UserProfile, SimulationResult } from '@/types/benefit';
import { BenefitCalculator } from '@/services/BenefitCalculator';
import { cn } from '@/lib/utils';
import {
    Calculator,
    TrendingUp,
    Users,
    Baby,
    Briefcase,
    DollarSign,
    ChevronRight,
    Info,
    Save,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profileService } from '@/services/ProfileService';
import { toast } from 'sonner';

export function BenefitSimulator() {
    const [profile, setProfile] = useState<UserProfile>(() => profileService.getProfile());

    const [result, setResult] = useState<SimulationResult | null>(null);
    const [showComparison, setShowComparison] = useState(false);

    const handleInputChange = (field: keyof UserProfile, value: any) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChildrenCountChange = (count: number) => {
        const ages = Array(count).fill(0);
        setProfile((prev) => ({
            ...prev,
            numberOfChildren: count,
            childrenAges: ages,
        }));
    };

    const handleChildAgeChange = (index: number, age: number) => {
        const newAges = [...profile.childrenAges];
        newAges[index] = age;
        setProfile((prev) => ({
            ...prev,
            childrenAges: newAges,
        }));
    };

    const handleCalculate = () => {
        const simulationResult = BenefitCalculator.simulate(profile);
        setResult(simulationResult);
    };

    const formatCurrency = (amount: number) => {
        return `¥${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="glass-medium rounded-3xl p-8 border border-border/50 shadow-soft">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                            <Calculator className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground font-display">給付金シミュレーター</h1>
                            <p className="text-muted-foreground">あなたが受け取れる給付金を試算</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setProfile(profileService.getProfile());
                                toast.info('プロフィール設定を読み込みました');
                            }}
                            className="gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            リセット
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                profileService.updateProfile(profile);
                                toast.success('この条件をプロフィールに保存しました');
                            }}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            プロフィールに保存
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="space-y-6">
                    <div className="glass-medium rounded-3xl p-6 border border-border/50 shadow-soft">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            基本情報
                        </h2>

                        <div className="space-y-4">
                            {/* Annual Income */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    年収（税込）
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={profile.annualIncome}
                                        onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        placeholder="5000000"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        円
                                    </span>
                                </div>
                            </div>

                            {/* Employment Status */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    雇用形態（複数選択可）
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'employed', label: '会社員' },
                                        { id: 'sole_proprietor', label: '個人事業主' },
                                        { id: 'corporation', label: '法人' },
                                        { id: 'unemployed', label: '無職' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                let newStatus: string[];
                                                if (type.id === 'unemployed') {
                                                    newStatus = ['unemployed'];
                                                } else {
                                                    let current = profile.employmentStatus.filter(s => s !== 'unemployed');
                                                    if (current.includes(type.id)) {
                                                        newStatus = current.filter(s => s !== type.id);
                                                    } else {
                                                        newStatus = [...current, type.id];
                                                    }
                                                }
                                                handleInputChange('employmentStatus', newStatus);
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                                profile.employmentStatus.includes(type.id)
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            )}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Spouse */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={profile.hasSpouse}
                                        onChange={(e) => handleInputChange('hasSpouse', e.target.checked)}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
                                    />
                                    <span className="text-sm font-medium">配偶者あり</span>
                                </label>
                            </div>

                            {/* Spouse Income */}
                            {profile.hasSpouse && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        配偶者の年収（税込）
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={profile.spouseIncome || 0}
                                            onChange={(e) => handleInputChange('spouseIncome', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            円
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Children Info */}
                    <div className="glass-medium rounded-3xl p-6 border border-border/50 shadow-soft">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Baby className="w-5 h-5 text-primary" />
                            お子様の情報
                        </h2>

                        <div className="space-y-4">
                            {/* Number of Children */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    お子様の人数
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={profile.numberOfChildren}
                                    onChange={(e) => handleChildrenCountChange(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            {/* Children Ages */}
                            {profile.numberOfChildren > 0 && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        お子様の年齢
                                    </label>
                                    {profile.childrenAges.map((age, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground w-16">
                                                {index + 1}人目:
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="18"
                                                value={age}
                                                onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value) || 0)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                            <span className="text-sm text-muted-foreground">歳</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pregnancy & Leave Status */}
                            <div className="space-y-2 pt-2 border-t border-border/50">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={profile.isPregnant || false}
                                        onChange={(e) => handleInputChange('isPregnant', e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                                    />
                                    <span className="text-sm">妊娠中</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={profile.isTakingMaternityLeave || false}
                                        onChange={(e) => handleInputChange('isTakingMaternityLeave', e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                                    />
                                    <span className="text-sm">育児休業中（母親）</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={profile.isTakingPaternityLeave || false}
                                        onChange={(e) => handleInputChange('isTakingPaternityLeave', e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                                    />
                                    <span className="text-sm">育児休業中（父親）</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleCalculate}
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-lg font-bold"
                        size="lg"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        給付金を計算する
                    </Button>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    {result ? (
                        <>
                            {/* Summary Card */}
                            <div className="glass-medium rounded-3xl p-8 border-2 border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">試算結果</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20">
                                        <p className="text-sm text-muted-foreground mb-1">総受給可能額</p>
                                        <p className="text-4xl font-bold text-green-600">
                                            {formatCurrency(result.totalBenefits)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
                                            <p className="text-xs text-muted-foreground mb-1">一時金</p>
                                            <p className="text-lg font-bold text-foreground">
                                                {formatCurrency(result.oneTimeBenefits)}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
                                            <p className="text-xs text-muted-foreground mb-1">月額</p>
                                            <p className="text-lg font-bold text-foreground">
                                                {formatCurrency(result.monthlyBenefits)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits List */}
                            <div className="glass-medium rounded-3xl p-6 border border-border/50 shadow-soft">
                                <h3 className="text-lg font-bold mb-4">給付金の内訳</h3>
                                <div className="space-y-3">
                                    {result.benefits.map((benefit) => (
                                        <div
                                            key={benefit.id}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all",
                                                benefit.eligibility
                                                    ? "bg-green-50/50 dark:bg-green-900/10 border-green-200/50"
                                                    : "bg-muted/30 border-border/50 opacity-60"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-bold text-sm">{benefit.name}</h4>
                                                {benefit.eligibility && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 font-medium">
                                                        対象
                                                    </span>
                                                )}
                                            </div>

                                            {benefit.eligibility ? (
                                                <>
                                                    <p className="text-2xl font-bold text-green-600 mb-2">
                                                        {formatCurrency(benefit.totalAmount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        {benefit.reason}
                                                    </p>
                                                    {benefit.applicationDeadline && (
                                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                                            <Info className="w-3 h-3" />
                                                            申請期限: {benefit.applicationDeadline}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">
                                                    {benefit.reason}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-light rounded-3xl p-12 border-2 border-dashed border-border/50 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                <Calculator className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                情報を入力してください
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                左側のフォームに情報を入力し、<br />
                                「給付金を計算する」ボタンをクリックしてください
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
