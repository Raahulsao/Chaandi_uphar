"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Search, Filter, Grid, List, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Product, Category } from "@/lib/supabase"

interface ProductGridProps {
  title?: string
  categoryId?: string
  featured?: boolean
  limit?: number
  className?: string
  showFilters?: boolean
  viewMode?: 'grid' | 'list'
}

interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'newest' | 'featured'
  status: 'all' | 'active' | 'draft'
}

export function ProductGrid({
  title,
  categoryId,
  featured,
  limit,
  className,
  showFilters = false,
  viewMode = 'grid'
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list'>(viewMode)
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: categoryId || 'all',
    minPrice: 0,
    maxPrice: 100000,
    sortBy: 'newest',
    status: 'active'
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [categoryId, featured, limit, filters])

  // Fetch categories for filter
  useEffect(() => {
    if (showFilters) {
      fetchCategories()
    }
  }, [showFilters])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (categoryId) params.append('category', categoryId)
      if (featured !== undefined) params.append('featured', featured.toString())
      if (limit) params.append('limit', limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.sortBy) params.append('sort', filters.sortBy)
      if (filters.status !== 'all') params.append('status', filters.status)
      
      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        // Fallback to demo products
        setProducts(getDemoProducts())
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
      setProducts(getDemoProducts())
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
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const getDemoProducts = (): Product[] => [
    {
      id: '1',
      name: 'Diamond Solitaire Ring',
      slug: 'diamond-solitaire-ring',
      description: 'Elegant diamond solitaire ring with premium cut diamond',
      short_description: 'Premium diamond ring',
      price: 25999,
      compare_price: 29999,
      category_id: '1',
      tags: ['diamond', 'ring', 'luxury'],
      status: 'active',
      featured: true,
      images: [{
        id: '1',
        product_id: '1',
        cloudinary_public_id: 'demo-ring',
        url: '/luxury-diamond-ring.png',
        alt_text: 'Diamond Ring',
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString()
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Gold Chain Necklace',
      slug: 'gold-chain-necklace',
      description: 'Classic 18k gold chain with elegant finish',
      short_description: '18k gold chain',
      price: 12999,
      compare_price: 15999,
      category_id: '2',
      tags: ['gold', 'chain', 'necklace'],
      status: 'active',
      featured: false,
      images: [{
        id: '2',
        product_id: '2',
        cloudinary_public_id: 'demo-necklace',
        url: '/gold-necklace-pendant.png',
        alt_text: 'Gold Necklace',
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString()
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Freshwater pearl drops with silver hooks',
      short_description: 'Pearl earrings',
      price: 8999,
      compare_price: 10999,
      category_id: '3',
      tags: ['pearl', 'earrings', 'silver'],
      status: 'active',
      featured: true,
      images: [{
        id: '3',
        product_id: '3',
        cloudinary_public_id: 'demo-earrings',
        url: '/pearl-drop-earrings.png',
        alt_text: 'Pearl Earrings',
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString()
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const filteredProducts = products.filter(product => {
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category !== 'all' && product.category_id !== filters.category) {
      return false
    }
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false
    }
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (error) {
    return (
      <div className={cn("container mx-auto px-4 py-8", className)}>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <section className={cn("container mx-auto px-4 py-8", className)}>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {showFilters && (
            <div className="flex items-center gap-2">
              <Button
                variant={currentViewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={currentViewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                />
              </div>

              <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 100000,
                  sortBy: 'newest',
                  status: 'active'
                })}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className={cn(
          "grid gap-6",
          currentViewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}>
          {Array.from({ length: limit || 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          currentViewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}>
          {sortedProducts.map((product) => (
            currentViewMode === 'grid' ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductListItem key={product.id} product={product} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {filters.search || filters.category !== 'all' 
              ? 'Try adjusting your filters or search terms.'
              : 'No products available at the moment.'}
          </p>
        </div>
      )}
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-yellow-500 text-white">Featured</Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {product.short_description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.compare_price!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating (placeholder) */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.5) • 120 reviews</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="sm">
              Quick View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Link href={`/product/${product.slug}`}>
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </Link>
            
            {product.featured && (
              <Badge className="absolute top-1 left-1 bg-yellow-500 text-white text-xs">
                Featured
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
              </Button>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.compare_price!.toLocaleString()}
                  </span>
                  <Badge className="bg-red-500 text-white text-xs">
                    {discountPercent}% OFF
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5) • 120 reviews</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="bg-primary hover:bg-primary/90">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline">
                Quick View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductGrid