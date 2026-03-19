
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null } | any>;
    resendVerificationEmail: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUp: async () => ({ user: null, session: null }),
    resendVerificationEmail: async () => { },
    signOut: async () => { },
    signInAsGuest: () => { },
});

export const useAuth = () => useContext(AuthContext);

import { profileService } from '@/services/ProfileService';

// ... (imports remain the same)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            // Initialize profile service
            profileService.setUserId(session?.user?.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            // Update profile service
            profileService.setUserId(session?.user?.id ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
                queryParams: {
                    prompt: 'select_account',
                },
            },
        });
        if (error) throw error;
    };

    const signInWithEmail = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
        }
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
        }
        return data;
    };

    const resendVerificationEmail = async (email: string) => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) throw error;
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error during sign out:', error);
        } finally {
            setUser(null);
            setSession(null);
        }
    };

    const signInAsGuest = () => {
        const guestUser = {
            id: 'guest-user',
            email: 'guest@example.com',
            user_metadata: { full_name: 'ゲストユーザー' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
        } as User;

        setSession({
            user: guestUser,
            access_token: 'dummy',
            refresh_token: 'dummy',
            expires_in: 3600,
            token_type: 'bearer'
        } as Session);
        setUser(guestUser);
        setLoading(false);
        profileService.setUserId(guestUser.id);
        toast.info("デモモードでログインしました。一部の機能が制限される場合があります。");
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUp, resendVerificationEmail, signOut, signInAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}
