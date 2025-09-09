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
  Package, 
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
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

  const accountSections = [
    { icon: ShoppingBag, title: "Orders", subtitle: "12 orders", href: "/orders" },
    { icon: Heart, title: "Wishlist", subtitle: "8 items", href: "/wishlist" },
    { icon: MapPin, title: "Addresses", subtitle: "3 saved", href: "/addresses" },
    { icon: CreditCard, title: "Payment Methods", subtitle: "2 cards", href: "/payment" },
    { icon: Gift, title: "Rewards", subtitle: "2,450 points", href: "/rewards" },
    { icon: Settings, title: "Account Settings", subtitle: "Profile & preferences", href: "/settings" }
  ]

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
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Priya Sharma</h2>
                <p className="text-gray-600 text-sm mb-4">priya.sharma@email.com</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
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
                  <span className="text-gray-600">Reward Points</span>
                  <span className="font-semibold">2,450</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Management */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Account Management</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accountSections.map((section, index) => (
                    <Link key={index} href={section.href} className="group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#ff8fab] hover:bg-gray-50 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <section.icon className="w-5 h-5 text-gray-600 group-hover:text-[#ff8fab]" />
                          <div>
                            <p className="font-medium text-gray-900">{section.title}</p>
                            <p className="text-sm text-gray-600">{section.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff8fab]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link href="/orders">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
              
              {recentOrders.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{order.name}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>{order.id}</span>
                            <span>•</span>
                            <span>{order.date}</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{order.price}</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Track Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No recent orders</p>
                  <Link href="/">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Button variant="outline" className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
