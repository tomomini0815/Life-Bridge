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

import { supabase } from '@/lib/supabase';

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

    async setUserId(userId: string | null) {
        if (this.currentUserId === userId) return;
        this.currentUserId = userId;
        this.profileCache = null; // Clear cache on user change

        // Fetch fresh profile from Supabase if logged in
        if (userId) {
            await this.fetchProfileFromSupabase(userId);
        }

        // Notify change immediately so UI updates
        const profile = this.getProfile();
        this.notifySubscribers(profile);
    }

    private getStorageKey(): string {
        return this.currentUserId ? `${BASE_PROFILE_KEY}${this.currentUserId}` : 'lifebridge_guest_profile';
    }

    private async fetchProfileFromSupabase(userId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('profile_data')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
                return;
            }

            if (data?.profile_data) {
                // Merge with default to ensure all fields exist
                this.profileCache = { ...DEFAULT_PROFILE, ...data.profile_data };
                this.notifySubscribers(this.profileCache!);
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        }
    }

    getProfile(): UserProfile {
        if (this.profileCache) return this.profileCache;

        // Try to load from localStorage as a fallback/immediate source
        const key = this.getStorageKey();
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                this.profileCache = { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
                return this.profileCache!;
            } catch (e) {
                console.error('Failed to parse profile:', e);
            }
        }

        // If no cache or storage, return default (fetchProfileFromSupabase will update later)
        return { ...DEFAULT_PROFILE };
    }

    async updateProfile(data: Partial<UserProfile>) {
        const current = this.getProfile();
        const updated = { ...current, ...data };
        this.profileCache = updated;
        this.notifySubscribers(updated);

        // Always save to localStorage as a primary backup/cache
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(updated));

        if (this.currentUserId) {
            try {
                // Upsert to Supabase
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: this.currentUserId,
                        profile_data: updated,
                        updated_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error('Failed to save profile to Supabase:', error);
                }
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        }

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
