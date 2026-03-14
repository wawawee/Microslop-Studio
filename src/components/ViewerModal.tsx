import { GeneratedFrame } from '../types';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  frame: GeneratedFrame | null;
  onClose: () => void;
}

export function ViewerModal({ frame, onClose }: Props) {
  if (!frame) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-stone-200 border-8 border-stone-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[16px_16px_0px_0px_rgba(28,25,23,1)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b-4 border-stone-800 bg-stone-900 text-stone-100">
            <h3 className="font-mono font-bold uppercase tracking-widest text-lg">
              Scene {frame.sceneId} - {frame.engine.toUpperCase()} Render
            </h3>
            <div className="flex gap-4">
              <a 
                href={frame.imageUrl} 
                download={`microslop-scene-${frame.sceneId}.png`}
                className="flex items-center gap-2 bg-[#0078D4] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center gap-6 bg-stone-300 relative crt-overlay">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <img 
              src={frame.imageUrl} 
              alt={`Scene ${frame.sceneId}`} 
              className="max-w-full max-h-[60vh] object-contain border-8 border-stone-100 shadow-2xl grayscale contrast-125 sepia-[.2]"
              referrerPolicy="no-referrer"
            />
            
            <div className="w-full bg-stone-900 text-stone-100 p-4 rounded-xl border-4 border-stone-800">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Prompt Used</h4>
              <p className="font-mono text-sm leading-relaxed">{frame.prompt}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
