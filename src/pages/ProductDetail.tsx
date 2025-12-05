import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Award, Recycle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { normalizePrice, formatCurrency } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CartDrawer } from '@/components/CartDrawer';
import productsData from '@/data/products.json';
import { useState } from 'react';
// LiquidEther is rendered globally via the app layout

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const product = productsData.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/buyer')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: normalizePrice(product.price),
      currency: product.currency,
      image: product.image,
    });
    toast.success(`${product.title} added to cart! 🎉`);
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background effect */}
      {/* Background is provided globally */}
      {/* Header */}
      <header className="border-b border-primary/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <Button variant="ghost" onClick={() => navigate('/buyer')} className="text-foreground hover:bg-foreground/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <CartDrawer />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="container py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Product Image */}
          <div>
            <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-foreground/5">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-background/80 border-primary/10 hover:bg-background"
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
                }}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${
                    isFavorite ? 'fill-primary text-primary' : 'text-foreground'
                  }`} 
                />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-primary/20 bg-primary/5 text-sm font-medium">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold font-playfair">{product.title}</h1>
              <p className="text-foreground/60 text-lg">{product.short}</p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-primary/10 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  د.إ {formatCurrency(normalizePrice(product.price))}
                </span>
                <span className="text-foreground/60">AED</span>
              </div>
            </div>

            {/* Sustainability Score */}
            <div className="border border-primary/10 rounded-lg p-6 bg-background/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Sustainability Score</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">{product.eco_score}</div>
                <div className="flex-1">
                  <div className="h-3 border border-primary/20 rounded-full overflow-hidden bg-foreground/5">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${product.eco_score}%` }}
                    />
                  </div>
                  <p className="text-sm text-foreground/60 mt-2">
                    {product.eco_score >= 90
                      ? 'Excellent choice!'
                      : product.eco_score >= 80
                      ? 'Great option'
                      : 'Good choice'}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Eco-Friendly */}
            <div className="border border-primary/10 rounded-lg p-6 bg-background/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Recycle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Why It's Eco-Friendly</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">{product.eco_reason}</p>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} size="lg" className="w-full bg-primary text-background hover:bg-primary/90 font-semibold h-12 rounded-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
