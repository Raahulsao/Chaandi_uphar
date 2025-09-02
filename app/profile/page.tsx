"use client"

import { useState } from "react"
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const orderHistory = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "Delivered",
    total: 7399,
    items: 1,
    image: "/placeholder.svg?height=80&width=80&text=Order+1",
  },
  {
    id: "ORD002",
    date: "2024-01-10",
    status: "Shipped",
    total: 5998,
    items: 2,
    image: "/placeholder.svg?height=80&width=80&text=Order+2",
  },
  {
    id: "ORD003",
    date: "2024-01-05",
    status: "Processing",
    total: 1699,
    items: 1,
    image: "/placeholder.svg?height=80&width=80&text=Order+3",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save user info logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 lg:pt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <CardTitle>{userInfo.name}</CardTitle>
                  <CardDescription>{userInfo.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Addresses
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your personal details</CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                        {isEditing ? (
                          "Save"
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={userInfo.dateOfBirth}
                            onChange={(e) => setUserInfo({ ...userInfo, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>Track your recent purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orderHistory.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                              <img
                                src={order.image || "/placeholder.svg"}
                                alt="Order"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">Order #{order.id}</h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.items} item(s) • {order.date}
                              </p>
                              <p className="font-medium">₹{order.total.toLocaleString()}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Button>Add New Address</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Home</h3>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            123 MG Road, Bangalore, Karnataka 560001
                            <br />
                            Phone: +91 98765 43210
                          </p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Office</h3>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            456 Tech Park, Electronic City, Bangalore, Karnataka 560100
                            <br />
                            Phone: +91 98765 43210
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Notifications</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Email notifications for orders</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">SMS notifications for delivery</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Marketing emails</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Privacy</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Allow personalized recommendations</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Share data for analytics</span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
