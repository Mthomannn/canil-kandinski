import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-[#1C1917] border border-amber-500/50 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>Modo Offline — Navegando pelo cache salvo no dispositivo.</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 px-2 py-1 rounded-lg bg-[#292524] text-stone-300 hover:text-white text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
        title="Tentar reconectar"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Reconectar</span>
      </button>
    </div>
  );
};
