import { GeneratedFrame } from '../types';
import { X, Play, Pause, SkipBack, SkipForward, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

interface Props {
  frames: GeneratedFrame[];
  onClose: () => void;
}

export function PlayerModal({ frames, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sort frames by sceneId, then timestamp
  const sortedFrames = [...frames].sort((a, b) => {
    if (a.sceneId !== b.sceneId) return a.sceneId - b.sceneId;
    return a.timestamp - b.timestamp;
  });

  const currentFrame = sortedFrames[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // If it's a video and it's playing, we let the video's onEnded event handle the transition
    if (isPlaying && sortedFrames.length > 0 && !currentFrame?.isVideo) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedFrames.length);
      }, 1000); // 1 FPS for animatic feel
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, sortedFrames.length, currentFrame?.isVideo]);

  // Handle play/pause for video element when isPlaying state changes
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Video play failed", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  if (sortedFrames.length === 0) return null;

  const handleVideoEnded = () => {
    if (isPlaying) {
      setCurrentIndex((prev) => (prev + 1) % sortedFrames.length);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/95 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-stone-200 border-8 border-stone-800 rounded-2xl max-w-5xl w-full flex flex-col shadow-[16px_16px_0px_0px_rgba(28,25,23,1)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b-4 border-stone-800 bg-stone-900 text-stone-100">
            <h3 className="font-mono font-bold uppercase tracking-widest text-lg flex items-center gap-2">
              {currentFrame.isVideo && <Video className="w-5 h-5" />}
              Micro$lop Studio Player - Scene {currentFrame.sceneId}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-8 flex flex-col items-center gap-6 bg-stone-300 relative crt-overlay">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <div className="relative border-8 border-stone-100 shadow-2xl bg-black w-full aspect-video flex items-center justify-center overflow-hidden">
              {currentFrame.isVideo ? (
                <video 
                  ref={videoRef}
                  src={currentFrame.imageUrl} 
                  className="w-full h-full object-contain grayscale contrast-125 sepia-[.2]"
                  autoPlay={isPlaying}
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                />
              ) : (
                <img 
                  src={currentFrame.imageUrl} 
                  alt={`Frame ${currentIndex}`} 
                  className="w-full h-full object-contain grayscale contrast-125 sepia-[.2]"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 font-mono text-xs rounded">
                {currentIndex + 1} / {sortedFrames.length}
              </div>
            </div>
            
            <div className="flex items-center gap-6 bg-stone-900 p-4 rounded-xl border-4 border-stone-800 w-full justify-center">
              <button 
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(0);
                }}
                className="p-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
                title="First Frame"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-[#0078D4] text-white hover:bg-blue-600 rounded-full transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              
              <button 
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(sortedFrames.length - 1);
                }}
                className="p-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
                title="Last Frame"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
