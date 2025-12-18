import { UserProfile, BenefitResult, SimulationResult } from '@/types/benefit';
import { BENEFIT_DETAILS } from '@/data/benefitDetails';

export class BenefitCalculator {
    // 出産育児一時金 - Fixed amount
    static calculateBirthAllowance(profile: UserProfile): BenefitResult {
        const eligible = profile.isPregnant || profile.numberOfChildren > 0;

        return {
            id: 'birth-allowance',
            name: '出産育児一時金',
            amount: 500000,
            frequency: 'once',
            totalAmount: 500000,
            eligibility: eligible,
            reason: eligible ? '出産時に支給されます' : '出産予定がありません',
            applicationDeadline: '出産から2年以内',
            requiredDocuments: ['出産育児一時金支給申請書', '母子健康手帳', '領収書'],
            details: BENEFIT_DETAILS['birth-allowance']
        };
    }

    // 児童手当 - Monthly per child
    static calculateChildAllowance(profile: UserProfile): BenefitResult {
        if (profile.numberOfChildren === 0) {
            return {
                id: 'child-allowance',
                name: '児童手当',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '対象となる子供がいません',
                details: BENEFIT_DETAILS['child-allowance']
            };
        }

        // Oct 2024 Update: Income limits removed.
        // Amounts: 0-3yo: 15k, 3yo-Hs: 10k (3rd+ child: 30k)

        let monthlyTotal = 0;
        // Count children to identify 3rd+ child (simplified logic assuming ages sorted or just index based count logic needed)
        // Ideally we need to sort children by age to correctly identify "3rd child".
        // For this simulation, we'll assume the input order or just apply simple count.
        // Current logic in input: just ages array.
        // Rule: Count 1st, 2nd, 3rd child among those < 22yo (student).
        // Since we only track under 18 mainly, we'll just treat all input children as countable.

        profile.childrenAges.forEach((age, index) => {
            const isThirdOrLater = index >= 2; // Simple assumption: array is list of all children

            // 3rd child or later gets 30,000 yen (0yo - HS)
            if (isThirdOrLater) {
                monthlyTotal += 30000;
            } else {
                if (age < 3) {
                    monthlyTotal += 15000; // 0-3歳: 15,000円
                } else {
                    monthlyTotal += 10000; // 3歳-高校生: 10,000円
                }
            }
        });

        const yearlyTotal = monthlyTotal * 12;

        return {
            id: 'child-allowance',
            name: '児童手当',
            amount: monthlyTotal,
            frequency: 'monthly',
            totalAmount: yearlyTotal,
            eligibility: true,
            reason: `${profile.numberOfChildren}人のお子様が対象です（2024年10月制度改正対応）`,
            applicationDeadline: '出生から15日以内',
            requiredDocuments: ['認定請求書', '健康保険証のコピー', '口座情報'],
            details: BENEFIT_DETAILS['child-allowance']
        };
    }

    // 育児休業給付金 - Maternity/Paternity leave benefits
    static calculateParentalLeaveAllowance(profile: UserProfile): BenefitResult {
        // Must be employed to get leave benefits
        if (!profile.employmentStatus.includes('employed')) {
            return {
                id: 'parental-leave',
                name: '育児休業給付金',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '雇用保険に加入していません',
                details: BENEFIT_DETAILS['parental-leave']
            };
        }

        if (!profile.isTakingMaternityLeave && !profile.isTakingPaternityLeave) {
            return {
                id: 'parental-leave',
                name: '育児休業給付金',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '育児休業を取得していません',
                details: BENEFIT_DETAILS['parental-leave']
            };
        }

        // Calculate based on income (simplified)
        // Actual calculation uses last 6 months average salary
        const monthlySalary = profile.annualIncome / 12;

        // First 6 months: 67% of salary
        const first6Months = monthlySalary * 0.67 * 6;
        // Next 6 months: 50% of salary
        const next6Months = monthlySalary * 0.5 * 6;

        const totalAmount = first6Months + next6Months;
        const monthlyAverage = totalAmount / 12;

        return {
            id: 'parental-leave',
            name: '育児休業給付金',
            amount: monthlyAverage,
            frequency: 'monthly',
            totalAmount: totalAmount,
            eligibility: true,
            reason: '育休中に給与の67%（6ヶ月後は50%）が支給されます',
            applicationDeadline: '育休開始から4ヶ月以内',
            requiredDocuments: ['育児休業給付金支給申請書', '賃金台帳', '出勤簿'],
            details: BENEFIT_DETAILS['parental-leave']
        };
    }

