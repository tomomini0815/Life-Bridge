export interface UserProfile {
    name?: string;
    annualIncome: number;
    employmentStatus: string[]; // ['employed', 'sole_proprietor', 'corporation', 'unemployed']
    hasSpouse: boolean;
    spouseIncome?: number;
    numberOfChildren: number;
    childrenAges: number[];
    isPregnant?: boolean;
    isTakingMaternityLeave?: boolean;
    isTakingPaternityLeave?: boolean;
    // Entrepreneur specific fields
    // corporateType?: 'individual' | 'corporation'; // Deprecated, merged into employmentStatus
    businessStartDate?: string;
    hasBlueTaxReturn?: boolean;
    isSmallBusinessMutualAidJoined?: boolean;
}

export interface BenefitResult {
    id: string;
    name: string;
    amount: number;
    frequency: 'once' | 'monthly' | 'yearly';
    totalAmount: number; // Total over applicable period
    eligibility: boolean;
    reason?: string; // Why eligible or not
    applicationDeadline?: string;
    requiredDocuments?: string[];
}

export interface SimulationResult {
    profile: UserProfile;
    benefits: BenefitResult[];
    totalBenefits: number;
    monthlyBenefits: number;
    yearlyBenefits: number;
    oneTimeBenefits: number;
}

export type BenefitCategory = 'birth' | 'childcare' | 'employment' | 'care' | 'housing';
