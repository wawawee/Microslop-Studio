import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clippy } from './Clippy';

interface Props {
  isActive: boolean;
  onDismiss: () => void;
}

export function BSOD({ isActive, onDismiss }: Props) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0078D4] text-white font-mono p-12 flex flex-col justify-center items-start cursor-wait select-none crt-overlay"
        onClick={onDismiss}
      >
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-8xl font-bold mb-8">:(</h1>
          <h2 className="text-3xl mb-12 leading-relaxed">
            Your happiness ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
          </h2>
          <p className="text-xl mb-8">
            0% complete{dots}
          </p>
          <div className="flex gap-8 items-start mt-16">
            <div className="w-32 h-32 bg-white p-2">
              {/* Fake QR code */}
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`bg-[#0078D4] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                ))}
              </div>
            </div>
            <div className="text-lg">
              <p>For more information about this issue and possible fixes, visit</p>
              <p className="font-bold mt-2">https://www.microslop.com/stopcode</p>
              <p className="mt-8">If you call a support person, give them this info:</p>
              <p>Stop code: HAPPINESS_NOT_FOUND</p>
            </div>
          </div>
        </div>
        <Clippy />
      </motion.div>
    </AnimatePresence>
  );
}
