import React, { useState, useMemo } from 'react';
import { Dog, DogBreed } from '../types';
import { Search, Sparkles, CheckCircle2, ChevronRight, Eye, ShoppingBag } from 'lucide-react';

interface Props {
  dogs: Dog[];
  onSelectDogForDetails: (dog: Dog) => void;
  onSelectDogForCheckout: (dog: Dog) => void;
}

export const SalesCatalog: React.FC<Props> = ({
  dogs,
  onSelectDogForDetails,
  onSelectDogForCheckout,
}) => {
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const breeds: { id: string; label: string }[] = [
    { id: 'all', label: 'Todas as Raças' },
    { id: 'Golden Retriever', label: 'Golden Retriever' },
    { id: 'Bulldog Inglês', label: 'Bulldog Inglês' },
    { id: 'Chihuahua', label: 'Chihuahua' },
  ];

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      if (selectedBreed !== 'all' && dog.breed !== selectedBreed) return false;
      if (onlyAvailable && dog.status !== 'Disponível') return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dog.name.toLowerCase().includes(query);
        const matchesBreed = dog.breed.toLowerCase().includes(query);
        const matchesColor = dog.color.toLowerCase().includes(query);
        const matchesGender = dog.gender.toLowerCase().includes(query);
        if (!matchesName && !matchesBreed && !matchesColor && !matchesGender) {
          return false;
        }
      }
      return true;
    });
  }, [dogs, selectedBreed, onlyAvailable, searchQuery]);

  return (
    <section id="vendas" className="py-16 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
              <span>Área de Vendas & Reservas</span>
              <span aria-hidden="true">·</span>
              <span>Linhagens Selecionadas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
              Filhotes Disponíveis para Entrega e Reserva
            </h2>
            <p className="text-sm text-[#78716C] mt-1 max-w-2xl">
              Cada filhote é entregue desverminado, com ciclo de vacinas importadas atualizado, microchip nacional e garantia contratual de saúde e procedência genética.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#57534E]">
              Total:{' '}
              <strong className="font-mono tabular-nums text-[#1C1917]">
                {filteredDogs.length}
              </strong>{' '}
              {filteredDogs.length === 1 ? 'filhote' : 'filhotes'}
            </span>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#E7E5E4] shadow-xs mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          {/* Segmented breed selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {breeds.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBreed(b.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedBreed === b.id
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Search and Available toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Buscar por nome, cor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F5F4] border border-[#E7E5E4] rounded-lg focus:outline-none focus:border-[#78716C] focus:bg-white transition-colors"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#44403C] cursor-pointer shrink-0 select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#D6D3D1] text-[#1C1917] focus:ring-0 cursor-pointer"
              />
              <span className="hidden sm:inline">Apenas Disponíveis</span>
              <span className="sm:hidden">Disponíveis</span>
            </label>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredDogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-12 text-center max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-[#A8A29E] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1C1917]">Nenhum filhote encontrado</h3>
            <p className="text-xs text-[#78716C] mt-1">
              Tente redefinir os filtros ou entre em contato diretamente com a Daniela para lista de espera da próxima ninhada.
            </p>
            <button
              onClick={() => {
                setSelectedBreed('all');
                setOnlyAvailable(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDogs.map((dog) => {
              const isAvailable = dog.status === 'Disponível';

              return (
                <div
                  key={dog.id}
                  className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden hover:border-[#D6D3D1] hover:shadow-md transition-all duration-200 flex flex-col group"
                >
                  {/* Image Slot */}
                  <div className="relative aspect-[4/3] bg-[#F5F5F4] overflow-hidden">
                    <img
                      src={dog.imageUrl}
                      alt={`${dog.name} - ${dog.breed}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (dog.breed.includes('Golden')) e.currentTarget.src = '/golden.jpg';
                        else if (dog.breed.includes('Bulldog')) e.currentTarget.src = '/bulldog.jpg';
                        else e.currentTarget.src = '/chihuahua.jpg';
                      }}
                    />

                    {/* Gradient Overlay for subtle text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                    {/* Status marker */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md shadow-xs ${
                          isAvailable
                            ? 'bg-white/95 text-[#065F46] border border-[#A7F3D0]'
                            : 'bg-[#1C1917]/90 text-[#F5F5F4]'
                        }`}
                      >
                        {isAvailable ? 'Disponível para Reserva' : 'Já Reservado'}
                      </span>
                    </div>

                    {/* Gender & Breed on corner */}
                    <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium drop-shadow-sm">
                      <span>{dog.breed}</span>
                      <span className="mx-1.5 opacity-75">·</span>
                      <span>{dog.gender}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Quiet Unboxed Metadata (Zero-Pill Compliance) */}
                      <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1.5">
                        <span>{dog.color}</span>
                        <span aria-hidden="true">·</span>
                        <span>Microchip OK</span>
                        <span aria-hidden="true">·</span>
                        <span>Pedigree KCRGS</span>
                      </div>

                      {/* Dog Name */}
                      <h3 className="text-lg font-serif-display font-bold text-[#1C1917] group-hover:text-[#78350F] transition-colors">
                        {dog.name}
                      </h3>

                      {/* Brief Description */}
                      <p className="text-xs text-[#57534E] mt-2 line-clamp-2 leading-relaxed">
                        {dog.description}
                      </p>
                    </div>

                    {/* Pricing Module */}
                    <div className="pt-3 border-t border-[#F5F5F4] space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[11px] text-[#78716C] block">Valor Integral</span>
                          <span className="text-lg font-bold font-mono tabular-nums text-[#1C1917]">
                            R$ {dog.price.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-[#78716C] block">Sinal de Reserva</span>
                          <span className="text-sm font-semibold font-mono tabular-nums text-[#B45309]">
                            R$ {dog.depositAmount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectDogForDetails(dog)}
                          className="py-2.5 px-3 text-xs font-medium text-[#44403C] hover:text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#78716C]" />
                          <span>Ver Detalhes</span>
                        </button>

                        <button
                          onClick={() => onSelectDogForCheckout(dog)}
                          disabled={!isAvailable}
                          className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAvailable
                              ? 'text-white bg-[#1C1917] hover:bg-[#292524] active:scale-[0.98] shadow-xs'
                              : 'text-[#A8A29E] bg-[#F5F5F4] cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isAvailable ? 'Reservar' : 'Esgotado'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security & Logistics Trust Note */}
        <div className="mt-12 bg-white rounded-xl border border-[#E7E5E4] p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#57534E]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-[#1C1917] mb-0.5">
                Reserva Garantida em Contrato
              </strong>
              <span>
                Sinal de reserva com garantia jurídica e devolução integral caso ocorra qualquer intercorrência antes da entrega.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-[#1C1917] mb-0.5">
                Envio Aéreo com Conforto IATA
              </strong>
              <span>
                Embarques climatizados via Gollog e LATAM Cargo para os principais aeroportos do país com rastreio em tempo real.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-[#1C1917] mb-0.5">
                Kit Filhote & Suporte Vitalício
              </strong>
              <span>
                Orientação direta com a criadora Daniela por toda a vida do cãozinho sobre alimentação, saúde e adaptação.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
