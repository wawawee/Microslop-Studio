import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SceneSelector } from './components/SceneSelector';
import { GeneratorPanel } from './components/GeneratorPanel';
import { FilmStrip } from './components/FilmStrip';
import { ViewerModal } from './components/ViewerModal';
import { PlayerModal } from './components/PlayerModal';
import { Clippy } from './components/Clippy';
import { BSOD } from './components/BSOD';
import { SCENES } from './data/script';
import { EngineType, GeneratedFrame } from './types';

export default function App() {
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [engine, setEngine] = useState<EngineType>('cloud');
  const [localApiUrl, setLocalApiUrl] = useState<string>('http://localhost:1234/v1/images/generations');
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);
  const [viewingFrame, setViewingFrame] = useState<GeneratedFrame | null>(null);
  const [showBSOD, setShowBSOD] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Keyframe state for video generation / consistency
  const [firstFrame, setFirstFrame] = useState<string | null>(null);
  const [lastFrame, setLastFrame] = useState<string | null>(null);

  const selectedScene = SCENES.find(s => s.id === selectedSceneId) || SCENES[0];

  const handleFrameGenerated = (frame: GeneratedFrame) => {
    setFrames(prev => [frame, ...prev]);
  };

  const handleDeleteFrame = (id: string) => {
    const frameToDelete = frames.find(f => f.id === id);
    setFrames(prev => prev.filter(f => f.id !== id));

    // Edgy Grim Resurrector: 20% chance to come back
    if (frameToDelete && Math.random() < 0.2) {
      setTimeout(() => {
        setFrames(prev => {
          if (!prev.find(f => f.id === id)) {
            return [{...frameToDelete, prompt: frameToDelete.prompt + ' (RESURRECTED BY EDGY GRIM)'}, ...prev];
          }
          return prev;
        });
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-300 text-stone-900 font-sans overflow-hidden crt-overlay relative">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Header onOpenProject={() => setShowBSOD(true)} />
      
      <div className="flex flex-1 overflow-hidden z-10">
        <SceneSelector 
          selectedSceneId={selectedSceneId} 
          onSelect={setSelectedSceneId} 
        />
        
        <GeneratorPanel 
          scene={selectedScene}
          engine={engine}
          setEngine={setEngine}
          localApiUrl={localApiUrl}
          setLocalApiUrl={setLocalApiUrl}
          onFrameGenerated={handleFrameGenerated}
          onTriggerBSOD={() => setShowBSOD(true)}
          firstFrame={firstFrame}
          setFirstFrame={setFirstFrame}
          lastFrame={lastFrame}
          setLastFrame={setLastFrame}
        />
      </div>
      
      <div className="z-10">
        <FilmStrip 
          frames={frames} 
          onDelete={handleDeleteFrame}
          onView={setViewingFrame}
          onSetFirstFrame={setFirstFrame}
          onSetLastFrame={setLastFrame}
          onPlay={() => setShowPlayer(true)}
        />
      </div>

      <ViewerModal 
        frame={viewingFrame} 
        onClose={() => setViewingFrame(null)} 
      />

      {showPlayer && (
        <PlayerModal 
          frames={frames} 
          onClose={() => setShowPlayer(false)} 
        />
      )}

      <Clippy />
      <BSOD isActive={showBSOD} onDismiss={() => setShowBSOD(false)} />
    </div>
  );
}






