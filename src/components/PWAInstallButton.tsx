import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface Props {
  variant?: 'navbar' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and running as standalone app, suppress
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If browser doesn't support beforeinstallprompt yet and isn't iOS, still offer the friendly button
  const isAvailable = isInstallable || isIOS;

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-xs transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          title="Instalar o aplicativo do Canil Kandinski no seu celular ou computador"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span>Instalar App</span>
        </button>
      )}

      {variant === 'floating' && (
        <div className="fixed bottom-20 left-4 z-40 hidden sm:block">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1917] text-white hover:bg-[#292524] border border-amber-500/40 rounded-full shadow-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-3 h-3" />
            </div>
            <span>Instalar App Canil</span>
          </button>
        </div>
      )}

      {variant === 'banner' && isAvailable && (
        <div className="bg-[#1C1917] border border-[#292524] rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Aplicativo Canil Kandinski</h4>
              <p className="text-xs text-[#A8A29E]">
                Acesse fotos de filhotes e novidades direto da tela inicial do seu celular.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar no Dispositivo</span>
          </button>
        </div>
      )}

      {/* iOS Safari Step-by-Step Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-[#1C1917] relative border border-[#E7E5E4]">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold font-serif-display text-[#1C1917]">
              Instalar no iPhone / iPad
            </h3>
            <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
              O Safari permite instalar o Canil Kandinski direto na tela inicial sem precisar da App Store:
            </p>

            <div className="mt-4 space-y-3 bg-[#F5F5F4] p-3.5 rounded-2xl text-xs text-[#44403C]">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white border border-[#E7E5E4] text-[#1C1917] flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </div>
                <p className="mt-0.5">
                  Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> na barra inferior do Safari.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white border border-[#E7E5E4] text-[#1C1917] flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </div>
                <p className="mt-0.5">
                  Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3.5 h-3.5 inline text-[#1C1917] mx-0.5" />.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white border border-[#E7E5E4] text-[#1C1917] flex items-center justify-center shrink-0 font-bold text-[11px]">
                  3
                </div>
                <p className="mt-0.5">
                  Toque em <strong>Adicionar</strong> no canto superior direito. Pronto!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 text-xs font-bold text-white bg-[#1C1917] hover:bg-[#292524] rounded-xl transition-all cursor-pointer shadow-md"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl border border-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Aplicativo instalado com sucesso!</span>
          </div>
        </div>
      )}
    </>
  );
};
