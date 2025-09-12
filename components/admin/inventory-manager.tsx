"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Package, AlertTriangle, Plus, Minus, Search, TrendingUp, TrendingDown } from "lucide-react"

interface InventoryItem {
  id: string
  product_id: string
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  track_inventory: boolean
  updated_at: string
  products?: {
    id: string
    name: string
    sku: string
    price: number
  }
}

interface InventoryAdjustment {
  product_id: string
  quantity_change: number
  adjustment_type: 'restock' | 'sale' | 'damage' | 'manual'
  reason: string
}

export const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLowStock, setShowLowStock] = useState(false)
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  
  const [adjustmentData, setAdjustmentData] = useState<InventoryAdjustment>({
    product_id: '',
    quantity_change: 0,
    adjustment_type: 'manual',
    reason: ''
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchInventory()
  }, [showLowStock])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (showLowStock) {
        params.append('low_stock', 'true')
      }
      
      const response = await fetch(`/api/inventory?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      } else {
        setInventory([])
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem || adjustmentData.quantity_change === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid quantity change.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedItem.product_id,
          quantity_change: adjustmentData.quantity_change,
          adjustment_type: adjustmentData.adjustment_type,
          reason: adjustmentData.reason
        }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        
        setInventory(prev => prev.map(item => 
          item.product_id === selectedItem.product_id 
            ? { ...item, quantity: updatedItem.quantity, updated_at: updatedItem.updated_at }
            : item
        ))
        
        toast({
          title: 'Inventory Updated',
          description: `Stock adjusted by ${adjustmentData.quantity_change} units.`,
        })

        setIsAdjustmentDialogOpen(false)
        resetAdjustmentForm()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to adjust inventory')
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error)
      toast({
        title: 'Adjustment Failed',
        description: error instanceof Error ? error.message : 'Failed to adjust inventory.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetAdjustmentForm = () => {
    setAdjustmentData({
      product_id: '',
      quantity_change: 0,
      adjustment_type: 'manual',
      reason: ''
    })
    setSelectedItem(null)
  }

  const openAdjustmentDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentData({
      product_id: item.product_id,
      quantity_change: 0,
      adjustment_type: 'manual',
      reason: ''
    })
    setIsAdjustmentDialogOpen(true)
  }

  const getStockStatus = (item: InventoryItem) => {
    const availableStock = item.quantity - item.reserved_quantity
    
    if (availableStock <= 0) {
      return { status: 'out-of-stock', label: 'Out of Stock', color: 'bg-red-500' }
    } else if (availableStock <= item.low_stock_threshold) {
      return { status: 'low-stock', label: 'Low Stock', color: 'bg-yellow-500' }
    } else {
      return { status: 'in-stock', label: 'In Stock', color: 'bg-green-500' }
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.products?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalProducts = inventory.length
  const lowStockCount = inventory.filter(item => {
    const availableStock = item.quantity - item.reserved_quantity
    return availableStock <= item.low_stock_threshold && availableStock > 0
  }).length
  const outOfStockCount = inventory.filter(item => {
    const availableStock = item.quantity - item.reserved_quantity
    return availableStock <= 0
  }).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage product stock levels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">{totalProducts - lowStockCount - outOfStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={() => setShowLowStock(!showLowStock)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {showLowStock ? 'Show All' : 'Low Stock Only'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading inventory...</div>
            ) : filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item)
                const availableStock = item.quantity - item.reserved_quantity
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold">{item.products?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.products?.sku} | Price: ₹{item.products?.price.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`${stockStatus.color} text-white`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Stock</p>
                        <p className="font-semibold">{item.quantity}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="font-semibold">{availableStock}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Reserved</p>
                        <p className="font-semibold">{item.reserved_quantity}</p>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => openAdjustmentDialog(item)}
                      >
                        Adjust Stock
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
                <p className="text-gray-500">
                  {searchTerm || showLowStock
                    ? 'Try adjusting your filters.'
                    : 'Inventory items will appear here when products are created.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
            <DialogDescription>
              Adjust stock levels for {selectedItem?.products?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAdjustment} className="space-y-4">
            <div>
              <Label htmlFor="adjustment_type">Adjustment Type</Label>
              <Select 
                value={adjustmentData.adjustment_type} 
                onValueChange={(value: any) => setAdjustmentData(prev => ({ ...prev, adjustment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="damage">Damage/Loss</SelectItem>
                  <SelectItem value="manual">Manual Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity_change">Quantity Change</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentData(prev => ({ ...prev, quantity_change: prev.quantity_change - 1 }))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity_change"
                  type="number"
                  value={adjustmentData.quantity_change}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity_change: Number(e.target.value) }))}
                  placeholder="0"
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentData(prev => ({ ...prev, quantity_change: prev.quantity_change + 1 }))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use positive numbers to increase stock, negative to decrease
              </p>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Reason for adjustment..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adjusting...' : 'Adjust Stock'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InventoryManager