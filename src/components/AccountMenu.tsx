import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export const AccountMenu = () => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchUser());
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => navigate('/orders')}>Previous Orders</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/auth')}>Account</DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
