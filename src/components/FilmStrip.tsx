import { GeneratedFrame } from '../types';
import { motion } from 'motion/react';
import { Download, Trash2, Maximize2, Play, ArrowRightToLine, ArrowLeftToLine, Video } from 'lucide-react';

interface Props {
  frames: GeneratedFrame[];
  onDelete: (id: string) => void;
  onView: (frame: GeneratedFrame) => void;
  onSetFirstFrame: (url: string) => void;
  onSetLastFrame: (url: string) => void;
  onPlay: () => void;
}

export function FilmStrip({ frames, onDelete, onView, onSetFirstFrame, onSetLastFrame, onPlay }: Props) {
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
        <button 
          onClick={onPlay}
          className="shrink-0 h-36 w-36 border-4 border-[#0078D4] rounded-lg bg-stone-800 text-[#0078D4] hover:bg-[#0078D4] hover:text-white transition-colors flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,120,212,0.5)]"
        >
          <Play className="w-12 h-12 ml-2" />
          <span className="font-bold uppercase tracking-widest text-xs">Play Reel</span>
        </button>

        {frames.map((frame) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group shrink-0 h-36 w-64 border-4 border-stone-100 rounded-lg overflow-hidden bg-stone-800 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          >
            {frame.isVideo ? (
              <video 
                src={frame.imageUrl} 
                className="w-full h-full object-cover grayscale contrast-125 sepia-[.2]" 
                loop
                muted
                playsInline
                autoPlay
              />
            ) : (
              <img 
                src={frame.imageUrl} 
                alt={`Scene ${frame.sceneId}`} 
                className="w-full h-full object-cover grayscale contrast-125 sepia-[.2]" 
                referrerPolicy="no-referrer"
              />
            )}
            
            <div className="absolute inset-0 bg-stone-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <span className="text-stone-100 font-mono text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                {frame.isVideo && <Video className="w-3 h-3" />}
                Scene {frame.sceneId}
              </span>
              
              {!frame.isVideo && (
                <div className="flex gap-2 w-full justify-center">
                  <button 
                    onClick={() => onSetFirstFrame(frame.imageUrl)}
                    className="flex-1 py-1 bg-stone-700 text-stone-200 rounded hover:bg-stone-500 transition-colors flex items-center justify-center gap-1 text-[10px] font-bold uppercase"
                    title="Use as First Frame (Init Image)"
                  >
                    <ArrowRightToLine className="w-3 h-3" /> First
                  </button>
                  <button 
                    onClick={() => onSetLastFrame(frame.imageUrl)}
                    className="flex-1 py-1 bg-stone-700 text-stone-200 rounded hover:bg-stone-500 transition-colors flex items-center justify-center gap-1 text-[10px] font-bold uppercase"
                    title="Use as Last Frame (End Image)"
                  >
                    <ArrowLeftToLine className="w-3 h-3" /> Last
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => onView(frame)}
                  className="p-2 bg-stone-100 text-stone-900 rounded-full hover:bg-stone-300 transition-colors"
                  title="View Full"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <a 
                  href={frame.imageUrl} 
                  download={`microslop-scene-${frame.sceneId}.${frame.isVideo ? 'mp4' : 'png'}`}
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
            
            <div className="absolute bottom-1 right-1 bg-stone-900/80 text-stone-100 text-[10px] font-mono px-1 rounded flex items-center gap-1">
              {frame.isVideo && <Video className="w-3 h-3" />}
              {frame.engine.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

