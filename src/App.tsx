import { useState } from 'react';
import { Header } from './components/Header';
import { SceneSelector } from './components/SceneSelector';
import { GeneratorPanel } from './components/GeneratorPanel';
import { FilmStrip } from './components/FilmStrip';
import { ViewerModal } from './components/ViewerModal';
import { SCENES } from './data/script';
import { EngineType, GeneratedFrame } from './types';

export default function App() {
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [engine, setEngine] = useState<EngineType>('cloud');
  const [localApiUrl, setLocalApiUrl] = useState<string>('http://localhost:1234/v1/images/generations');
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);
  const [viewingFrame, setViewingFrame] = useState<GeneratedFrame | null>(null);

  const selectedScene = SCENES.find(s => s.id === selectedSceneId) || SCENES[0];

  const handleFrameGenerated = (frame: GeneratedFrame) => {
    setFrames(prev => [frame, ...prev]);
  };

  const handleDeleteFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-stone-300 text-stone-900 font-sans overflow-hidden crt-overlay relative">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Header />
      
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
        />
      </div>
      
      <div className="z-10">
        <FilmStrip 
          frames={frames} 
          onDelete={handleDeleteFrame}
          onView={setViewingFrame}
        />
      </div>

      <ViewerModal 
        frame={viewingFrame} 
        onClose={() => setViewingFrame(null)} 
      />
    </div>
  );
}

