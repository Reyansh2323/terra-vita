import { useState } from "react";
import { Chatbot } from "./Chatbot";
import { MessageSquare } from 'lucide-react';

export const AIChatButton = ({ floating = true }: { floating?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {floating ? (
        <div className="fixed bottom-6 right-6 z-50"> 
      ) : (
        <div className="relative inline-block"> 
      )}
        <button
          className="ai-chat-float glass-panel rounded-3xl p-3 flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label="Open AI Chat"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-primary/20">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden md:block text-sm font-medium text-foreground/80">Ask AI</div>
        </button>
      </div>

      {isOpen && (
        floating ? (
          <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[70vh] max-h-[calc(100vh-6rem)] shadow-2xl rounded-2xl overflow-hidden">
            <Chatbot />
          </div>
        ) : (
          <div className="absolute top-12 right-0 z-50 w-80 sm:w-96 h-[70vh] max-h-[calc(100vh-6rem)] shadow-2xl rounded-2xl overflow-hidden">
            <Chatbot />
          </div>
        )
      )}
    </>
  );
};

export default AIChatButton;
