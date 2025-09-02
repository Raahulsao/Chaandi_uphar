// Uses localStorage for persistence (no integrations). Brand buttons inherit global styles.

"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Package, ShoppingCart, Users, TrendingUp, Eye, Settings2, ImageIcon } from "lucide-react"

// Types
type Category = "Rings" | "Chains" | "Earrings" | "Bracelets" | "Anklets" | "Pendants" | "Bangles"
type ProductStatus = "Active" | "Inactive" | "Out of Stock"

type Product = {
  id: string
  name: string
  category: Category
  price: number
  originalPrice?: number
  images: string[] // data URLs or static paths
  description: string
  stock: number
  status: ProductStatus
  rating?: number
  reviews?: number
}

type OrderItem = { productId: string; name: string; qty: number; price: number }
type DeliveryStatus = "Pending" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "On Hold"

type Order = {
  id: string
  customer: string
  email: string
  phone: string
  items: OrderItem[]
  total: number
  paymentStatus: "Paid" | "Pending"
  deliveryStatus: DeliveryStatus
  orderDate: string
  address: string
}

type ContentConfig = {
  hero: { title: string; subtitle: string; image?: string }
  featuredCollectionIds: string[] // product ids
  bestSellerIds: string[] // product ids
}

// Constants
const CATEGORIES: Category[] = ["Rings", "Chains", "Earrings", "Bracelets", "Anklets", "Pendants", "Bangles"]

// localStorage utils
const LS_KEYS = {
  products: "admin.products",
  orders: "admin.orders",
  content: "admin.content",
}

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function saveLS<T>(key: string, value: T) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// Seed data (used only when LS is empty)
const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Diamond Solitaire Ring",
    category: "Rings",
    price: 25999,
    originalPrice: 29999,
    images: ["/luxury-diamond-ring.png"],
    description: "A timeless solitaire ring with premium cut diamond.",
    stock: 15,
    status: "Active",
    rating: 4.8,
    reviews: 176,
  },
  {
    id: "p2",
    name: "Gold Chain Necklace",
    category: "Chains",
    price: 12999,
    originalPrice: 15999,
    images: ["/gold-necklace-pendant.png"],
    description: "Classic 18k gold chain with elegant finish.",
    stock: 8,
    status: "Active",
    rating: 4.7,
    reviews: 122,
  },
  {
    id: "p3",
    name: "Pearl Drop Earrings",
    category: "Earrings",
    price: 8999,
    originalPrice: 10999,
    images: ["/pearl-drop-earrings.png"],
    description: "Freshwater pearl drops with silver hooks.",
    stock: 0,
    status: "Out of Stock",
    rating: 4.6,
    reviews: 90,
  },
]

const seedOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    items: [
      { productId: "p1", name: "Diamond Solitaire Ring", qty: 1, price: 25999 },
      { productId: "p2", name: "Gold Chain Necklace", qty: 1, price: 12999 },
    ],
    total: 38998,
    paymentStatus: "Paid",
    deliveryStatus: "Processing",
    orderDate: "2024-01-15",
    address: "123 MG Road, Bangalore, Karnataka 560001",
  },
  {
    id: "ORD-002",
    customer: "Rahul Gupta",
    email: "rahul@example.com",
    phone: "+91 99880 11223",
    items: [{ productId: "p1", name: "Diamond Solitaire Ring", qty: 1, price: 25999 }],
    total: 25999,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped",
    orderDate: "2024-01-14",
    address: "456 Park Street, Kolkata, West Bengal 700016",
  },
  {
    id: "ORD-003",
    customer: "Anita Patel",
    email: "anita@example.com",
    phone: "+91 90000 77777",
    items: [
      { productId: "p2", name: "Gold Chain Necklace", qty: 2, price: 12999 },
      { productId: "p3", name: "Pearl Drop Earrings", qty: 1, price: 8999 },
    ],
    total: 47997,
    paymentStatus: "Pending",
    deliveryStatus: "On Hold",
    orderDate: "2024-01-13",
    address: "789 Marine Drive, Mumbai, Maharashtra 400001",
  },
]

const seedContent: ContentConfig = {
  hero: {
    title: "Elevate Every Moment",
    subtitle: "Handcrafted luxury jewelry for every occasion.",
    image: "/hero-jewelry.png",
  },
  featuredCollectionIds: ["p1", "p2"],
  bestSellerIds: ["p1"],
}

