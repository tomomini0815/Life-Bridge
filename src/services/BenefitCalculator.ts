import { UserProfile, BenefitResult, SimulationResult } from '@/types/benefit';

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
        };
    }

    // 児童手当 - Monthly per child, income-based
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
            };
        }

        // Income limits (simplified - actual limits vary by number of dependents)
        const incomeLimit = profile.hasSpouse ? 9600000 : 8330000;
        const totalIncome = profile.annualIncome + (profile.spouseIncome || 0);

        if (totalIncome > incomeLimit) {
            return {
                id: 'child-allowance',
                name: '児童手当',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: `所得制限により対象外です（所得限度額: ${incomeLimit.toLocaleString()}円）`,
            };
        }

        // Calculate monthly amount per child based on age
        let monthlyTotal = 0;
        profile.childrenAges.forEach((age) => {
            if (age < 3) {
                monthlyTotal += 15000; // 0-3歳: 15,000円
            } else if (age < 12) {
                monthlyTotal += 10000; // 3歳-小学生: 10,000円
            } else if (age < 15) {
                monthlyTotal += 10000; // 中学生: 10,000円
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
            reason: `${profile.numberOfChildren}人のお子様が対象です`,
            applicationDeadline: '出生から15日以内',
            requiredDocuments: ['認定請求書', '健康保険証のコピー', '所得証明書', '口座情報'],
        };
    }

    // 育児休業給付金 - Maternity/Paternity leave benefits
    static calculateParentalLeaveAllowance(profile: UserProfile): BenefitResult {
        if (profile.employmentStatus === 'unemployed') {
            return {
                id: 'parental-leave',
                name: '育児休業給付金',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '雇用保険に加入していません',
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
        };
    }

    // 雇用保険 (失業給付) - Unemployment benefits
    static calculateUnemploymentBenefit(profile: UserProfile): BenefitResult {
        if (profile.employmentStatus !== 'unemployed') {
            return {
                id: 'unemployment',
                name: '雇用保険（失業給付）',
                amount: 0,
                frequency: 'monthly',
                totalAmount: 0,
                eligibility: false,
                reason: '現在就業中です',
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
            };
        }

        // Estimate based on number of young children
        const youngChildren = profile.childrenAges.filter((age) => age < 6).length;
        if (youngChildren === 0) {
            return {
                id: 'child-medical',
                name: '乳幼児医療費助成',
                amount: 0,
                frequency: 'yearly',
                totalAmount: 0,
                eligibility: false,
                reason: '対象年齢の子供がいません（通常6歳未満）',
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
