'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/use-supabase';
import { generateOrderNumber } from '@/lib/supabase';
import { ShoppingCart, Package, CreditCard, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order, OrderItem, ShippingAddress } from '@/lib/supabase';

interface CheckoutProps {
  userId: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  onOrderSuccess?: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  userId,
  cartItems,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    name: '',
    mobile: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const { createOrder, loading } = useOrders(userId);
  const { toast } = useToast();

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleShippingSubmit = () => {
    if (!shippingInfo.name || !shippingInfo.mobile || !shippingInfo.address_line_1 || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required shipping details',
        variant: 'destructive',
      });
      return;
    }
    setStep(2);
  };

  const handleOrderSubmit = async () => {
    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    const orderNumber = generateOrderNumber();
    
    const orderData: Partial<Order> = {
      user_id: userId,
      order_number: orderNumber,
      status: 'pending',
      total_amount: totalAmount,
      payment_status: 'pending',
      payment_method: paymentMethod,
      shipping_address: shippingInfo,
    };

    const order = await createOrder(orderData);
    
    if (order) {
      // Create order items
      const { db } = await import('@/lib/supabase');
      const orderItems: Partial<OrderItem>[] = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image || '',
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      await db.orderItems.create(orderItems);
      
      onOrderSuccess?.(order);
      setStep(3);
    }
  };

  const renderShippingForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Shipping Information</span>
        </CardTitle>
        <CardDescription>
          Enter your delivery address details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={shippingInfo.name}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={shippingInfo.mobile}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="+91 9999999999"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address1">Address Line 1 *</Label>
          <Input
            id="address1"
            value={shippingInfo.address_line_1}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, address_line_1: e.target.value }))}
            placeholder="House/Flat number, Street name"
          />
        </div>
        
        <div>
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            value={shippingInfo.address_line_2}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, address_line_2: e.target.value }))}
            placeholder="Landmark, Area"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Mumbai"
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
              placeholder="Maharashtra"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={shippingInfo.pincode}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))}
              placeholder="400001"
            />
          </div>
        </div>
        
        <Button onClick={handleShippingSubmit} className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a]">
          Continue to Payment
        </Button>
      </CardContent>
    </Card>
  );

  const renderPaymentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment Method</span>
        </CardTitle>
        <CardDescription>
          Choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map((method) => (
            <label key={method} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-[#ff8fab]"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total: ₹{totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setStep(1)} 
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleOrderSubmit} 
              disabled={loading}
              className="flex-1 bg-[#ff8fab] hover:bg-[#ff7a9a]"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOrderSuccess = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <Package className="w-5 h-5" />
          <span>Order Placed Successfully!</span>
        </CardTitle>
        <CardDescription>
          Thank you for your purchase. Your order is being processed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 font-medium">
            Your order has been placed and you will receive a confirmation email shortly.
          </p>
        </div>
        
        <div className="space-y-2">
          <p><strong>Total Amount:</strong> ₹{totalAmount.toLocaleString()}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Delivery Address:</strong></p>
          <div className="pl-4 text-sm text-gray-600">
            <p>{shippingInfo.name}</p>
            <p>{shippingInfo.address_line_1}</p>
            {shippingInfo.address_line_2 && <p>{shippingInfo.address_line_2}</p>}
            <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
          </div>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/account'} 
          className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a]"
        >
          View Order Status
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Progress */}
      <div className="flex items-center space-x-4 mb-6">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber ? 'bg-[#ff8fab] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-0.5 ${
                step > stepNumber ? 'bg-[#ff8fab]' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && renderShippingForm()}
      {step === 2 && renderPaymentForm()}
      {step === 3 && renderOrderSuccess()}
    </div>
  );
};