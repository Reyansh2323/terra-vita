import { useState, useRef } from "react";
import { Send, Loader2, Camera, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from '@/lib/utils';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  text: string;
  sender: 'user' | 'bot';
  products?: any[];
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (userMessage?: string, matchedProducts?: any[]) => {
    const messageText = userMessage || input;
    if (!messageText.trim() || loading) return;
    
    const userMsg: Message = {
      text: messageText,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      // Use the Supabase Functions SDK to invoke the 'chat' function.
      // Add retry logic (up to 3 attempts with exponential backoff)
      let attempt = 0;
      let result: any = null;
      const maxAttempts = 3;
      const payload = { message: messageText, matchedProducts: matchedProducts || undefined };

      while (attempt < maxAttempts) {
        try {
          const { data, error } = await supabase.functions.invoke('chat', {
            body: JSON.stringify(payload),
          });

          if (error) throw error;
          result = data;
          break; // success
        } catch (err) {
          attempt += 1;
          const delay = Math.pow(2, attempt) * 150;
          console.warn(`Chat attempt ${attempt} failed. Retrying in ${delay}ms`, err);
          await new Promise(res => setTimeout(res, delay));
        }
      }

      if (!result) {
        throw new Error('Failed to get response from chat function after retries');
      }

      if (result?.success) {
        setMessages(prev => [...prev, {
          text: result.reply,
          sender: 'bot',
          products: matchedProducts
        }]);
      } else {
        throw new Error(result?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleScanReceipt = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setScanning(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Call OCR edge function
        const { data: result, error } = await supabase.functions.invoke('scan-receipt', {
          body: JSON.stringify({ imageBase64: base64Image })
        });
        
        if (!error && result?.success) {
          const scanMsg: Message = {
            text: `I scanned this receipt - please help me find matching products`,
            sender: 'user'
          };
          setMessages(prev => [...prev, scanMsg]);

          if (result.matchedProducts && result.matchedProducts.length > 0) {
            await handleSend(
              `I scanned a receipt and found ${result.totalMatches} matching products. Can you show me what you found?`,
              result.matchedProducts
            );
          } else {
            setMessages(prev => [...prev, {
              text: "I couldn't find any matching products from your receipt in our store. Try asking me about specific items!",
              sender: 'bot'
            }]);
          }
        } else {
          toast.error(result?.error || error?.message || 'Failed to scan receipt');
        }
        
        setScanning(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan receipt');
      setScanning(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-full glass-heavy">
      {/* Header */}
      <div className="p-6 border-b glass-light backdrop-blur-xl">
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">Terra Vitta AI</h3>
            <p className="text-sm text-muted-foreground font-medium">Your sustainability assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Welcome to Terra Vitta AI</span>
            </div>
            <p className="text-base font-medium">Ask me anything about sustainable products!</p>
            <p className="text-sm">Or scan a receipt to get eco-friendly alternatives.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600 dark:text-white text-background'
                  : 'glass-panel'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.products.map((product: any) => (
                    <div key={product.id} className="glass-light rounded-xl p-3 text-xs space-y-1">
                      <p className="font-bold text-base">{product.name}</p>
                      <p className="text-muted-foreground">د.إ {formatCurrency(product.price)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-panel rounded-2xl px-5 py-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t glass-light backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleScanReceipt}
            disabled={loading || scanning}
            className="shrink-0 glass-button h-12 w-12 rounded-xl transition-spring hover:scale-105"
          >
            <Camera className="w-5 h-5" />
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading || scanning}
            className="flex-1 glass-panel h-12 text-base rounded-xl transition-spring focus:scale-[1.01]"
          />

          <Button
            type="submit"
            disabled={!input.trim() || loading}
            size="icon"
            className="shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-spring hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};