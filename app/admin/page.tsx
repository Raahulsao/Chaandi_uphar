"use client"

import React, { useState } from "react"
import { ProductManager } from "@/components/admin/product-manager"
import { InventoryManager } from "@/components/admin/inventory-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Boxes } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your jewelry store products and inventory</p>
        </div>
        
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Boxes className="w-4 h-4" />
              <span>Inventory</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <ProductManager />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <InventoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}