export default function AdminPanel() {
  // state
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [content, setContent] = useState<ContentConfig>(seedContent)
  const [activeCategory, setActiveCategory] = useState<Category>("Rings")

  // dialogs
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // load/save LS
  useEffect(() => {
    setProducts(loadLS<Product[]>(LS_KEYS.products, seedProducts))
    setOrders(loadLS<Order[]>(LS_KEYS.orders, seedOrders))
    setContent(loadLS<ContentConfig>(LS_KEYS.content, seedContent))
  }, [])
  useEffect(() => saveLS(LS_KEYS.products, products), [products])
  useEffect(() => saveLS(LS_KEYS.orders, orders), [orders])
  useEffect(() => saveLS(LS_KEYS.content, content), [content])

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [products, activeCategory],
  )

  // CRUD handlers
  function upsertProduct(p: Product) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id)
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]
    })
  }
  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function updateOrderStatus(id: string, status: DeliveryStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, deliveryStatus: status } : o)))
  }

  // UI
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Website
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Total Products" value={products.length.toString()} icon={<Package className="h-4 w-4" />} />
          <StatCard title="Total Orders" value={orders.length.toString()} icon={<ShoppingCart className="h-4 w-4" />} />
          <StatCard title="Active Customers" value="892" icon={<Users className="h-4 w-4" />} />
          <StatCard title="Revenue" value="₹12,45,678" icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:max-w-xl">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products */}
          <TabsContent value="products" className="space-y-4">
            {/* Category chips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage products by category. Create, edit, delete and upload images.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant={activeCategory === c ? "default" : "outline"}
                      onClick={() => setActiveCategory(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {activeCategory} — {filteredProducts.length} items
              </h3>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New {activeCategory.slice(0, -1)}</DialogTitle>
                    <DialogDescription>Add a new product to the {activeCategory} page.</DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    initial={{
                      id: crypto.randomUUID(),
                      name: "",
                      category: activeCategory,
                      price: 0,
                      originalPrice: 0,
                      images: [],
                      description: "",
                      stock: 0,
                      status: "Active",
                    }}
                    onSubmit={(p) => {
                      upsertProduct(p)
                      setIsAddOpen(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {/* Primary image */}
                    <img
                      src={p.images[0] || "/placeholder.svg?height=300&width=400&query=product"}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Rating pill if available */}
                    {(p.rating || p.reviews) && (
                      <div className="absolute left-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-xs shadow">
                        {p.rating?.toFixed(1) || "—"} ★ {p.reviews ? `| ${p.reviews}` : ""}
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="line-clamp-1 font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.category}</p>
                      </div>
                      <Badge variant={p.status === "Active" ? "default" : "secondary"}>{p.status}</Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice ? (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{p.originalPrice.toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" onClick={() => setEditProduct(p)} className="flex-1">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive bg-transparent"
                        onClick={() => deleteProduct(p.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit dialog */}
            {editProduct && (
              <Dialog open onOpenChange={() => setEditProduct(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update details, images and inventory.</DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    initial={editProduct}
                    onSubmit={(p) => {
                      upsertProduct(p)
                      setEditProduct(null)
                    }}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditProduct(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Table view (quick inventory) */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory — {activeCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="flex items-center gap-3">
                          <img
                            src={p.images[0] || "/placeholder.svg"}
                            alt={p.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.description.slice(0, 50)}
                              {p.description.length > 50 ? "..." : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>₹{p.price.toLocaleString()}</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "Active" ? "default" : "secondary"}>{p.status}</Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditProduct(p)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive bg-transparent"
                            onClick={() => deleteProduct(p.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Update homepage hero title, subtitle, and image.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="heroTitle">Title</Label>
                  <Input
                    id="heroTitle"
                    value={content.hero.title}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                  />
                  <Label htmlFor="heroSub">Subtitle</Label>
                  <Textarea
                    id="heroSub"
                    value={content.hero.subtitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUploader
                    current={content.hero.image}
                    onChange={(img) => setContent({ ...content, hero: { ...content.hero, image: img } })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured & Best Sellers */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Collections</CardTitle>
                <CardDescription>Select products to highlight on the homepage.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductPicker
                  products={products}
                  selectedIds={content.featuredCollectionIds}
                  onChange={(ids) => setContent({ ...content, featuredCollectionIds: ids })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Sellers</CardTitle>
                <CardDescription>Choose products to appear in Best Sellers.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductPicker
                  products={products}
                  selectedIds={content.bestSellerIds}
                  onChange={(ids) => setContent({ ...content, bestSellerIds: ids })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage order statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{o.customer}</p>
                            <p className="text-xs text-muted-foreground">
                              {o.email} • {o.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{o.items.reduce((n, it) => n + it.qty, 0)} items</TableCell>
                        <TableCell>₹{o.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={o.paymentStatus === "Paid" ? "default" : "secondary"}>
                            {o.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={o.deliveryStatus}
                            onValueChange={(v: DeliveryStatus) => updateOrderStatus(o.id, v)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Pending",
                                "Processing",
                                "Shipped",
                                "Out for Delivery",
                                "Delivered",
                                "Cancelled",
                                "On Hold",
                              ].map((s) => (
                                <SelectItem key={s} value={s as DeliveryStatus}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details — {o.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold">Customer</h4>
                                    <p>{o.customer}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {o.email} • {o.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Order Date</h4>
                                    <p>{o.orderDate}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Address</h4>
                                  <p className="text-sm">{o.address}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Items</h4>
                                  <ul className="list-inside list-disc text-sm">
                                    {o.items.map((it, idx) => (
                                      <li key={idx}>
                                        {it.name} × {it.qty} — ₹{(it.qty * it.price).toLocaleString()}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p>Total</p>
                                  <p className="font-semibold">₹{o.total.toLocaleString()}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// UI subcomponents
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">—</p>
      </CardContent>
    </Card>
  )
}

function ProductForm({
  initial,
  onSubmit,
}: {
  initial: Product
  onSubmit: (p: Product) => void
}) {
  const [form, setForm] = useState<Product>(initial)

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v as Category)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={form.originalPrice ?? 0}
            onChange={(e) => set("originalPrice", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Stock</Label>
          <Input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as ProductStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <ImageUploader multiple currentList={form.images} onChangeList={(list) => set("images", list)} />
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={() => onSubmit(form)}>Save</Button>
      </div>
    </div>
  )
}

function ImageUploader({
  current,
  onChange,
  multiple,
  currentList,
  onChangeList,
}: {
  current?: string
  onChange?: (src?: string) => void
  multiple?: boolean
  currentList?: string[]
  onChangeList?: (list: string[]) => void
}) {
  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.readAsDataURL(file)
        }),
    )
    Promise.all(readers).then((urls) => {
      if (multiple && currentList && onChangeList) {
        onChangeList([...(currentList || []), ...urls])
      } else if (onChange) {
        onChange(urls[0])
      }
    })
  }

  return (
    <div className="rounded-lg border-2 border-dashed p-4 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm">Click to upload or drag & drop</p>
      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="mt-3"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {/* Preview */}
      {current && (
        <div className="mt-3">
          <img
            src={current || "/placeholder.svg"}
            alt="preview"
            className="mx-auto h-32 w-full max-w-xs rounded object-cover"
          />
        </div>
      )}
      {currentList && currentList.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {currentList.map((src, idx) => (
            <div key={idx} className="relative">
              <img src={src || "/placeholder.svg"} alt={`img-${idx}`} className="h-20 w-full rounded object-cover" />
              <button
                className="absolute right-1 top-1 rounded bg-white/90 px-1 text-xs shadow"
                onClick={() => onChangeList && onChangeList(currentList.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductPicker({
  products,
  selectedIds,
  onChange,
}: {
  products: Product[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  // group by category for usability
  const grouped = useMemo(() => {
    const map = new Map<Category, Product[]>()
    CATEGORIES.forEach((c) =>
      map.set(
        c,
        products.filter((p) => p.category === c),
      ),
    )
    return map
  }, [products])

  function toggle(id: string) {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id))
    else onChange([...selectedIds, id])
  }

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([cat, list]) => (
        <div key={cat}>
          <h4 className="mb-2 font-semibold">{cat}</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const selected = selectedIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`flex items-center gap-3 rounded border p-2 text-left transition ${
                    selected ? "border-foreground/40 bg-foreground/5" : "border-muted"
                  }`}
                >
                  <img
                    src={p.images[0] || "/placeholder.svg"}
                    alt={p.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{p.price.toLocaleString()}</p>
                  </div>
                  {selected && <Badge>Selected</Badge>}
                </button>
              )
            })}
            {list.length === 0 && <p className="text-sm text-muted-foreground">No products in {cat}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
