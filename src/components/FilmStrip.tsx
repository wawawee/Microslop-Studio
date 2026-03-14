import { GeneratedFrame } from '../types';
import { motion } from 'motion/react';
import { Download, Trash2, Maximize2 } from 'lucide-react';

interface Props {
  frames: GeneratedFrame[];
  onDelete: (id: string) => void;
  onView: (frame: GeneratedFrame) => void;
}

export function FilmStrip({ frames, onDelete, onView }: Props) {
  if (frames.length === 0) {
    return (
      <div className="h-48 border-t-4 border-stone-800 bg-stone-900 text-stone-500 flex items-center justify-center font-mono uppercase tracking-widest text-sm">
        No frames generated yet. The reel is empty.
      </div>
    );
  }

  return (
    <div className="h-56 border-t-4 border-stone-800 bg-stone-900 p-4 overflow-x-auto flex gap-4 items-center crt-overlay relative">
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Film strip holes top */}
      <div className="absolute top-1 left-0 right-0 h-3 flex gap-2 overflow-hidden opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={`top-${i}`} className="w-4 h-3 bg-stone-100 rounded-sm shrink-0" />
        ))}
      </div>
      
      {/* Film strip holes bottom */}
      <div className="absolute bottom-1 left-0 right-0 h-3 flex gap-2 overflow-hidden opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={`bottom-${i}`} className="w-4 h-3 bg-stone-100 rounded-sm shrink-0" />
        ))}
      </div>

      <div className="flex gap-6 px-4 py-4 z-10 h-full items-center">
        {frames.map((frame) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group shrink-0 h-36 w-64 border-4 border-stone-100 rounded-lg overflow-hidden bg-stone-800 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <img 
              src={frame.imageUrl} 
              alt={`Scene ${frame.sceneId}`} 
              className="w-full h-full object-cover grayscale contrast-125 sepia-[.2]" 
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <span className="text-stone-100 font-mono text-xs font-bold uppercase tracking-widest">
                Scene {frame.sceneId}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onView(frame)}
                  className="p-2 bg-stone-100 text-stone-900 rounded-full hover:bg-stone-300 transition-colors"
                  title="View Full"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <a 
                  href={frame.imageUrl} 
                  download={`microslop-scene-${frame.sceneId}.png`}
                  className="p-2 bg-[#0078D4] text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => onDelete(frame.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-1 right-1 bg-stone-900/80 text-stone-100 text-[10px] font-mono px-1 rounded">
              {frame.engine.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
