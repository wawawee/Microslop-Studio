import { motion } from 'motion/react';
import { Paperclip } from 'lucide-react';

export function Clippy() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-12 right-12 z-50 flex items-end gap-4"
    >
      <div className="bg-yellow-100 border-2 border-stone-800 p-4 rounded-2xl rounded-br-none shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] max-w-xs relative text-stone-900">
        <p className="font-mono text-sm font-bold pr-4">
          It looks like your system crashed! Would you like me to replace your unsaved work with a Bing search bar?
        </p>
        <div className="mt-3 flex gap-2">
          <button className="bg-stone-800 text-stone-100 text-xs px-3 py-1 rounded font-bold uppercase hover:bg-stone-700">
            Yes
          </button>
          <button className="bg-stone-800 text-stone-100 text-xs px-3 py-1 rounded font-bold uppercase hover:bg-stone-700">
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
  );
}
