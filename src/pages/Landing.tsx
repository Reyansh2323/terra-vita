import { useNavigate } from "react-router-dom";
import { Search, Leaf, ShoppingBag, Users, Recycle, Sun, Moon, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountMenu from '@/components/AccountMenu';
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { EdgeDoodles } from "@/components/EdgeDoodles";
import SplitTitle from "@/components/SplitTitle";
// LiquidEther is rendered globally via the app layout

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [swapCount, setSwapCount] = useState(0);
  const [ecoImpact, setEcoImpact] = useState(0);

  useEffect(() => {
    const swapInterval = setInterval(() => {
      setSwapCount(prev => (prev < 12847 ? prev + 127 : 12847));
    }, 50);
    
    const impactInterval = setInterval(() => {
      setEcoImpact(prev => (prev < 8532 ? prev + 85 : 8532));
    }, 50);

    return () => {
      clearInterval(swapInterval);
      clearInterval(impactInterval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/buyer");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative overflow-hidden">
      {/* Liquid Ether Background is provided globally */}

      {/* Minimal Edge Doodles */}
      <EdgeDoodles position="all" opacity={0.15} animated={false} />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Header - Simple and Clean */}
        <header className="border-b border-primary/10 backdrop-blur-sm">
          <div className="container py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg" alt="Terra Vitta icon" className="h-8 w-8 rounded-full" />
                <span className="text-2xl font-bold font-playfair text-primary">
                  EcoMart
                </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-primary/10 rounded-full transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <AccountMenu />
            </div>
          </div>
        </header>

        {/* Hero Section - Minimalist */}
        <section id="home" className="container py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-semibold text-primary">Sustainable Marketplace</span>
              </div>
              
              <div className="pop-in">
              <SplitTitle
                text="Shop with Purpose"
                className="text-5xl md:text-6xl lg:text-7xl"
                highlight="Purpose"
              />
              </div>
              
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Every purchase supports sustainability. Discover eco-friendly products and earn EcoPoints for making conscious choices.
              </p>
            </div>

            {/* Impact Counters */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pop-in">
              <div className="glass-panel rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{swapCount.toLocaleString()}</div>
                <div className="text-sm text-foreground/60">Swaps Active</div>
              </div>
              <div className="glass-panel rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{ecoImpact.toLocaleString()}</div>
                <div className="text-sm text-foreground/60">kg CO₂ Saved</div>
              </div>
              </div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Search sustainable products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-panel pl-12 pr-5 h-14 text-base rounded-lg border-0 w-full"
                />
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="btn-glow bg-primary hover:bg-primary/90 text-black font-semibold px-8 h-12 pop-in"
                onClick={() => navigate("/buyer")}
              >
                <Recycle className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="glass-button px-8 h-12 font-semibold pop-in"
                onClick={() => navigate("/buyer")}
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="about" className="border-t border-primary/10 py-20">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold font-playfair text-center mb-16">How It Works</h2>
            
            <div className="space-y-8">
              {[
                {
                  number: "01",
                  title: "Browse Products",
                  description: "Explore our curated selection of eco-friendly items from sustainable sellers."
                },
                {
                  number: "02",
                  title: "Make a Purchase",
                  description: "Checkout securely and support sustainable practices with every transaction."
                },
                {
                  number: "03",
                  title: "Earn EcoPoints",
                  description: "Accumulate points and track your environmental impact in real-time."
                }
              ].map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="text-5xl font-bold font-playfair text-primary/20 min-w-20">{step.number}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-foreground/60">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="border-t border-primary/10 py-20 bg-primary/5">
          <div className="container max-w-3xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl font-bold font-playfair mb-6">Your Impact Matters</h2>
              <p className="text-lg text-foreground/70">By choosing sustainable, you're part of a global movement toward a circular economy.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "2.5M", description: "Items Saved" },
                { label: "8.5K", description: "CO₂ Prevented" },
                { label: "50K+", description: "Community Members" }
              ].map((stat) => (
                <div key={stat.label} className="glass-panel rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.label}</div>
                  <div className="text-sm text-foreground/60">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials/Features Section */}
        <section id="contact" className="border-t border-primary/10 py-20">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold font-playfair text-center mb-16">Why EcoMart?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Leaf, title: "100% Sustainable", desc: "All sellers verified for eco-friendliness" },
                { icon: Globe, title: "Global Impact", desc: "Support sustainability worldwide" },
                { icon: Heart, title: "Fair Pricing", desc: "Transparent pricing with fair margins" },
                { icon: ShoppingBag, title: "Quality Items", desc: "Curated selection of premium products" }
              ].map((feature) => (
                <div key={feature.title} className="glass-panel rounded-lg p-8 text-center space-y-4">
                  <feature.icon className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="border-t border-primary/10 py-20">
          <div className="container max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-playfair">Ready to Make an Impact?</h2>
              <p className="text-lg text-foreground/70">Join thousands of conscious shoppers building a sustainable future.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="btn-glow bg-primary hover:bg-primary/90 text-black font-semibold px-8 h-12"
                onClick={() => navigate("/auth")}
              >
                Join Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="glass-button px-8 h-12 font-semibold"
                onClick={() => navigate("/buyer")}
              >
                Explore Products
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12 bg-background/50 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Recycle className="h-6 w-6 text-primary" />
                {/* Footer trademark removed as requested */}
              </div>
            <div className="flex items-center gap-6 text-sm text-foreground/60">
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-primary transition-colors"
              >
                About
              </button>
              <button
                onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-primary transition-colors"
              >
                Impact
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-primary transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
