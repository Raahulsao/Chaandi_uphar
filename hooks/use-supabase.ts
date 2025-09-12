'use client';

import { useState, useEffect } from 'react';
import { db, User, Order, Referral, ReferralReward, isSupabaseAvailable } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Hook for user management
export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createUser = async (userData: Partial<User>) => {
    if (!isSupabaseAvailable) {
      // Return mock user data when Supabase is not configured
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
    
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await db.users.create(userData);
      setUser(newUser);
      
      toast({
        title: 'Success',
        description: 'User profile created successfully',
      });
      
      return newUser;
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
    
    if (!isSupabaseAvailable) {
      // Return mock updated user when Supabase is not configured
      const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() } as User;
      setUser(updatedUser);
      return updatedUser;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await db.users.update(userId, updates);
      setUser(updatedUser);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      return updatedUser;
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
    if (!isSupabaseAvailable) {
      // Return null when Supabase is not configured
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = await db.users.findByEmail(email);
      setUser(userData);
      return userData;
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

// Hook for order management
export const useOrders = (userId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!userId) return;
    
    if (!isSupabaseAvailable) {
      // Return empty orders when Supabase is not configured
      setOrders([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userOrders = await db.orders.findByUserId(userId);
      setOrders(userOrders || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    if (!isSupabaseAvailable) {
      toast({
        title: 'Feature Unavailable',
        description: 'Order creation requires database configuration',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newOrder = await db.orders.create(orderData);
      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: 'Order Created',
        description: `Order ${newOrder.order_number} has been placed successfully`,
      });
      
      return newOrder;
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

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!isSupabaseAvailable) {
      toast({
        title: 'Feature Unavailable',
        description: 'Order updates require database configuration',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedOrder = await db.orders.updateStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      
      toast({
        title: 'Order Updated',
        description: `Order status updated to ${status}`,
      });
      
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      
      toast({
        title: 'Update Failed',
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
    updateOrderStatus,
    refetch: fetchOrders,
  };
};

// Hook for referral management
export const useReferrals = (userId?: string) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReferrals = async () => {
    if (!userId) return;
    
    if (!isSupabaseAvailable) {
      // Return empty referrals when Supabase is not configured
      setReferrals([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userReferrals = await db.referrals.findByUserId(userId);
      setReferrals(userReferrals || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referrals';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    if (!userId) return;
    
    if (!isSupabaseAvailable) {
      // Return empty rewards when Supabase is not configured
      setRewards([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userRewards = await db.rewards.findByUserId(userId);
      setRewards(userRewards || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rewards';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createReferral = async (referralData: Partial<Referral>) => {
    if (!isSupabaseAvailable) {
      toast({
        title: 'Feature Unavailable',
        description: 'Referral system requires database configuration',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newReferral = await db.referrals.create(referralData);
      setReferrals(prev => [newReferral, ...prev]);
      
      toast({
        title: 'Referral Created',
        description: 'Your referral has been registered successfully',
      });
      
      return newReferral;
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

  const useReward = async (rewardId: string) => {
    if (!isSupabaseAvailable) {
      toast({
        title: 'Feature Unavailable',
        description: 'Reward system requires database configuration',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedReward = await db.rewards.markAsUsed(rewardId);
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId ? updatedReward : reward
      ));
      
      toast({
        title: 'Reward Applied',
        description: 'Your reward has been applied successfully',
      });
      
      return updatedReward;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to use reward';
      setError(errorMessage);
      
      toast({
        title: 'Reward Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableRewards = () => {
    return rewards.filter(reward => !reward.used && 
      (!reward.expires_at || new Date(reward.expires_at) > new Date())
    );
  };

  const getTotalRewardValue = () => {
    return getAvailableRewards().reduce((total, reward) => total + reward.amount, 0);
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
    useReward,
    getAvailableRewards,
    getTotalRewardValue,
    refetch: () => {
      fetchReferrals();
      fetchRewards();
    },
  };
};