import React, { useState } from 'react';
import { KennelConfig } from '../types';
import { kennelImages } from '../assets/images';
import { Award, ShieldCheck, HeartHandshake, ArrowRight, MessageCircle } from 'lucide-react';

interface Props {
  config: KennelConfig;
  onExplorePuppies: () => void;
  availableCount: number;
}

export const HeroSection: React.FC<Props> = ({
  config,
  onExplorePuppies,
  availableCount,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(config.heroImage || kennelImages.hero);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  // Sync if config.heroImage changes in admin
  React.useEffect(() => {
    if (config.heroImage) {
      setImageSrc(config.heroImage);
    }
  }, [config.heroImage]);

  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  const handleImageError = () => {
    if (fallbackAttempt === 0) {
      setImageSrc('/hero.jpg');
      setFallbackAttempt(1);
    } else if (fallbackAttempt === 1) {
      setImageSrc(kennelImages.heroAlt);
      setFallbackAttempt(2);
    } else if (fallbackAttempt === 2) {
      setImageSrc('/grounds.jpg');
      setFallbackAttempt(3);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFAF9] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase">
              <span>Porto Alegre, RS</span>
              <span aria-hidden="true">·</span>
              <span>Criação Ética & Familiar</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1C1917] tracking-tight leading-[1.15]">
              {config.heroTitle || 'Criação ética, pureza de linhagem e dedicação em cada filhote.'}
            </h1>

            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl">
              {(
                config.heroSubtitle ||
                `Desde ${config.foundationYear || '2010'} selecionando exemplares com padrão morfológico internacional, temperamento dócil e rigoroso controle genético.`
              ).replace(/1998/g, config.foundationYear || '2010')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExplorePuppies}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Conhecer Filhotes Disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Gostaria%20de%20conversar%20sobre%20as%20ninhadas%20do%20Canil%20Kandinski.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 text-sm font-medium text-[#1C1917] bg-white hover:bg-[#F5F5F4] border border-[#D6D3D1] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#059669]" />
                <span>Falar com a Criadora Daniela</span>
              </a>
            </div>

            {/* Proof Badges Adjacent */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#E7E5E4]">
              <div>
                <p className="text-xl font-bold font-mono text-[#1C1917] tabular-nums">
                  {`Desde ${config.foundationYear || '2010'}`}
                </p>
                <p className="text-xs text-[#78716C] mt-0.5">
                  {config.heroBadge1Label || 'Tradição & Seleção'}
                </p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-[#1C1917] tabular-nums">
                  {config.heroBadge3Value || 'Brasil'}
                </p>
                <p className="text-xs text-[#78716C] mt-0.5">
                  {config.heroBadge3Label || 'Envio Aéreo IATA Seguro'}
                </p>
              </div>
            </div>
          </div>

          {/* Focal Image Visual Anchor */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E7E5E4] bg-[#292524] aspect-[16/10] sm:aspect-[16/10]">
              <img
                src={imageSrc}
                alt="Canil Kandinski - Golden Retriever e Bulldog Inglês em Porto Alegre"
                className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
                loading="eager"
                decoding="async"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
                  <span className="font-medium drop-shadow-sm">
                    Matrizes e Reprodutores Livres de Displasia & Doenças Congênitas
                  </span>
                </div>
                <span className="hidden sm:inline font-mono text-[11px] opacity-90 drop-shadow-sm">
                  {availableCount} filhotes para reserva
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
