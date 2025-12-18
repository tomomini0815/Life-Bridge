import { UserProfile } from '@/types/benefit';

const PROFILE_KEY = 'lifebridge_user_profile_v2';

const DEFAULT_PROFILE: UserProfile = {
    name: 'Tomomi',
    annualIncome: 5000000,
    employmentStatus: 'employed',
    hasSpouse: false,
    numberOfChildren: 0,
    childrenAges: []
};

export const profileService = {
    getProfile(): UserProfile {
        const stored = localStorage.getItem(PROFILE_KEY);
        if (stored) {
            try {
                return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Failed to parse profile:', e);
            }
        }
        return DEFAULT_PROFILE;
    },

    updateProfile(data: Partial<UserProfile>) {
        const current = this.getProfile();
        const updated = { ...current, ...data };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

        // Dispatch event for components to listen
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updated }));
        return updated;
    },

    // Subscribe to changes
    subscribe(callback: (profile: UserProfile) => void) {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<UserProfile>;
            callback(customEvent.detail);
        };
        window.addEventListener('userProfileUpdated', handler);
        return () => window.removeEventListener('userProfileUpdated', handler);
    }
};
