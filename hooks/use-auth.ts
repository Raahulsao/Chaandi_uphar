import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  mobile_number?: string;
  referral_code: string;
  referred_by?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  statistics: {
    completedReferrals: number;
    totalEarnings: number;
    activeRewards: number;
  } | null;
}

interface RegisterData {
  email: string;
  name: string;
  mobileNumber?: string;
  referralCodeUsed?: string;
}

interface ReferralValidation {
  valid: boolean;
  referrer?: {
    name: string;
    email: string;
  };
  rewards?: {
    signupBonus: number;
    firstOrderDiscount: number;
    referrerReward: number;
  };
  message: string;
  error?: string;
  mockMode?: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    statistics: null,
  });
  const { toast } = useToast();

  // Firebase auth state listener
  useEffect(() => {
    if (!auth) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthState(prev => ({ ...prev, firebaseUser }));

      if (firebaseUser) {
        // User is signed in, sync with our database
        await handleUserLogin(firebaseUser);
      } else {
        // User is signed out
        setAuthState({
          user: null,
          firebaseUser: null,
          loading: false,
          statistics: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle user login and profile sync
  const handleUserLogin = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          statistics: data.statistics,
          loading: false,
        }));

        if (data.isNewUser) {
          toast({
            title: "Welcome to Chaandi Uphar!",
            description: "Your account has been set up successfully.",
          });
        }
      } else {
        console.error('Login API error:', data.error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error during user login sync:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  // Register new user (call this after Firebase createUserWithEmailAndPassword)
  const registerUser = useCallback(async (
    firebaseUser: FirebaseUser,
    additionalData: RegisterData
  ) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: additionalData.email,
          name: additionalData.name,
          mobileNumber: additionalData.mobileNumber,
          referralCodeUsed: additionalData.referralCodeUsed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          loading: false,
        }));

        toast({
          title: "Account Created Successfully!",
          description: data.message,
        });

        return { success: true, user: data.user, message: data.message };
      } else {
        toast({
          title: "Registration Error",
          description: data.error || "Failed to create account",
          variant: "destructive",
        });

        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      toast({
        title: "Registration Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: 'Network error' };
    }
  }, [toast]);

  // Validate referral code
  const validateReferralCode = useCallback(async (
    referralCode: string
  ): Promise<ReferralValidation> => {
    try {
      const response = await fetch('/api/auth/validate-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode }),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return {
          valid: false,
          message: data.error || 'Invalid referral code',
          error: data.error,
        };
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      return {
        valid: false,
        message: 'Unable to validate referral code. You can still create an account.',
        error: 'Network error',
      };
    }
  }, []);

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    if (authState.firebaseUser) {
      await handleUserLogin(authState.firebaseUser);
    }
  }, [authState.firebaseUser, handleUserLogin]);

  return {
    // State
    user: authState.user,
    firebaseUser: authState.firebaseUser,
    loading: authState.loading,
    statistics: authState.statistics,
    
    // Methods
    registerUser,
    validateReferralCode,
    refreshUserData,
    
    // Computed properties
    isAuthenticated: !!authState.firebaseUser,
    hasProfile: !!authState.user,
  };
}