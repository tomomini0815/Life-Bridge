import { UserProfile } from '@/types/benefit';

const BASE_PROFILE_KEY = 'lifebridge_profile_';

const DEFAULT_PROFILE: UserProfile = {
    name: '',
    annualIncome: 0,
    employmentStatus: ['employed'],
    hasSpouse: false,
    numberOfChildren: 0,
    childrenAges: []
};

class ProfileService {
    private static instance: ProfileService;
    private currentUserId: string | null = null;
    private profileCache: UserProfile | null = null;

    private constructor() { }

    static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    setUserId(userId: string | null) {
        if (this.currentUserId === userId) return;
        this.currentUserId = userId;
        this.profileCache = null; // Clear cache on user change

        // Notify change immediately so UI updates
        const profile = this.getProfile();
        this.notifySubscribers(profile);
    }

    private getStorageKey(): string {
        if (!this.currentUserId) return 'lifebridge_guest_profile';
        return `${BASE_PROFILE_KEY}${this.currentUserId}`;
    }

    getProfile(): UserProfile {
        if (this.profileCache) return this.profileCache;

        const key = this.getStorageKey();
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                this.profileCache = { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Failed to parse profile:', e);
                this.profileCache = { ...DEFAULT_PROFILE };
            }
        } else {
            // Try to migrate from old key if it exists and hasn't been migrated
            // But only for the first logged in user? Or maybe just ignore old key to be safe.
            // Let's stick to fresh start for specific users to ensure isolation.
            this.profileCache = { ...DEFAULT_PROFILE };
        }

        return this.profileCache!;
    }

    updateProfile(data: Partial<UserProfile>) {
        const current = this.getProfile();
        const updated = { ...current, ...data };

        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(updated));

        this.profileCache = updated;
        this.notifySubscribers(updated);

        return updated;
    }

    private notifySubscribers(profile: UserProfile) {
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: profile }));
    }

    // Subscribe to changes
    subscribe(callback: (profile: UserProfile) => void) {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<UserProfile>;
            callback(customEvent.detail);
        };
        window.addEventListener('userProfileUpdated', handler);
        return () => window.removeEventListener('userProfileUpdated', handler);
    }
}

export const profileService = ProfileService.getInstance();
