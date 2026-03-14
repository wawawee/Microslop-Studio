import { SCENES, Scene } from '../data/script';
import { motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';

interface Props {
  selectedSceneId: number;
  onSelect: (id: number) => void;
}

export function SceneSelector({ selectedSceneId, onSelect }: Props) {
  return (
    <div className="w-80 border-r-4 border-stone-800 bg-stone-200 overflow-y-auto h-full flex flex-col">
      <div className="p-4 border-b-4 border-stone-800 bg-stone-900 text-stone-100 sticky top-0 z-10">
        <h2 className="text-lg font-bold uppercase tracking-widest font-mono">Scenes (1-20)</h2>
      </div>
      <div className="p-2 flex flex-col gap-2">
        {SCENES.map((scene) => {
          const isSelected = scene.id === selectedSceneId;
          return (
            <motion.button
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-3 border-2 border-stone-800 rounded-lg flex items-start gap-3 transition-colors ${
                isSelected ? 'bg-stone-800 text-stone-100' : 'bg-stone-100 text-stone-900 hover:bg-stone-300'
              }`}
            >
              <div className="mt-1">
                <PlayCircle className={`w-5 h-5 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`} />
              </div>
              <div>
                <div className="font-bold font-mono text-sm uppercase">
                  Scene {scene.id}: {scene.title}
                </div>
                <div className={`text-xs mt-1 ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                  {scene.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
