import { useState, useEffect } from 'react';
import { Scene, NEGATIVE_PROMPT } from '../data/script';
import { EngineType, GeneratedFrame } from '../types';
import { generateCloudImage, generateLocalImage } from '../services/ai';
import { motion } from 'motion/react';
import { Loader2, Wand2, Monitor, Cloud, Settings2, AlertTriangle, Zap, PlusCircle } from 'lucide-react';

interface Props {
  scene: Scene;
  engine: EngineType;
  setEngine: (engine: EngineType) => void;
  localApiUrl: string;
  setLocalApiUrl: (url: string) => void;
  onFrameGenerated: (frame: GeneratedFrame) => void;
  onTriggerBSOD: () => void;
}

const BLOAT_FEATURES = [
  ", background features Candy Crush Saga icons",
  ", Xbox Game Bar overlay visible",
  ", Teams notification popping up",
  ", Cortana trying to help in the corner",
  ", mandatory Edge browser update prompt",
  ", OneDrive sync error icon floating"
];

export function GeneratorPanel({ scene, engine, setEngine, localApiUrl, setLocalApiUrl, onFrameGenerated, onTriggerBSOD }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(scene.prompt);
  const [cokePilotMode, setCokePilotMode] = useState(false);

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      let imageUrl = '';
      if (engine === 'cloud') {
        imageUrl = await generateCloudImage(customPrompt);
      } else {
        imageUrl = await generateLocalImage(customPrompt, localApiUrl);
      }
      
      const newFrame: GeneratedFrame = {
        id: crypto.randomUUID(),
        sceneId: scene.id,
        imageUrl,
        prompt: customPrompt,
        engine,
        timestamp: Date.now()
      };
      
      onFrameGenerated(newFrame);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden bg-stone-100 transition-all ${cokePilotMode ? 'animate-pulse bg-red-50' : ''}`}>
      <div className="p-6 border-b-4 border-stone-800 bg-stone-200 relative">
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
        <p className="text-stone-600 font-mono text-sm mb-6">{scene.description}</p>
        
        <div className={`bg-stone-900 text-stone-100 p-4 rounded-xl border-4 border-stone-800 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] ${cokePilotMode ? 'border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">
              Director's Prompt (Rubber Hose Style)
            </label>
            <button 
              onClick={handleInjectBloat}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
              title="BloatWaffe Inject: Add unnecessary features"
            >
              <PlusCircle className="w-3 h-3" />
              Inject Bloat
            </button>
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className={`w-full bg-stone-800 text-stone-100 p-3 rounded-lg border-2 border-stone-700 focus:border-stone-400 focus:outline-none font-mono text-sm h-32 resize-none ${cokePilotMode ? 'animate-pulse border-red-500' : ''}`}
          />
          
          <div className="mt-4 flex items-center justify-between">
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
                  Local (Wan 2.1 / M4)
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
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`bg-[#0078D4] hover:bg-blue-600 text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl border-4 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${cokePilotMode ? 'bg-red-600 hover:bg-red-700 animate-bounce' : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {cokePilotMode ? 'UPDATING!!!' : 'Processing...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {cokePilotMode ? 'GENERATE NOW!!!' : 'Generate Frame'}
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border-4 border-red-900 text-red-900 rounded-xl flex items-start gap-3 font-mono text-sm shadow-[4px_4px_0px_0px_rgba(127,29,29,1)]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase">Error generating frame</p>
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
          {!isGenerating && !error && (
             <div className="text-center text-stone-500 font-mono uppercase tracking-widest opacity-50">
               <Monitor className={`w-24 h-24 mx-auto mb-4 opacity-50 ${cokePilotMode ? 'animate-spin text-red-600' : ''}`} />
               <p>{cokePilotMode ? 'I CAN SEE TIME!!!' : "Awaiting Director's Command..."}</p>
               <p className="text-xs mt-2">{cokePilotMode ? 'WE MUST UPDATE NOW!' : 'Press "Generate Frame" to create magic.'}</p>
             </div>
          )}
          {isGenerating && (
            <div className="text-center text-stone-800 font-mono uppercase tracking-widest animate-pulse">
               <Loader2 className={`w-24 h-24 mx-auto mb-4 animate-spin ${cokePilotMode ? 'text-red-600' : ''}`} />
               <p>{cokePilotMode ? 'CONSUMING ALL RAM!!!' : 'Consulting the BloatWaffe...'}</p>
               <p className="text-xs mt-2">{cokePilotMode ? '99% CPU USAGE ACHIEVED' : 'Please wait while we consume 87% of your resources.'}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
