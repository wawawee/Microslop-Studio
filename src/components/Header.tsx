import { Film, Settings, Monitor, Play } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b-4 border-stone-800 bg-stone-900 text-stone-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Monitor className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          Micro$lop Studio
        </h1>
      </div>
      <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          <span>The BloatWaffe Framework</span>
        </div>
      </div>
    </header>
  );
}
