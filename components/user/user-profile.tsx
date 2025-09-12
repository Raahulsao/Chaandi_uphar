'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useOrders, useReferrals } from '@/hooks/use-supabase';
import { User, Gift, Package, Copy, Trophy, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateReferralCode, isSupabaseAvailable } from '@/lib/supabase';
import { ReferralCard } from './referral-card';

interface UserProfileProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  userEmail,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, updateUser, loading: userLoading } = useUser(userId);
  const { orders, loading: ordersLoading } = useOrders(userId);
  const { 
    referrals, 
    rewards, 
    getTotalRewardValue, 
    getAvailableRewards,
    loading: referralsLoading 
  } = useReferrals(userId);
  const { toast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userName,
    mobile_number: '',
  });

  // Initialize user profile if it doesn't exist
  useEffect(() => {
    if (!user && !userLoading) {
      const referralCode = generateReferralCode(userName);
      updateUser({
        id: userId,
        email: userEmail,
        name: userName,
        referral_code: referralCode,
      });
    } else if (user) {
      setFormData({
        name: user.name,
        mobile_number: user.mobile_number || '',
      });
    }
  }, [user, userLoading, userId, userEmail, userName, updateUser]);

  const handleSaveProfile = async () => {
    await updateUser(formData);
    setEditMode(false);
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
    }
  };

  const getOrderStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (userLoading) {
    return <div className="flex items-center justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-[#ff8fab] p-3 rounded-full">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.name || userName}</h1>
          <p className="text-gray-600">{user?.email || userEmail}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Database Configuration Notice */}
            {!isSupabaseAvailable && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <span className="text-sm">
                      ⚠️ Some features require database configuration. The referral system and order history are currently in demo mode.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Referral Card */}
            {(user?.referral_code || !isSupabaseAvailable) && (
              <ReferralCard
                referralCode={user?.referral_code || generateReferralCode(userName)}
                totalReferrals={referrals.filter(r => r.status === 'completed').length}
                totalEarned={referrals.reduce((total, r) => total + (r.reward_given ? r.reward_amount : 0), 0)}
                userName={user?.name || userName}
              />
            )}
            
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || userEmail}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                      disabled={!editMode}
                      placeholder="+91 9999999999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="referral">Your Referral Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="referral"
                        value={user?.referral_code || ''}
                        disabled
                      />
                      <Button onClick={copyReferralCode} variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {editMode ? (
                    <>
                      <Button onClick={handleSaveProfile} className="bg-[#ff8fab] hover:bg-[#ff7a9a]">
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditMode(false)} variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)} variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order History</span>
              </CardTitle>
              <CardDescription>
                Track your orders and purchase history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center p-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found</p>
                  <p className="text-sm text-gray-500">Start shopping to see your orders here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Order #{order.order_number}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Amount:</span>
                          <p>₹{order.total_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Payment Status:</span>
                          <p className="capitalize">{order.payment_status}</p>
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>
                          <p>{order.items?.length || 0} item(s)</p>
                        </div>
                      </div>
                      
                      {order.items && order.items.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product_name} (x{item.quantity})</span>
                                <span>₹{item.total.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Referral Program</span>
              </CardTitle>
              <CardDescription>
                Invite friends and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] rounded-lg p-6 text-white mb-6">
                <h3 className="text-xl font-bold mb-2">Your Referral Code</h3>
                <div className="flex items-center space-x-4">
                  <code className="bg-white/20 px-4 py-2 rounded-lg text-lg font-mono">
                    {user?.referral_code || 'Loading...'}
                  </code>
                  <Button 
                    onClick={copyReferralCode} 
                    variant="secondary"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="mt-3 text-sm opacity-90">
                  Share this code with friends and get ₹500 when they make their first purchase!
                </p>
              </div>

              {referralsLoading ? (
                <div className="flex items-center justify-center p-8">Loading referrals...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Total Referrals</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {referrals.filter(r => r.status === 'completed').length}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">Total Earned</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{referrals.reduce((total, r) => total + (r.reward_given ? r.reward_amount : 0), 0)}
                      </p>
                    </div>
                  </div>

                  {referrals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Referral History</h4>
                      <div className="space-y-3">
                        {referrals.map((referral) => (
                          <div key={referral.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Referral Code: {referral.referral_code}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(referral.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={
                                referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                                referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                              </Badge>
                            </div>
                            {referral.reward_given && (
                              <p className="text-sm text-green-600 mt-2">
                                Reward: ₹{referral.reward_amount}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Rewards & Credits</span>
              </CardTitle>
              <CardDescription>
                Your available rewards and credits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-6">
                <h3 className="text-xl font-bold mb-2">Available Balance</h3>
                <p className="text-3xl font-bold">₹{getTotalRewardValue()}</p>
                <p className="text-sm opacity-90 mt-2">
                  Use your rewards on your next purchase
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Available Rewards</h4>
                {getAvailableRewards().length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No rewards available</p>
                    <p className="text-sm text-gray-500">Refer friends to earn rewards</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getAvailableRewards().map((reward) => (
                      <div key={reward.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{reward.description}</h5>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {reward.expires_at ? 
                                `Expires: ${new Date(reward.expires_at).toLocaleDateString()}` :
                                'No expiry'
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₹{reward.amount}</p>
                            <Badge variant="secondary" className="text-xs">
                              {reward.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {rewards.filter(r => r.used).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Used Rewards</h4>
                    <div className="space-y-2">
                      {rewards.filter(r => r.used).map((reward) => (
                        <div key={reward.id} className="border rounded-lg p-3 opacity-60">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{reward.description}</span>
                            <span className="text-sm text-gray-600">₹{reward.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};