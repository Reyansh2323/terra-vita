import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '@/pages/Checkout';
import { supabase } from '@/integrations/supabase/client';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { vi } from 'vitest';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', async () => {
  const supabase = {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user' } } } })),
    },
    from: vi.fn(() => ({ insert: vi.fn(() => ({ select: vi.fn(() => Promise.resolve({ data: [{ id: 'order1' }], error: null })) })) })),
  } as any;
  return { supabase };
});

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: [{ id: 'prod-1', title: 'Test Product', price: 10, currency: 'AED', quantity: 1 }],
    total: 10,
    itemCount: 1,
    clearCart: vi.fn(),
    addItem: vi.fn(),
  })
}));

describe('Checkout', () => {
  it('inserts orders into supabase and shows confirmation', async () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Add an item to the cart
    const addButtons = await screen.findAllByRole('button', { name: /place order/i }).catch(() => []);
    // If the button is present, click it
    const placeBtn = screen.getByRole('button', { name: /place order/i });
    await userEvent.click(placeBtn);

    // After clicking, the order dialog should appear
    const title = await screen.findByText(/Order Placed/i);
    expect(title).toBeInTheDocument();

    // assert that insert was called on the mocked supabase
    expect((supabase as any).from).toHaveBeenCalled();
  });
});
