"use client"

import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Package, 
  ChevronRight,
  ChevronDown,
  Plus,
  LogOut,
  Users,
  Gift,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { generateReferralCode, isSupabaseAvailable } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

export default function AccountPage() {
  const [showAddresses, setShowAddresses] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Use the new auth hook
  const { user, firebaseUser, loading, statistics, isAuthenticated, refreshUserData } = useAuth()
  
  // Mock referrals data for now - will be replaced with actual API calls
  const referrals = []
  const referralsLoading = false

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  // Initialize user profile if needed
  const initializeUserProfile = useCallback(async () => {
    if (firebaseUser && !user && isSupabaseAvailable) {
      await refreshUserData()
    }
  }, [firebaseUser, user, refreshUserData])

  // Memoized referral code to prevent changes on every render
  const userReferralCode = useMemo(() => {
    if (user?.referral_code) {
      return user.referral_code
    }
    // Generate consistent code based on user data for Firebase users
    const userData = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User'
    return generateReferralCode(userData, firebaseUser?.email || undefined)
  }, [user?.referral_code, firebaseUser?.displayName, firebaseUser?.email])

  // Memoized referral count to prevent infinite re-renders
  const completedReferralsCount = useMemo(() => {
    return statistics?.completedReferrals || 0
  }, [statistics?.completedReferrals])

  const handleSignOut = async () => {
    if (!auth) return
    
    try {
      await signOut(auth)
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userReferralCode)
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    })
  }

  const shareReferralCode = async () => {
    const referralText = `🎉 Join Chaandi Uphar with my referral code: ${userReferralCode}\n\nGet beautiful jewelry and I'll earn rewards when you make your first purchase!\n\n✨ Explore luxury jewelry at Chaandi Uphar`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Chaandi Uphar',
          text: referralText,
        })
      } catch (error) {
        await navigator.clipboard.writeText(referralText)
        toast({
          title: 'Shared!',
          description: 'Referral message copied to clipboard',
        })
      }
    } else {
      await navigator.clipboard.writeText(referralText)
      toast({
        title: 'Shared!',
        description: 'Referral message copied to clipboard',
      })
    }
  }
  
  const scrollToOrders = useCallback(() => {
    const ordersSection = document.getElementById('recent-orders-section')
    if (ordersSection) {
      ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])
  
  const scrollToReferrals = useCallback(() => {
    const referralsSection = document.getElementById('referrals-section')
    if (referralsSection) {
      referralsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])
  
  const recentOrders = [
    {
      id: "ORD-001",
      name: "Rose Gold Diamond Necklace",
      price: "₹15,999",
      date: "Dec 28, 2024",
      status: "Delivered"
    },
    {
      id: "ORD-002", 
      name: "Silver Temple Earrings",
      price: "₹4,299",
      date: "Dec 20, 2024",
      status: "Shipped"
    }
  ]

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Park, Office Tower, Bangalore, Karnataka 560001",
      isDefault: false
    },
    {
      id: 3,
      type: "Other",
      address: "789 Family House, Delhi, NCR 110001",
      isDefault: false
    }
  ]

  // Memoized account sections to prevent infinite re-renders
  const accountSections = useMemo(() => [
    { icon: ShoppingBag, title: "Orders", subtitle: "12 orders", action: scrollToOrders },
    { icon: Heart, title: "Wishlist", subtitle: "8 items", href: "/wishlist" },
    { icon: Users, title: "Referrals", subtitle: `${completedReferralsCount} friends`, action: scrollToReferrals },
    { icon: ShoppingBag, title: "Cart", subtitle: "3 items", href: "/cart" }
  ], [completedReferralsCount, scrollToOrders, scrollToReferrals])
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8fab] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access your account.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your orders, addresses, and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {firebaseUser?.photoURL ? (
                    <img 
                      src={firebaseUser.photoURL} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.name || firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User'}</h2>
                <p className="text-gray-600 text-sm mb-4">{user?.email || firebaseUser?.email}</p>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  size="sm" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wishlist Items</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cart Items</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Referrals</span>
                  <span className="font-semibold">{completedReferralsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold">₹{statistics?.totalEarnings || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Database Configuration Notice */}
            {!isSupabaseAvailable && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <span className="text-sm">
                    ⚠️ Some features require database configuration. The referral system and order history are currently in demo mode.
                  </span>
                </div>
              </div>
            )}
            
            {/* Firebase Integration Notice */}
            {firebaseUser && !user && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-blue-900">Firebase Integration Active</h4>
                      <p className="text-sm text-blue-700">
                        Your account is connected with Firebase. {isSupabaseAvailable ? 'Database sync in progress...' : 'Referral system is running in demo mode with sample data.'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={initializeUserProfile} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2">
                    Sync Profile
                  </Button>
                </div>
              </div>
            )}
            
            {/* Account Management */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Account Management</h2>
                <p className="text-sm text-gray-600 mt-1">Quick access to your account features</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accountSections.map((section, index) => (
                    section.href ? (
                      <Link key={index} href={section.href} className="group">
                        <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#ff8fab] hover:bg-gradient-to-r hover:from-[#ff8fab]/5 hover:to-[#ff8fab]/10 transition-all duration-200 shadow-sm hover:shadow-md">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 group-hover:bg-[#ff8fab] p-3 rounded-full transition-colors duration-200">
                              <section.icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-base">{section.title}</p>
                              <p className="text-sm text-gray-600">{section.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff8fab] transition-colors duration-200" />
                        </div>
                      </Link>
                    ) : (
                      <div key={index} className="group cursor-pointer" onClick={section.action}>
                        <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#ff8fab] hover:bg-gradient-to-r hover:from-[#ff8fab]/5 hover:to-[#ff8fab]/10 transition-all duration-200 shadow-sm hover:shadow-md">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 group-hover:bg-[#ff8fab] p-3 rounded-full transition-colors duration-200">
                              <section.icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-base">{section.title}</p>
                              <p className="text-sm text-gray-600">{section.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff8fab] transition-colors duration-200" />
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Address Dropdown */}
                  <div className="col-span-1 sm:col-span-2">
                    <div 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#ff8fab] hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                      onClick={() => setShowAddresses(!showAddresses)}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Addresses</p>
                          <p className="text-sm text-gray-600">{addresses.length} saved</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAddresses ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Address Dropdown Content */}
                    {showAddresses && (
                      <div className="mt-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="p-4">
                          <div className="space-y-3">
                            {addresses.map((address) => (
                              <div key={address.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900">{address.type}</span>
                                    {address.isDefault && (
                                      <span className="bg-[#ff8fab] text-white text-xs px-2 py-1 rounded-full">Default</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{address.address}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[#ff8fab] hover:bg-[#ff8fab]/10">
                                  Edit
                                </Button>
                              </div>
                            ))}
                            
                            {/* Add New Address Button */}
                            <button 
                              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ff8fab] hover:bg-[#ff8fab]/5 transition-all duration-200"
                              onClick={() => {
                                console.log('Add new address');
                              }}
                            >
                              <Plus className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 font-medium">Add New Address</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals Section */}
            <div id="referrals-section" className="bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="p-5 lg:p-7 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] p-3 rounded-full shadow-md">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Referral Program</h2>
                      <p className="text-sm text-gray-600 mt-1">Share & earn rewards with every successful referral</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={copyReferralCode}
                      variant="outline" 
                      size="lg" 
                      className="border-[#ff8fab]/40 hover:bg-[#ff8fab]/10 hover:border-[#ff8fab]/60 text-[#ff8fab] hover:text-[#ff7a9a] font-medium px-6 py-3 rounded-xl shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button 
                      onClick={shareReferralCode}
                      size="lg" 
                      className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] hover:from-[#ff7a9a] hover:to-[#ff6b8a] text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-5 lg:p-7">
                {/* Referral Code Display */}
                <div className="bg-gradient-to-br from-[#ff8fab]/5 via-white to-[#ff8fab]/10 border-2 border-dashed border-[#ff8fab]/30 rounded-xl p-8 mb-8 shadow-inner">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] p-3 rounded-full shadow-lg">
                        <Gift className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Your Referral Code</h3>
                    <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] text-white px-8 py-4 rounded-xl inline-block mb-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <code className="text-2xl font-bold font-mono tracking-wider">
                        {userReferralCode}
                      </code>
                    </div>
                    <p className="text-base text-gray-700 font-medium">
                      Share this code with friends and get ₹500 when they make their first purchase!
                    </p>
                  </div>
                </div>

                {/* Referral Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-md border border-blue-200">
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-blue-500 p-3 rounded-full shadow-md">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-blue-800 mb-2">Total Referrals</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {completedReferralsCount}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-md border border-green-200">
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-green-500 p-3 rounded-full shadow-md">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-800 mb-2">Total Earned</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{statistics?.totalEarnings || 0}
                    </p>
                  </div>
                </div>

                {/* How it Works */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">How it works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-[#ff8fab] to-[#ff7a9a] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        1
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Share Code</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">Share your referral code with friends and family</p>
                    </div>
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-[#ff8fab] to-[#ff7a9a] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        2
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Get Discount</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">They get special discounts on their first order</p>
                    </div>
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-[#ff8fab] to-[#ff7a9a] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        3
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Earn Reward</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">You earn ₹500 when they make a purchase</p>
                    </div>
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-[#ff8fab] to-[#ff7a9a] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        4
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Win-Win</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">Both you and your friend benefit!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div id="recent-orders-section" className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link href="/orders">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
              
              {recentOrders.length > 0 ? (
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">{order.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs lg:text-sm text-gray-600">
                            <span className="font-medium">{order.id}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{order.date}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2">
                          <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.price}</p>
                          <Button size="sm" variant="outline" className="text-xs lg:text-sm px-3 lg:px-4">
                            Track Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 lg:p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4 text-sm lg:text-base">No recent orders</p>
                  <Link href="/">
                    <Button className="text-sm lg:text-base">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
