import { Button } from "@/components/ui/button";
import { Package, Plus, ShoppingBag, LogOut, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// LiquidEther is rendered globally via the app layout

const SellerDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background effect */}
      {/* Background is provided globally */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="border-b border-primary/10 pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <img src="https://storage.googleapis.com/gpt-engineer-file-uploads/XkL04eRZzUTW6aT2tLMIZD0HlTS2/uploads/1762161615259-d8a4d64a-a82e-41f6-8fec-9a16fe9fe5c1-1_all_2645.jpg" alt="Terra Vitta icon" className="h-6 w-6 rounded-md object-cover" />
                </div>
                <h1 className="text-3xl font-bold font-playfair">Seller Dashboard</h1>
              </div>
              <p className="text-foreground/60">List. Deliver. Earn.</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="text-foreground border-primary/20 hover:bg-foreground/10">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="border border-primary/10 rounded-lg p-6 bg-background/40 backdrop-blur-sm">
            <p className="text-foreground/60 text-sm mb-2">Active Listings</p>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>

          <div className="border border-primary/10 rounded-lg p-6 bg-background/40 backdrop-blur-sm">
            <p className="text-foreground/60 text-sm mb-2">Pending Orders</p>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>

          <div className="border border-primary/10 rounded-lg p-6 bg-background/40 backdrop-blur-sm">
            <p className="text-foreground/60 text-sm mb-2">Points Earned</p>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-primary/10 rounded-lg p-8 bg-background/40 backdrop-blur-sm hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-playfair">Create Listing</h3>
            </div>
            <p className="text-foreground/60 mb-6">
              Add a new eco-friendly product
            </p>
            <Button className="w-full bg-primary text-background hover:bg-primary/90 font-semibold h-10">
              New Product
            </Button>
          </div>

          <div className="border border-primary/10 rounded-lg p-8 bg-background/40 backdrop-blur-sm hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-playfair">Browse Suggestions</h3>
            </div>
            <p className="text-foreground/60 mb-6">
              See items suggested by scans
            </p>
            <Button variant="outline" className="w-full border-primary/20 text-foreground hover:bg-foreground/10 font-semibold h-10">
              View Suggestions
            </Button>
          </div>
        </div>

        {/* My Listings */}
        <div className="border border-primary/10 rounded-lg p-8 bg-background/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold font-playfair">My Listings</h3>
          </div>
          <div className="text-center py-12 text-foreground/60">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No listings yet. Create your first product!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
