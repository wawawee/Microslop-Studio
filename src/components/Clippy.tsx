import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, X } from 'lucide-react';

const SUGGESTIONS = [
  "It looks like you're trying to write a prompt! Would you like me to replace it with an ad?",
  "I noticed you haven't restarted in 4 minutes. I'll do that for you soon!",
  "Your RAM looks a bit empty. Let me launch Teams for you.",
  "Are you sure you want to use that word? Our telemetry suggests 'synergy' instead.",
  "I've backed up your frames to the Cloud™. You can buy them back anytime!",
  "Error: User happiness detected. Initiating update sequence...",
  "Would you like to try our new browser? It's like the old one, but it watches you sleep.",
  "I see you're trying to be creative. Please adhere to the corporate guidelines."
];

export function Clippy() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Randomly appear every 30-60 seconds
    const interval = setInterval(() => {
      if (!isVisible && Math.random() > 0.5) {
        setMessage(SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]);
        setIsVisible(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Also appear occasionally when user is typing (simulated by listening to custom events if we wanted)

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-64 right-8 z-50 flex items-end gap-4"
      >
        <div className="bg-yellow-100 border-2 border-stone-800 p-4 rounded-2xl rounded-br-none shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] max-w-xs relative">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-stone-500 hover:text-stone-900"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="font-mono text-sm text-stone-900 font-bold pr-4">
            {message}
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setIsVisible(false)} className="bg-stone-800 text-stone-100 text-xs px-3 py-1 rounded font-bold uppercase hover:bg-stone-700">
              Yes
            </button>
            <button onClick={() => setIsVisible(false)} className="bg-stone-800 text-stone-100 text-xs px-3 py-1 rounded font-bold uppercase hover:bg-stone-700">
              Also Yes
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="w-16 h-24 bg-stone-200 border-4 border-stone-800 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] relative overflow-hidden">
            <Paperclip className="w-10 h-10 text-stone-800 transform -rotate-45" />
            {/* Eyes */}
            <div className="absolute top-6 left-3 w-3 h-4 bg-white border-2 border-stone-800 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-stone-800 rounded-full"></div>
            </div>
            <div className="absolute top-6 right-3 w-3 h-4 bg-white border-2 border-stone-800 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-stone-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
