import { UserProfile, BenefitResult } from '@/types/benefit';
import { BenefitCalculator } from '@/services/BenefitCalculator';
import { BenefitDetail } from '@/data/benefitDetails';
import { startupTasks } from '@/data/lifeEvents';

export interface RecommendationItem {
    id: string;
    title: string;
    description: string;
    type: 'benefit' | 'procedure' | 'task';
    urgency: 'high' | 'medium' | 'low';
    link?: string;
    actionLabel?: string;
    details?: BenefitDetail;
    requiredDocuments?: string[];
    category?: string;
}

export const recommendationService = {
    getRecommendations(profile: UserProfile): RecommendationItem[] {
        const recommendations: RecommendationItem[] = [];

        // 1. Benefit Recommendations
        const simulation = BenefitCalculator.simulate(profile);
        const eligibleBenefits = simulation.benefits.filter(b => b.eligibility);

        const BENEFIT_CATEGORY_MAP: Record<string, string> = {
            'birth-allowance': 'birth',
            'child-allowance': 'birth',
            'parental-leave': 'birth',
            'unemployment': 'job',
            'child-medical': 'birth',
        };

        eligibleBenefits.forEach(benefit => {
            // Customize message based on benefit type
            let urgency: 'high' | 'medium' | 'low' = 'medium';
            let description = benefit.reason || '受給資格がある可能性があります。';

            if (benefit.applicationDeadline) {
                urgency = 'high';
                description += ` 申請期限: ${benefit.applicationDeadline}`;
            }

            recommendations.push({
                id: `benefit-${benefit.id}`,
                title: `${benefit.name}の申請`,
                description: description,
                type: 'benefit',
                urgency: urgency,
                link: '/tools?tab=benefits', // Direct to simulator or specific page
                actionLabel: '詳細を確認',
                details: benefit.details,
                requiredDocuments: benefit.requiredDocuments,
                category: BENEFIT_CATEGORY_MAP[benefit.id]
            });
        });

        // 2. Profile-based Static Recommendations

        // If profile is incomplete (e.g. income is 0 or default), suggest updating it
        if (profile.annualIncome === 5000000 && profile.numberOfChildren === 0 && !profile.hasSpouse && profile.employmentStatus.includes('employed') && profile.employmentStatus.length === 1) {
            // Simple check for default values - might be improved
            recommendations.push({
                id: 'update-profile',
                title: 'プロフィールを完成させましょう',
                description: '正確な情報入力で、より最適な提案が可能になります。',
                type: 'task',
                urgency: 'low',
                link: '/settings',
                actionLabel: '設定へ'
            });
        }

        getAdvancedRecommendations(profile, recommendations);

        return recommendations;
    }
};

function getAdvancedRecommendations(profile: UserProfile, recommendations: RecommendationItem[]) {
    // Suggest Blue Tax Return for Individual Sole Proprietors
    if (profile.employmentStatus.includes('sole_proprietor') && !profile.hasBlueTaxReturn) {
        recommendations.push({
            id: 'blue-tax-return',
            title: '青色申告で節税',
            description: '最大65万円の控除が受けられます。開業届と青色申告承認申請書の提出が必要です。',
            type: 'procedure',
            urgency: 'medium',
            link: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/shinkoku/annai/1095.htm',
            actionLabel: '国税庁HPへ',
            category: 'startup'
        });
    }

    // Suggest Small Business Mutual Aid
    if ((profile.employmentStatus.includes('sole_proprietor') || profile.employmentStatus.includes('corporation')) && !profile.isSmallBusinessMutualAidJoined) {
        recommendations.push({
            id: 'small-business-mutual-aid',
            title: '小規模企業共済への加入',
            description: '掛金が全額所得控除になり、将来の退職金代わりにもなります。',
            type: 'procedure',
            urgency: 'low',
            link: 'https://www.smrj.go.jp/kyosai/skyosai/',
            actionLabel: '制度詳細へ',
            category: 'startup'
        });
    }

    // Suggest Incorporation for High Income Individuals
    if (profile.employmentStatus.includes('sole_proprietor') && !profile.employmentStatus.includes('corporation') && profile.annualIncome >= 8000000) {
        recommendations.push({
            id: 'incorporation',
            title: '法人化（法人成り）の検討',
            description: '年収が800万円を超えると、法人化することで節税メリットが出る可能性があります。',
            type: 'task',
            urgency: 'medium',
            link: '/tools?tab=startup',
            actionLabel: '会社設立ガイドへ',
            category: 'startup'
        });
    }

    // Suggest Business Startup for Unemployed
    if (profile.employmentStatus.includes('unemployed')) {
        recommendations.push({
            id: 'startup-guide',
            title: '起業・開業のすゝめ',
            description: 'あなたのスキルを活かして独立しませんか？開業手続きや支援制度をチェック。',
            type: 'task',
            urgency: 'low',
            link: '/tools?tab=startup',
            actionLabel: '起業ガイドへ',
            category: 'startup'
        });
    }

    // Suggest Side Job Tax Return (Employed + Sole Proprietor/Corp)
    if (profile.employmentStatus.includes('employed') && (profile.employmentStatus.includes('sole_proprietor') || profile.employmentStatus.includes('corporation'))) {
        recommendations.push({
            id: 'side-job-tax',
            title: '副業の確定申告準備',
            description: '会社員と事業主の両方の所得がある場合、確定申告が必要です。',
            type: 'task',
            urgency: 'medium',
            link: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm',
            actionLabel: '国税庁HPへ',
            category: 'startup'
        });
    }

    // Business Subsidies & Grants (Sole Proprietor / Corporation)
    if (profile.employmentStatus.includes('sole_proprietor') || profile.employmentStatus.includes('corporation')) {
        // Import startupTasks dynamically to avoid circular dependency issues if possible, or assume it's safe.
        // Since we are inside a function, we can rely on the imported module.
        // Note: We need to ensure startupTasks is imported at the top of the file.

        const businessBenefits = startupTasks.filter(task => task.category === 'benefit');

        businessBenefits.forEach(task => {
            recommendations.push({
                id: `subsidy-${task.id}`,
                title: task.title,
                description: task.description,
                type: 'benefit',
                urgency: task.priority === 'high' ? 'high' : 'medium',
                link: task.officialUrl || '/tools?tab=startup',
                actionLabel: task.officialUrl ? '公式サイトへ' : '詳細へ',
                requiredDocuments: task.requiredDocs,
                details: {
                    description: task.description,
                    calculation: `最大 ${(task.benefitAmount || 0).toLocaleString()} 円`,
                    requirements: '・事業計画書の作成が必要です\n・詳細は公募要領をご確認ください',
                    applicationSteps: `1. 公募要領の確認\n2. 必要書類（${task.requiredDocs?.join('、') || '事業計画書など'}）の準備\n3. ${task.submitTo}へ申請`,
                    officialLink: task.officialUrl
                },
                category: 'startup'
            });
        });
    }
}
