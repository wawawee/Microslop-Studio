import React, { useState, useEffect } from 'react';
import { Scene, NEGATIVE_PROMPT } from '../data/script';
import { EngineType, GeneratedFrame } from '../types';
import { generateCloudImage, generateLocalImage, generateCloudVideo } from '../services/ai';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Wand2, Monitor, Cloud, Settings2, AlertTriangle, Zap, PlusCircle, Hash, Lock, Unlock, Users, ChevronDown, ChevronUp, Image as ImageIcon, X, Video } from 'lucide-react';

interface Props {
  scene: Scene;
  engine: EngineType;
  setEngine: (engine: EngineType) => void;
  localApiUrl: string;
  setLocalApiUrl: (url: string) => void;
  onFrameGenerated: (frame: GeneratedFrame) => void;
  onTriggerBSOD: () => void;
  firstFrame: string | null;
  setFirstFrame: (url: string | null) => void;
  lastFrame: string | null;
  setLastFrame: (url: string | null) => void;
}

const BLOAT_FEATURES = [
  ", background features Candy Crush Saga icons",
  ", Xbox Game Bar overlay visible",
  ", Teams notification popping up",
  ", Cortana trying to help in the corner",
  ", mandatory Edge browser update prompt",
  ", OneDrive sync error icon floating"
];

const CHARACTER_REFS = [
  { name: "Micro$", desc: "A 1930s rubber-hose style computer monitor character with a cracked screen face, wearing white gloves and black shoes." },
  { name: "Clippy", desc: "A sinister 1930s rubber-hose style paperclip character with large expressive eyes and sharp teeth." },
  { name: "Coke Pilot", desc: "A hyperactive 1930s rubber-hose style aviator character with wide crazed eyes, wearing a pilot cap and goggles." }
];

