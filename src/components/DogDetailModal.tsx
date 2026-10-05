import React from 'react';
import { Dog, KennelConfig } from '../types';
import { X, ShieldCheck, Heart, Calendar, Award, CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';

interface Props {
  dog: Dog | null;
  config: KennelConfig;
  onClose: () => void;
  onProceedToCheckout: (dog: Dog) => void;
}

export const DogDetailModal: React.FC<Props> = ({
  dog,
  config,
  onClose,
  onProceedToCheckout,
}) => {
  if (!dog) return null;

  const isAvailable = dog.status === 'Disponível';
  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] my-8 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-[#44403C] hover:text-[#1C1917] rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Left Column */}
        <div className="md:w-1/2 relative bg-[#F5F5F4] min-h-[280px] md:min-h-full">
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block">
              {dog.breed}
            </span>
            <h3 className="text-2xl font-serif-display font-bold leading-tight">
              {dog.name}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {dog.gender} · {dog.color}
              {dog.coatType ? ` · ${dog.coatType}` : ''}
              {dog.headFormat ? ` · ${dog.headFormat}` : ''}
            </p>
          </div>
        </div>

        {/* Info Right Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Availability status */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isAvailable
                    ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                    : 'bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]'
                }`}
              >
                {isAvailable ? 'Disponível para Reserva' : 'Status: ' + dog.status}
              </span>
              <span className="text-xs text-[#78716C] font-mono">
                Ref: {dog.pedigreeRegister}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
              {dog.description}
            </p>

            {/* Pedigree & Lineage */}
            <div className="bg-[#FAFAF9] p-3.5 rounded-xl border border-[#E7E5E4] text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-[#1C1917]">
                <Award className="w-4 h-4 text-[#B45309]" />
                <span>Linhagem e Filiação</span>
              </div>
              <div className="text-[#57534E] space-y-1 pl-1">
                <div>
                  <span className="text-[#78716C]">Pai:</span>{' '}
                  <strong className="text-[#1C1917]">{dog.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[#78716C]">Mãe:</span>{' '}
                  <strong className="text-[#1C1917]">{dog.motherName}</strong>
                </div>
                <div>
                  <span className="text-[#78716C]">Registro Oficial:</span>{' '}
                  <span className="font-mono text-[#1C1917]">{dog.pedigreeRegister}</span>
                </div>
              </div>
            </div>

            {/* Health & Vaccines */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-[#1C1917] block">
                Protocolo Sanitário & Cuidados:
              </span>
              <ul className="space-y-1 text-[#57534E]">
                {dog.vaccines.map((v, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Microchip ISO 11784/11785 implantado com leitor internacional</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing & Reservation CTA */}
          <div className="pt-4 border-t border-[#E7E5E4] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-[#78716C] block">Valor à Vista</span>
                <span className="text-xl font-bold font-mono text-[#1C1917] tabular-nums">
                  R$ {dog.price.toLocaleString('pt-BR')}
                </span>
                <span className="text-[11px] text-[#78716C] block">ou até 12x no cartão</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#78716C] block">Sinal de Reserva</span>
                <span className="text-base font-semibold font-mono text-[#B45309] tabular-nums">
                  R$ {dog.depositAmount.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(dog);
                }}
                disabled={!isAvailable}
                className={`w-full py-3 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAvailable
                    ? 'text-white bg-[#1C1917] hover:bg-[#292524] shadow-xs active:scale-[0.99]'
                    : 'text-[#A8A29E] bg-[#F5F5F4] cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAvailable ? 'Prosseguir para Checkout Simplificado' : 'Filhote já Reservado'}</span>
              </button>

              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Tenho%20interesse%20no%20filhote%20${encodeURIComponent(
                  dog.name
                )}%20(${encodeURIComponent(dog.breed)}).%20Poderia%20me%20passar%20mais%20informações?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-xs font-medium text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#059669]" />
                <span>Tirar Dúvidas com Daniela no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