    // 雇用保険 (失業給付) - Unemployment benefits
    static calculateUnemploymentBenefit(profile: UserProfile): BenefitResult {
        if (!profile.employmentStatus.includes('unemployed')) {
            return {
                id: 'unemployment',
                name: '雇用保険（失業給付）',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '現在就業中です',
                details: BENEFIT_DETAILS['unemployment']
            };
        }

        // Simplified calculation: 50-80% of previous salary for 90-330 days
        // Assuming 3 months (90 days) at 60% of previous salary
        const monthlySalary = profile.annualIncome / 12;
        const dailyBenefit = (monthlySalary / 30) * 0.6;
        const totalDays = 90; // Simplified
        const totalAmount = dailyBenefit * totalDays;

        return {
            id: 'unemployment',
            name: '雇用保険（失業給付）',
            amount: dailyBenefit * 30,
            frequency: 'monthly',
            totalAmount: totalAmount,
            eligibility: true,
            reason: '失業給付を受けられます（最大90日間）',
            applicationDeadline: '退職後すぐ',
            requiredDocuments: ['離職票', '本人確認書類', '写真2枚', '口座情報'],
            details: BENEFIT_DETAILS['unemployment']
        };
    }

    // 乳幼児医療費助成 - Child medical expense subsidy
    static calculateChildMedicalSubsidy(profile: UserProfile): BenefitResult {
        if (profile.numberOfChildren === 0) {
            return {
                id: 'child-medical',
                name: '乳幼児医療費助成',
                amount: 0,
                frequency: 'yearly',
                totalAmount: 0,
                eligibility: false,
                reason: '対象となる子供がいません',
                details: BENEFIT_DETAILS['child-medical']
            };
        }

        // Estimate based on number of young children
        const youngChildren = profile.childrenAges.filter((age) => age < 18).length; // Expanded to 18 based on trends
        if (youngChildren === 0) {
            return {
                id: 'child-medical',
                name: '乳幼児医療費助成',
                amount: 0,
                frequency: 'yearly',
                totalAmount: 0,
                eligibility: false,
                reason: '対象年齢の子供がいません',
                details: BENEFIT_DETAILS['child-medical']
            };
        }

        // Estimated annual savings (varies by municipality)
        const annualSavings = youngChildren * 30000;

        return {
            id: 'child-medical',
            name: '乳幼児医療費助成',
            amount: annualSavings,
            frequency: 'yearly',
            totalAmount: annualSavings,
            eligibility: true,
            reason: `${youngChildren}人のお子様の医療費が助成されます`,
            requiredDocuments: ['申請書', '健康保険証', 'マイナンバーカード'],
            details: BENEFIT_DETAILS['child-medical']
        };
    }

    // Main simulation method
    static simulate(profile: UserProfile): SimulationResult {
        const benefits: BenefitResult[] = [
            this.calculateBirthAllowance(profile),
            this.calculateChildAllowance(profile),
            this.calculateParentalLeaveAllowance(profile),
            this.calculateUnemploymentBenefit(profile),
            this.calculateChildMedicalSubsidy(profile),
        ];

        // Filter only eligible benefits
        const eligibleBenefits = benefits.filter((b) => b.eligibility);

        // Calculate totals
        const oneTimeBenefits = eligibleBenefits
            .filter((b) => b.frequency === 'once')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const monthlyBenefits = eligibleBenefits
            .filter((b) => b.frequency === 'monthly')
            .reduce((sum, b) => sum + b.amount, 0);

        const yearlyBenefits = eligibleBenefits
            .filter((b) => b.frequency === 'yearly')
            .reduce((sum, b) => sum + b.amount, 0);

        const totalBenefits = oneTimeBenefits + (monthlyBenefits * 12) + yearlyBenefits;

        return {
            profile,
            benefits,
            totalBenefits,
            monthlyBenefits,
            yearlyBenefits,
            oneTimeBenefits,
        };
    }

    // Compare two scenarios
    static compare(profile1: UserProfile, profile2: UserProfile): {
        scenario1: SimulationResult;
        scenario2: SimulationResult;
        difference: number;
    } {
        const scenario1 = this.simulate(profile1);
        const scenario2 = this.simulate(profile2);
        const difference = scenario2.totalBenefits - scenario1.totalBenefits;

        return {
            scenario1,
            scenario2,
            difference,
        };
    }
}
