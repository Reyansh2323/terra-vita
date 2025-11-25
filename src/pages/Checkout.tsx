import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

export default function Checkout() {
  const { items, total, itemCount, clearCart } = useCart();
  const [selectedCard, setSelectedCard] = useState('test-4242');
  const navigate = useNavigate();

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any | null>(null);

  const handlePlaceOrder = async () => {
    // Assume the user is authenticated, get session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      // Redirect to auth
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      // nothing to order
      return;
    }

    // Generate a random order number and ETA (1-3 days)
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const etaDays = Math.floor(1 + Math.random() * 3);
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + etaDays);

    try {
      // Insert one row per cart item into orders table
      const ordersToInsert = items.map(item => ({
        buyer_id: userId,
        seller_id: item.seller_id || null,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price || 0,
        status: 'pending',
        tracking_notes: `Order No: ${orderNumber} - ETA: ${etaDays} days`,
      }));

      const { data: inserted, error } = await supabase.from('orders').insert(ordersToInsert).select();

      if (error) {
        console.error('Failed to insert orders', error);
        return;
      }

      // On success, clear cart, show confirmation modal
      setOrderInfo({ orderNumber, etaDays, etaDate, inserted });
      setOrderModalOpen(true);
      clearCart();
    } catch (err) {
      console.error('Checkout error', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Payment</h2>
          <Card className="p-4">
            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="card"
                  checked={selectedCard === 'test-4242'}
                  onChange={() => setSelectedCard('test-4242')}
                />
                <span className="font-medium">Test Card •••• 4242</span>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Cardholder Name</label>
              <Input placeholder="Jane Doe" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Expiry</label>
                <Input placeholder="02/28" />
              </div>
              <div>
                <label className="block text-sm font-medium">CVC</label>
                <Input placeholder="424" />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({itemCount})</span>
                <span className="font-semibold">د.إ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span>
                  {selectedCard === 'test-4242' ? 'Test Card •••• 4242' : '•••• 4242'}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={handlePlaceOrder} className="w-full">Place order</Button>
            </div>
          </Card>
        </div>
      </div>
      {orderInfo && (
        <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Placed</DialogTitle>
              <DialogDescription>Your order has been placed and is being processed.</DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <p className="font-semibold">Order No: {orderInfo.orderNumber}</p>
              <p>Estimated delivery: {orderInfo.etaDays} day(s) (around {orderInfo.etaDate.toDateString()})</p>
              <p className="text-sm text-foreground/60 mt-2">We saved the order in your account. You can view previous orders in your Account.</p>
            </div>
            <DialogFooter>
              <Button onClick={() => { setOrderModalOpen(false); navigate('/orders'); }}>View Orders</Button>
              <Button variant="outline" onClick={() => setOrderModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
