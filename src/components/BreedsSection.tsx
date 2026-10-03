import React from 'react';
import { BreedInfo } from '../types';
import { storageService } from '../services/storageService';
import { Check } from 'lucide-react';

interface Props {
  breeds?: BreedInfo[];
  onSelectBreedFilter: (breed: string) => void;
}

export const BreedsSection: React.FC<Props> = ({
  breeds: propBreeds,
  onSelectBreedFilter,
}) => {
  const breeds = propBreeds || storageService.getBreeds();

  if (!breeds || breeds.length === 0) return null;

  return (
    <section id="racas" className="py-16 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
            <span>Especialização & Padrão Cinófilo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
            Raças Selecionadas com Rigor Genético
          </h2>
          <p className="text-sm text-[#78716C] mt-2">
            Não produzimos ninhadas em série. Cada acasalamento é estudado geneticamente para aprimorar saúde, conformação e estabilidade psicológica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {breeds.map((breed) => (
            <div
              key={breed.id || breed.name}
              className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* Visual */}
                <div className="relative aspect-[4/3] bg-[#F5F5F4] overflow-hidden">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      if (breed.name.includes('Golden')) e.currentTarget.src = '/golden.jpg';
                      else if (breed.name.includes('Bulldog')) e.currentTarget.src = '/bulldog.jpg';
                      else e.currentTarget.src = '/chihuahua.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider opacity-85 block">
                      Padrão CBKC / FCI
                    </span>
                    <h3 className="text-xl font-serif-display font-bold">{breed.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs font-medium text-[#854D0E]">
                    {breed.tagline}
                  </p>

                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {breed.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#F5F5F4]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C1917] block">
                      Destaques da Linhagem Kandinski:
                    </span>
                    <ul className="space-y-1 text-xs text-[#44403C]">
                      {breed.traits.map((trait, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FAFAF9] p-3 rounded-lg border border-[#E7E5E4] text-[11px] text-[#57534E]">
                    <strong className="text-[#1C1917]">Perfil de Família:</strong> {breed.idealFor}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    onSelectBreedFilter(breed.name);
                    const el = document.getElementById('vendas');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#1C1917] hover:text-white bg-[#F5F5F4] hover:bg-[#1C1917] rounded-lg transition-colors border border-[#E7E5E4] cursor-pointer"
                >
                  Ver Filhotes de {breed.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
