"use client"

import Link from "next/link"
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Gift, 
  CreditCard, 
  Settings, 
  LogOut, 
  Crown, 
  Star, 
  Package, 
  Truck,
  Shield,
  Award,
  Gem,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const quickStats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag, color: "text-[#ff8fab]" },
    { label: "Wishlist Items", value: "8", icon: Heart, color: "text-red-500" },
    { label: "Loyalty Points", value: "2,450", icon: Star, color: "text-yellow-500" },
    { label: "Saved Addresses", value: "3", icon: MapPin, color: "text-blue-500" }
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      name: "Rose Gold Diamond Necklace",
      price: "₹15,999",
      date: "Dec 28, 2024",
      status: "Delivered",
      image: "/placeholder.svg"
    },
    {
      id: "ORD-002", 
      name: "Silver Temple Earrings",
      price: "₹4,299",
      date: "Dec 20, 2024",
      status: "Shipped",
      image: "/placeholder.svg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-pink-50/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-24 h-24 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -right-8 w-32 h-32 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6 lg:py-10">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif flex items-center">
              <Crown className="w-6 lg:w-8 h-6 lg:h-8 mr-2 text-[#ff8fab]" />
              My Account
            </h1>
            <Button 
              variant="outline" 
              className="mt-3 sm:mt-0 border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </div>
          <p className="text-gray-600 font-serif">Welcome back! Manage your jewelry collection and orders.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#ff8fab] to-purple-400 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#ff8fab] rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-serif">Priya Sharma</h2>
                <p className="text-sm text-gray-600 font-serif">Premium Member</p>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">VIP Status</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="text-center p-3 bg-gradient-to-r from-gray-50 to-pink-50/30 rounded-lg">
                      <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                      <p className="text-xs text-gray-600 font-serif">{stat.label}</p>
                      <p className="font-bold text-gray-900 font-serif">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif rounded-lg">
                  <Gift className="w-4 h-4 mr-2" />
                  View Rewards
                </Button>
                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-serif rounded-lg">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-serif mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#ff8fab]" />
                Your Benefits
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-sm">Free Premium Shipping</p>
                    <p className="text-xs text-gray-600">On all orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-sm">Lifetime Warranty</p>
                    <p className="text-xs text-gray-600">All purchases covered</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-sm">Early Access</p>
                    <p className="text-xs text-gray-600">New collections first</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-serif mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <Link href="/rings" className="group">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <Gem className="w-8 h-8 mx-auto mb-2 text-[#ff8fab]" />
                    <p className="font-semibold text-gray-900 font-serif text-sm">Rings</p>
                  </div>
                </Link>
                <Link href="/bracelet" className="group">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#ff8fab]" />
                    <p className="font-semibold text-gray-900 font-serif text-sm">Bracelets</p>
                  </div>
                </Link>
                <Link href="/earrings" className="group">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <Star className="w-8 h-8 mx-auto mb-2 text-[#ff8fab]" />
                    <p className="font-semibold text-gray-900 font-serif text-sm">Earrings</p>
                  </div>
                </Link>
                <Link href="/gifts" className="group">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-[#ff8fab]" />
                    <p className="font-semibold text-gray-900 font-serif text-sm">Gifts</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 font-serif flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#ff8fab]" />
                  Recent Orders
                </h2>
                <Button variant="outline" className="text-[#ff8fab] border-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif text-sm">
                  View All
                </Button>
              </div>
              
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-pink-50/30 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={order.image || "/placeholder.svg"} 
                          alt={order.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 font-serif text-sm lg:text-base truncate">{order.name}</h4>
                        <p className="text-sm text-gray-600 font-serif">{order.id} • {order.date}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-bold text-[#ff8fab] font-serif">{order.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif">
                        Track
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-serif mb-4">You have no recent orders</p>
                  <Link href="/">
                    <Button className="bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Account Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-serif mb-4">Account Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/wishlist" className="group">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                    <Heart className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900 font-serif">Wishlist</p>
                      <p className="text-sm text-gray-600">8 saved items</p>
                    </div>
                  </div>
                </Link>
                <Link href="/cart" className="group">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                    <ShoppingBag className="w-6 h-6 text-[#ff8fab]" />
                    <div>
                      <p className="font-semibold text-gray-900 font-serif">Shopping Cart</p>
                      <p className="text-sm text-gray-600">3 items waiting</p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900 font-serif">Addresses</p>
                    <p className="text-sm text-gray-600">3 saved addresses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900 font-serif">Payment Methods</p>
                    <p className="text-sm text-gray-600">2 cards saved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
