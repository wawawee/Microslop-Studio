import { Film, Monitor, Activity, AlertOctagon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  onOpenProject?: () => void;
}

export function Header({ onOpenProject }: Props) {
  const [ramUsage, setRamUsage] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      // BloatWaffe always keeps RAM high
      setRamUsage(prev => {
        const newUsage = prev + (Math.random() * 5 - 2);
        return Math.min(Math.max(newUsage, 87), 99.9);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b-4 border-stone-800 bg-stone-900 text-stone-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Monitor className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          Micro$lop Studio
        </h1>
      </div>
      <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest">
        <button 
          onClick={onOpenProject}
          className="flex items-center gap-2 bg-[#0078D4] hover:bg-blue-500 text-white px-4 py-2 rounded border-2 border-blue-900 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          title="Warning: Highly unstable environment"
        >
          <AlertOctagon className="w-4 h-4" />
          OPEN PROJECT IN MS 11
        </button>
        <div className="flex items-center gap-2 text-red-400" title="BloatWaffe Engine Active">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>RAM: {ramUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2 text-stone-400">
          <Film className="w-5 h-5" />
          <span>The BloatWaffe Framework</span>
        </div>
      </div>
    </header>
  );
}


