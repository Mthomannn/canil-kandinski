import React from 'react';
import { Dog, KennelConfig, ReservationOrder } from '../types';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface Props {
  order: ReservationOrder | null;
  dog: Dog | null;
  config: KennelConfig;
  onClose: () => void;
}

export const ContractModal: React.FC<Props> = ({
  order,
  dog,
  config,
  onClose,
}) => {
  if (!order || !dog) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] my-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9] print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            <h3 className="text-sm font-semibold text-[#1C1917]">
              Instrumento Particular de Reserva e Garantia Sanitária Canina
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-white border border-[#D6D3D1] hover:bg-[#F5F5F4] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar contrato"
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Contract Body */}
        <div className="p-6 sm:p-10 overflow-y-auto max-h-[75vh] text-xs sm:text-sm text-[#292524] space-y-5 leading-relaxed font-sans">
          {/* Header of Contract */}
          <div className="text-center border-b border-[#D6D3D1] pb-6 space-y-1">
            <h2 className="text-lg font-serif-display font-bold text-[#1C1917] tracking-tight">
              {config.kennelName.toUpperCase()}
            </h2>
            <p className="text-xs text-[#57534E]">
              {config.kcrgsRegister} · {config.cbkcRegister} · {config.fciRegister}
            </p>
            <p className="text-xs text-[#78716C]">
              Porto Alegre - Rio Grande do Sul - Brasil
            </p>
            <div className="pt-2 text-xs font-mono font-semibold text-[#1C1917]">
              Protocolo de Reserva Nº {order.protocolNumber}
            </div>
          </div>

          {/* Section 1: Parties */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-xs mb-1">
              1. DAS PARTES CONTRATANTES
            </h4>
            <p className="text-justify text-[#44403C]">
              <strong>CRIADORA RESPONSÁVEL:</strong> {config.ownerName}, à frente do{' '}
              {config.kennelName}, com sede em {config.fullAddress}, telefone de contato {config.phone1}.
            </p>
            <p className="text-justify text-[#44403C] mt-2">
              <strong>ADQUIRENTE / TUTOR:</strong> {order.customerName}, portador(a) do CPF nº{' '}
              {order.customerCpf}, WhatsApp: {order.customerPhone}, residente e domiciliado(a) em{' '}
              {order.customerCity} - {order.customerState}.
            </p>
          </div>

          {/* Section 2: Dog Identification */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-xs mb-1">
              2. DO OBJETO E IDENTIFICAÇÃO DO ANIMAL
            </h4>
            <div className="bg-[#F5F5F4] p-3.5 rounded-lg border border-[#E7E5E4] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#78716C]">Nome de Registro:</span>{' '}
                <strong>{dog.name}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Raça:</span> <strong>{dog.breed}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Sexo:</span> <strong>{dog.gender}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Cor / Pelagem:</span> <strong>{dog.color}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Data de Nascimento:</span>{' '}
                <strong>{dog.birthDate}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Registro KCRGS / CBKC:</span>{' '}
                <strong>{dog.pedigreeRegister}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Pai:</span> <strong>{dog.fatherName}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Mãe:</span> <strong>{dog.motherName}</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Value and Payment */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-xs mb-1">
              3. DO PREÇO, SINAL E FORMA DE PAGAMENTO
            </h4>
            <p className="text-justify text-[#44403C]">
              O valor total ajustado para a aquisição do animal é de{' '}
              <strong>R$ {dog.price.toLocaleString('pt-BR')}</strong>, tendo sido registrado nesta
              data o pagamento de <strong>R$ {order.totalAmount.toLocaleString('pt-BR')}</strong> via{' '}
              {order.paymentMethod.toUpperCase()} a título de{' '}
              {order.paymentPlan === 'deposit' ? 'Sinal de Reserva Garantida' : 'Quitação Integral'}.
              Modalidade de entrega selecionada: <strong>{order.deliveryMethod}</strong>.
            </p>
          </div>

          {/* Section 4: Health and Guarantees */}
          <div>
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-xs mb-1">
              4. DA SANIDADE E GARANTIAS VETERINÁRIAS
            </h4>
            <p className="text-justify text-[#44403C]">
              O animal é entregue em perfeitas condições clínicas e sanitárias, desverminado e com
              as doses de vacina importada (V8/V10 e Puppy) correspondentes à sua idade, acompanhado
              de Carteira de Vacinação assinada por Médico Veterinário registrado no CRMV-RS, bem
              como microchip nacional instalado. O canil garante a sanidade contra doenças infectocontagiosas
              pelo prazo legal de 15 (quinze) dias a contar do recebimento e suporte para sanidade genética.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-t border-[#A8A29E] pt-2 font-semibold">
                {config.ownerName}
              </div>
              <div className="text-[#78716C]">{config.kennelName} · Criadora</div>
            </div>
            <div>
              <div className="border-t border-[#A8A29E] pt-2 font-semibold">
                {order.customerName}
              </div>
              <div className="text-[#78716C]">Adquirente / Tutor(a)</div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#78716C] pt-4">
            Emitido em Porto Alegre - RS, em {currentDate}.
          </div>
        </div>
      </div>
    </div>
  );
};