export function GeneratorPanel({ scene, engine, setEngine, localApiUrl, setLocalApiUrl, onFrameGenerated, onTriggerBSOD, firstFrame, setFirstFrame, lastFrame, setLastFrame }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(scene.prompt);
  const [cokePilotMode, setCokePilotMode] = useState(false);
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000000));
  const [isSeedLocked, setIsSeedLocked] = useState(false);
  const [showCharRefs, setShowCharRefs] = useState(false);
  const [isDraggingFirst, setIsDraggingFirst] = useState(false);
  const [isDraggingLast, setIsDraggingLast] = useState(false);

  // Sync custom prompt when scene changes
  useEffect(() => {
    setCustomPrompt(scene.prompt);
  }, [scene]);

  // Easter Egg: Type "Linux" 3 times
  useEffect(() => {
    const count = (customPrompt.match(/linux/gi) || []).length;
    if (count >= 3) {
      onTriggerBSOD();
      setCustomPrompt(customPrompt.replace(/linux/gi, 'Windows'));
    }
  }, [customPrompt, onTriggerBSOD]);

  const handleInjectBloat = () => {
    const bloat = BLOAT_FEATURES[Math.floor(Math.random() * BLOAT_FEATURES.length)];
    setCustomPrompt(prev => prev + bloat);
  };

  const handleInjectChar = (desc: string) => {
    setCustomPrompt(prev => prev + ", " + desc);
  };

  const handleDragOver = (e: React.DragEvent, setDragging: (val: boolean) => void) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent, setDragging: (val: boolean) => void) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent, setFrame: (url: string) => void, setDragging: (val: boolean) => void) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFrame(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    // Generate a new seed if not locked
    const currentSeed = isSeedLocked ? seed : Math.floor(Math.random() * 1000000);
    if (!isSeedLocked) {
      setSeed(currentSeed);
    }

    try {
      let imageUrl = '';
      if (engine === 'cloud') {
        imageUrl = await generateCloudImage(customPrompt, currentSeed, firstFrame || undefined, lastFrame || undefined);
      } else {
        imageUrl = await generateLocalImage(customPrompt, localApiUrl, currentSeed, firstFrame || undefined, lastFrame || undefined);
      }
      
      const newFrame: GeneratedFrame = {
        id: crypto.randomUUID(),
        sceneId: scene.id,
        imageUrl,
        prompt: customPrompt,
        engine,
        timestamp: Date.now(),
        seed: currentSeed,
        firstFrame: firstFrame || undefined,
        lastFrame: lastFrame || undefined,
        isVideo: false
      };
      
      onFrameGenerated(newFrame);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setError(null);
    
    try {
      if (engine !== 'cloud') {
        throw new Error("Video generation is currently only supported with the Cloud (Veo) engine.");
      }

      const videoUrl = await generateCloudVideo(customPrompt, firstFrame || undefined, lastFrame || undefined);
      
      const newFrame: GeneratedFrame = {
        id: crypto.randomUUID(),
        sceneId: scene.id,
        imageUrl: videoUrl, // We'll store the object URL here
        prompt: customPrompt,
        engine,
        timestamp: Date.now(),
        seed: seed, // Seed isn't strictly used by Veo in the same way, but we keep it for consistency
        firstFrame: firstFrame || undefined,
        lastFrame: lastFrame || undefined,
        isVideo: true
      };
      
      onFrameGenerated(newFrame);
    } catch (err: any) {
      setError(err.message || 'An error occurred during video generation.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden bg-stone-100 transition-all ${cokePilotMode ? 'animate-pulse bg-red-50' : ''}`}>
      <div className="p-6 border-b-4 border-stone-800 bg-stone-200 relative flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            Scene {scene.id}: {scene.title}
          </h2>
          <button 
            onClick={() => setCokePilotMode(!cokePilotMode)}
            className={`p-2 rounded-full border-2 transition-colors ${cokePilotMode ? 'bg-red-600 text-white border-red-900 animate-bounce' : 'bg-stone-300 text-stone-600 border-stone-800 hover:bg-stone-400'}`}
            title="Toggle Coke Pilot Mode"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
        <p className="text-stone-600 font-mono text-sm mb-4">{scene.description}</p>
        
        <div className={`bg-stone-900 text-stone-100 p-4 rounded-xl border-4 border-stone-800 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] ${cokePilotMode ? 'border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]' : ''}`}>
          
          {/* Keyframes Section */}
          <div className="flex gap-4 mb-4">
            <div 
              className={`flex-1 border-2 rounded-lg p-3 relative transition-colors ${isDraggingFirst ? 'bg-stone-700 border-[#0078D4]' : 'bg-stone-800 border-stone-700'}`}
              onDragOver={(e) => handleDragOver(e, setIsDraggingFirst)}
              onDragLeave={(e) => handleDragLeave(e, setIsDraggingFirst)}
              onDrop={(e) => handleDrop(e, setFirstFrame, setIsDraggingFirst)}
            >
              <div className="flex justify-between items-center mb-2 pointer-events-none">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> First Frame
                </label>
                {firstFrame && (
                  <button onClick={() => setFirstFrame(null)} className="text-stone-500 hover:text-red-400 transition-colors pointer-events-auto">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {firstFrame ? (
                <div className="h-20 w-full rounded overflow-hidden border border-stone-600 pointer-events-none">
                  <img src={firstFrame} alt="First Frame" className="w-full h-full object-cover grayscale contrast-125 sepia-[.2]" />
                </div>
              ) : (
                <div className="h-20 w-full rounded border border-dashed border-stone-600 flex items-center justify-center text-stone-500 text-xs font-mono text-center px-2 pointer-events-none">
                  Select from Filmstrip or drag & drop image
                </div>
              )}
            </div>
            
            <div 
              className={`flex-1 border-2 rounded-lg p-3 relative transition-colors ${isDraggingLast ? 'bg-stone-700 border-[#0078D4]' : 'bg-stone-800 border-stone-700'}`}
              onDragOver={(e) => handleDragOver(e, setIsDraggingLast)}
              onDragLeave={(e) => handleDragLeave(e, setIsDraggingLast)}
              onDrop={(e) => handleDrop(e, setLastFrame, setIsDraggingLast)}
            >
              <div className="flex justify-between items-center mb-2 pointer-events-none">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Last Frame
                </label>
                {lastFrame && (
                  <button onClick={() => setLastFrame(null)} className="text-stone-500 hover:text-red-400 transition-colors pointer-events-auto">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {lastFrame ? (
                <div className="h-20 w-full rounded overflow-hidden border border-stone-600 pointer-events-none">
                  <img src={lastFrame} alt="Last Frame" className="w-full h-full object-cover grayscale contrast-125 sepia-[.2]" />
                </div>
              ) : (
                <div className="h-20 w-full rounded border border-dashed border-stone-600 flex items-center justify-center text-stone-500 text-xs font-mono text-center px-2 pointer-events-none">
                  Select from Filmstrip or drag & drop image
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">
              Director's Prompt (Rubber Hose Style)
            </label>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCharRefs(!showCharRefs)}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                title="Character Consistency Guide"
              >
                <Users className="w-3 h-3" />
                Characters {showCharRefs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <button 
                onClick={handleInjectBloat}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
                title="BloatWaffe Inject: Add unnecessary features"
              >
                <PlusCircle className="w-3 h-3" />
                Inject Bloat
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showCharRefs && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-3 overflow-hidden"
              >
                <div className="bg-stone-800 border border-stone-700 rounded-lg p-3 text-xs font-mono">
                  <p className="text-stone-400 mb-2 uppercase tracking-wider font-bold">Click to inject consistent character descriptions:</p>
                  <div className="flex flex-col gap-2">
                    {CHARACTER_REFS.map(char => (
                      <div key={char.name} className="flex items-start gap-2 group cursor-pointer hover:bg-stone-700 p-1 rounded" onClick={() => handleInjectChar(char.desc)}>
                        <span className="font-bold text-blue-400 min-w-[80px]">{char.name}:</span>
                        <span className="text-stone-300 group-hover:text-white transition-colors">{char.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className={`w-full bg-stone-800 text-stone-100 p-3 rounded-lg border-2 border-stone-700 focus:border-stone-400 focus:outline-none font-mono text-sm h-24 resize-none ${cokePilotMode ? 'animate-pulse border-red-500' : ''}`}
          />
          
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-stone-800 p-2 rounded-lg border-2 border-stone-700">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Seed:</span>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  disabled={!isSeedLocked}
                  className="bg-stone-900 border border-stone-600 rounded px-2 py-1 text-xs font-mono w-24 focus:outline-none focus:border-stone-400 disabled:opacity-50"
                  title="Lock the seed to keep characters consistent across frames"
                />
                <button
                  onClick={() => setIsSeedLocked(!isSeedLocked)}
                  className={`p-1.5 rounded transition-colors ${isSeedLocked ? 'bg-blue-600 text-white' : 'bg-stone-700 text-stone-400 hover:text-stone-200'}`}
                  title={isSeedLocked ? "Unlock Seed" : "Lock Seed for Character Consistency"}
                >
                  {isSeedLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-xs text-stone-500 italic max-w-xs text-right">
                Tip: Lock the seed and use consistent character descriptions to keep Micro$ looking the same.
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex bg-stone-800 rounded-lg p-1 border-2 border-stone-700">
                  <button
                    onClick={() => setEngine('cloud')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-colors ${
                      engine === 'cloud' ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Cloud className="w-4 h-4" />
                    Cloud (Gemini)
                  </button>
                  <button
                    onClick={() => setEngine('local')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-colors ${
                      engine === 'local' ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    Local (Wan2.2-I2V-A14B)
                  </button>
                </div>
                
                {engine === 'local' && (
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={localApiUrl}
                      onChange={(e) => setLocalApiUrl(e.target.value)}
                      placeholder="http://localhost:1234/v1/images/generations"
                      className="bg-stone-800 border-2 border-stone-700 rounded-md px-3 py-1 text-xs font-mono w-64 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || isGeneratingVideo}
                  className={`bg-stone-700 hover:bg-stone-600 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl border-4 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Image...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" />
                      Image
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || isGeneratingVideo || engine !== 'cloud'}
                  className={`bg-[#0078D4] hover:bg-blue-600 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl border-4 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${cokePilotMode ? 'bg-red-600 hover:bg-red-700 animate-bounce' : ''}`}
                  title={engine !== 'cloud' ? 'Video generation requires Cloud engine' : 'Generate video using Veo'}
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {cokePilotMode ? 'RENDERING!!!' : 'Video...'}
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      {cokePilotMode ? 'MAKE MOVIE!!!' : 'Video'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-900 text-red-900 rounded-xl flex items-start gap-3 font-mono text-sm shadow-[4px_4px_0px_0px_rgba(127,29,29,1)]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase">Error generating</p>
              <p className="mt-1">{error}</p>
              {engine === 'local' && (
                <p className="mt-2 text-xs opacity-80">
                  Note: Local generation requires a running API (like LMStudio or ComfyUI) that accepts OpenAI-compatible requests. Ensure your browser allows mixed content if calling localhost from HTTPS.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={`flex-1 p-6 overflow-y-auto relative crt-overlay ${cokePilotMode ? 'bg-red-900/20' : 'bg-stone-300'}`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-full">
          {!isGenerating && !isGeneratingVideo && !error && (
             <div className="text-center text-stone-500 font-mono uppercase tracking-widest opacity-50">
               <Monitor className={`w-24 h-24 mx-auto mb-4 opacity-50 ${cokePilotMode ? 'animate-spin text-red-600' : ''}`} />
               <p>{cokePilotMode ? 'I CAN SEE TIME!!!' : "Awaiting Director's Command..."}</p>
               <p className="text-xs mt-2">{cokePilotMode ? 'WE MUST UPDATE NOW!' : 'Press "Image" or "Video" to create magic.'}</p>
             </div>
          )}
          {(isGenerating || isGeneratingVideo) && (
            <div className="text-center text-stone-800 font-mono uppercase tracking-widest animate-pulse">
               <Loader2 className={`w-24 h-24 mx-auto mb-4 animate-spin ${cokePilotMode ? 'text-red-600' : ''}`} />
               <p>{cokePilotMode ? 'CONSUMING ALL RAM!!!' : 'Consulting the BloatWaffe...'}</p>
               <p className="text-xs mt-2">{cokePilotMode ? '99% CPU USAGE ACHIEVED' : `Please wait while we consume 87% of your resources for this ${isGeneratingVideo ? 'video' : 'image'}.`}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
