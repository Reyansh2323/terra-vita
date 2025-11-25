import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recycle, Loader2, Leaf, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChatButton } from "@/components/AIChatButton";
import AccountMenu from '@/components/AccountMenu';
import SplitTitle from "@/components/SplitTitle";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";
// LiquidEther is rendered globally via the app layout

const fallbackProducts = [
    {
    id: '1',
    name: 'Bamboo Toothbrush Set',
    price: 299,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1585412459556-6b5e3b3d8f5a?w=500&h=500&fit=crop',
    tags: ['personal-care'],
    sustainability_score: 95
  },
    {
    id: '2',
    name: 'Eco Water Bottle',
    price: 1299,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7e36dd5f7746?w=500&h=500&fit=crop',
    tags: ['accessories'],
    sustainability_score: 90
  },
    {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 599,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    tags: ['clothing'],
    sustainability_score: 88
  },
    {
    id: '4',
    name: 'Solar Phone Charger',
    price: 1999,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop',
    tags: ['tech'],
    sustainability_score: 92
  },
    {
    id: '5',
    name: 'Compostable Phone Case',
    price: 399,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1574531446910-a100fec00891?w=500&h=500&fit=crop',
    tags: ['tech'],
    sustainability_score: 87
  },
    {
    id: '6',
    name: 'Reusable Lunch Container',
    price: 499,
      currency: 'AED',
    image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
    tags: ['kitchen'],
    sustainability_score: 93
  }
];

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(50);
  const { addItem } = useCart();
  const catalogRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('is_active', true);
        
        if (error || !data || data.length === 0) {
          console.error('Error fetching products:', error);
          // Use fallback products
          setProducts(fallbackProducts);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts(fallbackProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);



  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Signed out successfully");
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image_url,
    });
    setPoints(points + 10);
    toast.success(`${product.name} added! +10 EcoPoints earned 🎉`);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const allTags = products.flatMap(p => p.tags || []);
  const categories = ["all", ...Array.from(new Set(allTags))];
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(p => p.tags?.includes(activeTab));

  return (
    <div className="min-h-screen bg-transparent text-foreground relative overflow-hidden">
      {/* Background is provided globally */}
      <div className="relative overflow-hidden">
        {/* Background is provided globally via App.tsx and CSS variables */}

        <div className="relative z-40">
        {/* Header */}
        <header className="border-b border-primary/10 backdrop-blur-sm">
          <div className="container py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <img src="/placeholder.svg" alt="Terra Vitta icon" className="h-5 w-5 rounded-md" />
                </div>
              <div>
                <h1 className="text-xl font-bold font-playfair text-foreground">EcoMart</h1>
                <p className="text-xs text-foreground/60">EcoPoints: <span className="text-primary font-semibold">{points}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 z-50">
              <ThemeToggle />
              <AIChatButton />
              <CartDrawer />
              <AccountMenu />
            </div>
          </div>
        </header>

        <main className="container py-12 relative z-10">
          {/* Hero Section */}
          <section className="py-12 text-center space-y-6 mb-16">
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium">
                <Leaf className="h-4 w-4 text-primary" />
                <span>Sustainable Marketplace</span>
              </div>
              
              <SplitTitle
                text="Shop with Purpose"
                className="text-5xl md:text-6xl"
                highlight="Purpose"
              />
              
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Every purchase supports sustainability. Discover eco-friendly products and earn EcoPoints.
              </p>
              
              <Button 
                onClick={scrollToCatalog}
                size="lg"
                className="text-base px-8 h-12 rounded-lg font-semibold bg-primary text-background hover:bg-primary/90 pop-in"
              >
                Explore Products
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Product Catalog */}
          <section ref={catalogRef} className="pb-20">
            <div className="text-center mb-12 space-y-3">
              <h3 className="text-4xl font-bold font-playfair">Product Catalog</h3>
              <p className="text-lg text-foreground/60">Browse our curated selection of sustainable products</p>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="border border-primary/20 w-full justify-center gap-2 p-2 bg-primary/5">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="rounded-md data-[state=active]:bg-primary/20 data-[state=active]:text-foreground font-medium capitalize text-sm"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(cat => (
                <TabsContent key={cat} value={cat} className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                      <div className="col-span-full flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="col-span-full text-center py-12 text-foreground/60">
                        No products found in this category
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="border border-primary/10 rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm hover:border-primary/20 hover:bg-background/60 transition-all duration-200 pop-in"
                        >
                          <div className="aspect-square overflow-hidden bg-foreground/5">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                              <p className="text-sm text-foreground/60 capitalize">{product.tags?.[0] || 'Product'}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground/60 font-medium">Sustainability</span>
                                <span className="font-bold text-primary">
                                  {product.sustainability_score}%
                                </span>
                              </div>
                              <div className="flex-1 bg-foreground/10 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-primary h-full rounded-full transition-all"
                                  style={{ width: `${product.sustainability_score}%` }}
                                />
                              </div>
                            </div>
                            
                              <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                              <span className="text-2xl font-bold text-foreground">
                                د.إ {product.price.toFixed(2)}
                              </span>
                              <Button 
                                onClick={() => handleAddToCart(product)}
                                className="text-sm h-10 bg-primary text-background hover:bg-primary/90 font-semibold"
                                size="sm"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/10 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                    <Recycle className="h-5 w-5 text-background" />
                  </div>
                  {/* removed trademark footer text */}
                </div>
              <div className="flex items-center gap-6 text-sm text-foreground/60 font-medium">
                <button
                  onClick={() => window.location.href = '/landing#about'}
                  className="hover:text-foreground transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => window.location.href = '/landing#impact'}
                  className="hover:text-foreground transition-colors"
                >
                  Sustainability
                </button>
                <button
                  className="hover:text-foreground transition-colors"
                >
                  Community
                </button>
                <button
                  onClick={() => window.location.href = '/landing#contact'}
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
