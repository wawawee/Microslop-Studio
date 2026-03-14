import { useState } from 'react';
import { Scene, NEGATIVE_PROMPT } from '../data/script';
import { EngineType, GeneratedFrame } from '../types';
import { generateCloudImage, generateLocalImage } from '../services/ai';
import { motion } from 'motion/react';
import { Loader2, Wand2, Monitor, Cloud, Settings2, AlertTriangle } from 'lucide-react';

interface Props {
  scene: Scene;
  engine: EngineType;
  setEngine: (engine: EngineType) => void;
  localApiUrl: string;
  setLocalApiUrl: (url: string) => void;
  onFrameGenerated: (frame: GeneratedFrame) => void;
}

export function GeneratorPanel({ scene, engine, setEngine, localApiUrl, setLocalApiUrl, onFrameGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(scene.prompt);

  // Sync custom prompt when scene changes
  useState(() => {
    setCustomPrompt(scene.prompt);
  });

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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-100">
      <div className="p-6 border-b-4 border-stone-800 bg-stone-200">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          Scene {scene.id}: {scene.title}
        </h2>
        <p className="text-stone-600 font-mono text-sm mb-6">{scene.description}</p>
        
        <div className="bg-stone-900 text-stone-100 p-4 rounded-xl border-4 border-stone-800 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
          <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
            Director's Prompt (Rubber Hose Style)
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full bg-stone-800 text-stone-100 p-3 rounded-lg border-2 border-stone-700 focus:border-stone-400 focus:outline-none font-mono text-sm h-32 resize-none"
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
              className="bg-[#0078D4] hover:bg-blue-600 text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl border-4 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Frame
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
      
      <div className="flex-1 p-6 overflow-y-auto bg-stone-300 relative crt-overlay">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-full">
          {!isGenerating && !error && (
             <div className="text-center text-stone-500 font-mono uppercase tracking-widest opacity-50">
               <Monitor className="w-24 h-24 mx-auto mb-4 opacity-50" />
               <p>Awaiting Director's Command...</p>
               <p className="text-xs mt-2">Press "Generate Frame" to create magic.</p>
             </div>
          )}
          {isGenerating && (
            <div className="text-center text-stone-800 font-mono uppercase tracking-widest animate-pulse">
               <Loader2 className="w-24 h-24 mx-auto mb-4 animate-spin" />
               <p>Consulting the BloatWaffe...</p>
               <p className="text-xs mt-2">Please wait while we consume 87% of your resources.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
