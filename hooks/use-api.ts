import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, Order, Referral, ReferralReward } from '@/lib/supabase';

// Hook for user management with API calls
export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          // Database not configured - return mock user
          const mockUser: User = {
            id: userData.id || 'mock-user-id',
            email: userData.email || '',
            name: userData.name || '',
            mobile_number: userData.mobile_number,
            referral_code: userData.referral_code || 'MOCK1234',
            referred_by: userData.referred_by,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(mockUser);
          return mockUser;
        }
        throw new Error(data.error || 'Failed to create user');
      }
      
      setUser(data);
      
      toast({
        title: 'Success',
        description: 'Profile created successfully',
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...updates }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          // Database not configured - return mock updated user
          const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() } as User;
          setUser(updatedUser);
          return updatedUser;
        }
        throw new Error(data.error || 'Failed to update user');
      }
      
      setUser(data);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          // Database not configured - return null without error
          setUser(null);
          return null;
        }
        throw new Error(data.error || 'Failed to fetch user');
      }
      
      setUser(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    createUser,
    updateUser,
    fetchUser,
  };
};

// Hook for order management with API calls
export const useOrders = (userId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      setOrders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          toast({
            title: 'Feature Unavailable',
            description: 'Order creation requires database configuration',
            variant: 'destructive',
          });
          return null;
        }
        throw new Error(data.error || 'Failed to create order');
      }
      
      setOrders(prev => [data, ...prev]);
      
      toast({
        title: 'Order Created',
        description: `Order ${data.order_number} has been placed successfully`,
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      
      toast({
        title: 'Order Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders,
  };
};

// Hook for referral management with API calls
export const useReferrals = (userId?: string) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReferrals = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/referrals?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch referrals');
      }
      
      setReferrals(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referrals';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/rewards?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (response.ok) {
        setRewards(data || []);
      }
    } catch (err) {
      // Silent fail for rewards as it's not critical
      console.warn('Failed to fetch rewards:', err);
    }
  };

  const createReferral = async (referralData: Partial<Referral>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'apply_referral', ...referralData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 503) {
          toast({
            title: 'Feature Unavailable',
            description: 'Referral system requires database configuration',
            variant: 'destructive',
          });
          return null;
        }
        throw new Error(data.error || 'Failed to create referral');
      }
      
      setReferrals(prev => [data.referral, ...prev]);
      
      toast({
        title: 'Referral Created',
        description: 'Your referral has been registered successfully',
      });
      
      return data.referral;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create referral';
      setError(errorMessage);
      
      toast({
        title: 'Referral Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReferrals();
      fetchRewards();
    }
  }, [userId]);

  return {
    referrals,
    rewards,
    loading,
    error,
    createReferral,
    refetch: () => {
      fetchReferrals();
      fetchRewards();
    },
  };
};