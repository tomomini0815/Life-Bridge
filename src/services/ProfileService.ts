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
        return 'lifebridge_guest_profile';
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

        // If logged in but cache empty (e.g. first load before fetch completes), return default
        // The fetch logic in setUserId will eventually populate it.
        // If guest, use local storage.
        if (this.currentUserId) {
            return DEFAULT_PROFILE;
        }

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
            this.profileCache = { ...DEFAULT_PROFILE };
        }

        return this.profileCache!;
    }

    async updateProfile(data: Partial<UserProfile>) {
        const current = this.getProfile();
        const updated = { ...current, ...data };
        this.profileCache = updated;
        this.notifySubscribers(updated);

        if (this.currentUserId) {
            try {
                // Upsert to Supabase
                // We assume a 'profiles' table exists. 
                // Since we don't know the exact schema, we'll try to save to a JSONB column 'profile_data'
                // We'll also try to save key fields if possible, but for now just the JSON blob for flexibility.
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: this.currentUserId,
                        profile_data: updated,
                        updated_at: new Date().toISOString(),
                    });

                if (error) {
                    // Fallback: If 'profile_data' column doesn't exist, this will fail.
                    // As a backup strategy for this specific app's potential schema:
                    // The user might not have migrated DB yet.
                    console.error('Failed to save profile to Supabase:', error);
                }
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        } else {
            // Guest mode
            const key = this.getStorageKey();
            localStorage.setItem(key, JSON.stringify(updated));
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
