import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (error) {
        console.error('Failed to fetch order', error);
        return;
      }
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div className="container py-12">Loading...</div>;

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      <h1 className="text-2xl font-bold mt-6 mb-4">Order #{order.tracking_notes?.split(' - ')[0]?.replace('Order No: ', '') || order.id}</h1>
      <Card className="p-6">
        <div className="space-y-2">
          <div>Status: {order.status}</div>
          <div>Notes: {order.tracking_notes}</div>
          <div>Price: د.إ {formatCurrency(Number(order.price) || 0)}</div>
        </div>
      </Card>
    </div>
  );
}
