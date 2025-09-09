"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Package, 
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const [showAddresses, setShowAddresses] = useState(false)
  
  const scrollToOrders = () => {
    const ordersSection = document.getElementById('recent-orders-section')
    if (ordersSection) {
      ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
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

  const accountSections = [
    { icon: ShoppingBag, title: "Orders", subtitle: "12 orders", action: scrollToOrders },
    { icon: Heart, title: "Wishlist", subtitle: "8 items", href: "/wishlist" },
    { icon: ShoppingBag, title: "Cart", subtitle: "3 items", href: "/cart" }
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
                  <span className="text-gray-600">Cart Items</span>
                  <span className="font-semibold">3</span>
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
                    section.href ? (
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
                    ) : (
                      <div key={index} className="group cursor-pointer" onClick={section.action}>
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
                                // Handle add new address
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
