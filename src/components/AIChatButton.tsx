import { useState, useRef, useEffect } from "react";
import { Chatbot } from "./Chatbot";

export const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // focus input inside Chatbot when opened (Chatbot handles own focus) - small timeout for animation
      setTimeout(() => inputRef.current?.focus(), 360);
    }
  }, [isOpen]);

  return (
    <>
      {/* Collapsed bottom-center "Ask AI" bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-3xl px-4 pointer-events-none">
        <div className="pointer-events-auto">
          {!isOpen ? (
            <div className="mx-auto bg-background/40 glass-panel backdrop-blur-lg rounded-full px-4 py-3 shadow-xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                 onClick={() => setIsOpen(true)}
                 role="button"
                 aria-label="Open AI chat">
              <div className="h-8 w-8 rounded-lg bg-primary/90 flex items-center justify-center text-background font-bold">AI</div>
              <div className="flex-1 text-sm text-foreground/70">Ask AI</div>
              <div className="text-xs text-foreground/50">Chat</div>
            </div>
          ) : (
            <div className="mx-auto w-full bg-background/40 backdrop-blur-xl glass-heavy rounded-3xl shadow-2xl transition-all duration-500 transform scale-100">
              <div className="flex items-center justify-between p-3 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">AI</div>
                  <div className="text-sm font-semibold">Terra Vitta AI</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Close</button>
                </div>
              </div>

              <div className="h-[60vh] max-h-[calc(100vh-8rem)] overflow-hidden rounded-b-3xl">
                <Chatbot />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
