"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Upload, Plus, Edit, Search, ImageIcon, Save, Loader2 } from "lucide-react"
import { Product, Category, ProductImage } from "@/lib/supabase"

interface ProductFormData {
  name: string
  description: string
  short_description: string
  price: number
  compare_price?: number
  sku?: string
  category_id?: string
  tags: string[]
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  weight?: number
  seo_title?: string
  seo_description?: string
  inventory?: {
    quantity: number
    low_stock_threshold: number
    track_inventory: boolean
  }
}

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    compare_price: 0,
    sku: '',
    category_id: '',
    tags: [],
    status: 'draft',
    featured: false,
    weight: 0,
    seo_title: '',
    seo_description: '',
    inventory: {
      quantity: 1,
      low_stock_threshold: 10,
      track_inventory: true
    }
  })

  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const { toast } = useToast()

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        setCategories([
          { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Jewellery', slug: 'jewellery', status: 'active', sort_order: 1, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Silver', slug: 'silver', status: 'active', sort_order: 2, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Chains', slug: 'chains', status: 'active', sort_order: 3, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Pendants', slug: 'pendants', status: 'active', sort_order: 4, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Earrings', slug: 'earrings', status: 'active', sort_order: 5, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Rings', slug: 'rings', status: 'active', sort_order: 6, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Bracelet', slug: 'bracelet', status: 'active', sort_order: 7, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Couple Goals', slug: 'couple-goals', status: 'active', sort_order: 8, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Gifts', slug: 'gifts', status: 'active', sort_order: 9, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Anklets', slug: 'anklets', status: 'active', sort_order: 10, created_at: '', updated_at: '' },
          { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Ladoo Gopal Shringaar', slug: 'ladoo-gopal-shringaar', status: 'active', sort_order: 11, created_at: '', updated_at: '' }
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Jewellery', slug: 'jewellery', status: 'active', sort_order: 1, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Silver', slug: 'silver', status: 'active', sort_order: 2, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Chains', slug: 'chains', status: 'active', sort_order: 3, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Pendants', slug: 'pendants', status: 'active', sort_order: 4, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Earrings', slug: 'earrings', status: 'active', sort_order: 5, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Rings', slug: 'rings', status: 'active', sort_order: 6, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Bracelet', slug: 'bracelet', status: 'active', sort_order: 7, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Couple Goals', slug: 'couple-goals', status: 'active', sort_order: 8, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Gifts', slug: 'gifts', status: 'active', sort_order: 9, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Anklets', slug: 'anklets', status: 'active', sort_order: 10, created_at: '', updated_at: '' },
        { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Ladoo Gopal Shringaar', slug: 'ladoo-gopal-shringaar', status: 'active', sort_order: 11, created_at: '', updated_at: '' }
      ])
    }
  }

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedImages: ProductImage[] = []
    let successCount = 0
    let errorCount = 0

    try {
      for (const file of Array.from(files)) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          errorCount++
          continue
        }

        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
          errorCount++
          continue
        }

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('alt_text', `${formData.name || 'Product'} image`)

        const response = await fetch('/api/upload/images', {
          method: 'POST',
          body: uploadFormData
        })

        if (response.ok) {
          const result = await response.json()
          uploadedImages.push({
            id: `temp-${Date.now()}-${Math.random()}`,
            product_id: '',
            cloudinary_public_id: result.publicId,
            url: result.url,
            alt_text: `${formData.name || 'Product'} image`,
            sort_order: productImages.length + uploadedImages.length,
            is_primary: productImages.length === 0 && uploadedImages.length === 0,
            created_at: new Date().toISOString()
          })
          successCount++
        } else {
          errorCount++
        }
      }

      setProductImages(prev => [...prev, ...uploadedImages])

      if (successCount > 0) {
        toast({
          title: 'Images Uploaded Successfully',
          description: `${successCount} image(s) uploaded to Cloudinary${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`,
        })
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload images. Please check file types and sizes.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = async (imageId: string) => {
    // Remove from local state immediately for better UX
    setProductImages(prev => prev.filter(img => img.id !== imageId))

    // If it's a temporary image (not saved to database yet), no need to call API
    if (imageId.startsWith('temp-')) {
      return
    }

    // Call API to delete from database
    try {
      const response = await fetch(`/api/products/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        // If API call fails, add the image back to local state
        const imageToRestore = productImages.find(img => img.id === imageId)
        if (imageToRestore) {
          setProductImages(prev => [...prev, imageToRestore])
        }

        toast({
          title: 'Delete Failed',
          description: 'Failed to delete image from server. Please try again.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Image Deleted',
          description: 'Image has been deleted successfully.',
        })
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      // If API call fails, add the image back to local state
      const imageToRestore = productImages.find(img => img.id === imageId)
      if (imageToRestore) {
        setProductImages(prev => [...prev, imageToRestore])
      }

      toast({
        title: 'Delete Failed',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const setPrimaryImage = (imageId: string) => {
    setProductImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (name and price).',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        images: productImages
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const savedProduct = await response.json()

        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? savedProduct : p))
          toast({
            title: 'Product Updated',
            description: 'Product has been updated successfully.',
          })
        } else {
          setProducts(prev => [savedProduct, ...prev])
          toast({
            title: 'Product Created',
            description: 'Product has been created successfully and will appear on the website shortly.',
          })
        }

        resetForm()
        setIsDialogOpen(false)

        setTimeout(() => {
          fetchProducts()
        }, 1000)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save product. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      compare_price: 0,
      sku: '',
      category_id: '',
      tags: [],
      status: 'draft',
      featured: false,
      weight: 0,
      seo_title: '',
      seo_description: '',
      inventory: {
        quantity: 1,
        low_stock_threshold: 10,
        track_inventory: true
      }
    })
    setProductImages([])
    setEditingProduct(null)
  }

  const editProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price,
      compare_price: product.compare_price || 0,
      sku: product.sku || '',
      category_id: product.category_id || '',
      tags: product.tags || [],
      status: product.status,
      featured: product.featured,
      weight: product.weight || 0,
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      inventory: {
        quantity: (product as any).inventory?.quantity || 0,
        low_stock_threshold: (product as any).inventory?.low_stock_threshold || 10,
        track_inventory: (product as any).inventory?.track_inventory !== false
      }
    })
    setProductImages(product.images || [])
    setIsDialogOpen(true)
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId))
        toast({
          title: 'Product Deleted',
          description: 'Product has been deleted successfully.',
        })
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your jewelry products and inventory</p>
          {products.length === 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Images upload to Cloudinary, but products need database setup for full functionality.
                <a href="/database/SETUP_INSTRUCTIONS.md" className="underline ml-1">View setup guide</a>
              </p>
            </div>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#ff8fab] hover:bg-[#ff7a9a]">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Create a new jewelry product'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-500">Enter the basic details of your product</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Diamond Ring"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="short_description">Short Description</Label>
                      <Input
                        id="short_description"
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        placeholder="Elegant diamond ring with..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                          placeholder="2999"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="compare_price">Compare Price (₹)</Label>
                        <Input
                          id="compare_price"
                          type="number"
                          value={formData.compare_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, compare_price: Number(e.target.value) }))}
                          placeholder="3999"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value: 'draft' | 'active' | 'archived') => setFormData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed product description..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                        }))}
                        placeholder="diamond, ring, gold, luxury"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          placeholder="RNG001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (grams)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                          placeholder="5.5"
                        />
                      </div>
                    </div>

                    {/* Inventory Section */}
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <Label className="text-base font-semibold">Inventory Management</Label>
                        <p className="text-sm text-gray-500 mt-1">Set initial stock quantity. Products with 0 stock will show as "Out of Stock".</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">Stock Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={formData.inventory?.quantity || 0}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              inventory: {
                                ...prev.inventory!,
                                quantity: Number(e.target.value)
                              }
                            }))}
                            placeholder="Enter stock quantity (e.g., 50)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                          <Input
                            id="low_stock_threshold"
                            type="number"
                            value={formData.inventory?.low_stock_threshold || 10}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              inventory: {
                                ...prev.inventory!,
                                low_stock_threshold: Number(e.target.value)
                              }
                            }))}
                            placeholder="10"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="track_inventory"
                          checked={formData.inventory?.track_inventory !== false}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            inventory: {
                              ...prev.inventory!,
                              track_inventory: checked
                            }
                          }))}
                        />
                        <Label htmlFor="track_inventory">Track inventory for this product</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                  <p className="text-sm text-gray-500">Upload high-quality images that will be stored on Cloudinary</p>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 transition-colors ${uploadingImages
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = e.dataTransfer.files
                    if (files && files.length > 0) {
                      handleImageUpload(files)
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  <div className="text-center">
                    {uploadingImages ? (
                      <div className="space-y-4">
                        <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
                        <div>
                          <p className="text-lg font-medium text-blue-700">Uploading to Cloudinary...</p>
                          <p className="text-sm text-blue-600">Please wait while we process your images</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" className="mb-2">
                              Choose Images
                            </Button>
                            <Input
                              id="image-upload"
                              type="file"
                              multiple
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                              className="hidden"
                              disabled={uploadingImages}
                            />
                          </Label>
                          <p className="text-sm text-gray-600">or drag and drop images here</p>
                          <p className="text-xs text-gray-500 mt-2">
                            JPEG, PNG, WebP up to 10MB each • Images will be optimized automatically
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {productImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Uploaded Images ({productImages.length})</h4>
                      <p className="text-sm text-gray-500">Click on an image to set it as primary</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                            <img
                              src={image.url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Overlay with controls */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setPrimaryImage(image.id)}
                                disabled={image.is_primary}
                                className="text-xs"
                              >
                                {image.is_primary ? '✓ Primary' : 'Set Primary'}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(image.id)}
                                className="text-xs"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Primary badge */}
                          {image.is_primary && (
                            <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                              Primary
                            </Badge>
                          )}

                          {/* Image number */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                <div className="text-sm text-gray-500">
                  {editingProduct ? 'Update product information' : 'All fields marked with * are required'}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="min-w-[100px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.price}
                    className="min-w-[140px] bg-[#ff8fab] hover:bg-[#ff7a9a]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingProduct ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images.find(img => img.is_primary)?.url || product.images[0].url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="secondary" onClick={() => editProduct(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.short_description || product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.compare_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.images?.length || 0} images
                  </div>
                </div>
                {product.sku && (
                  <div className="text-xs text-gray-500 mt-2">
                    SKU: {product.sku}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first product.'}
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-[#ff8fab] hover:bg-[#ff7a9a]">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductManager