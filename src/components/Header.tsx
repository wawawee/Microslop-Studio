import { Film, Monitor, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
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

