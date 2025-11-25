import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.from('orders').select('*').eq('buyer_id', userId).order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to fetch orders', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Previous Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <Card className="p-6">You have no previous orders.</Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Order No: {order.tracking_notes?.split(' - ')[0]?.replace('Order No: ', '') || order.id}</div>
                  <div className="text-sm text-foreground/60">Status: {order.status}</div>
                  <div className="text-sm text-foreground/60">Notes: {order.tracking_notes}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">د.إ {Number(order.price).toFixed(2)}</div>
                  <div className="mt-2">
                    <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>View</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
