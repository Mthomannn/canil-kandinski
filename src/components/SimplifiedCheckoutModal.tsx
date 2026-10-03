import React, { useState } from 'react';
import { Dog, KennelConfig, ReservationOrder } from '../types';
import { storageService } from '../services/storageService';
import {
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  Barcode,
  Copy,
  Check,
  ShieldCheck,
  Plane,
  Home,
  MessageCircle,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  dog: Dog | null;
  config: KennelConfig;
  onClose: () => void;
  onOpenContract: (order: ReservationOrder, dog: Dog) => void;
  onOrderSuccess: (order: ReservationOrder) => void;
}

export const SimplifiedCheckoutModal: React.FC<Props> = ({
  dog,
  config,
  onClose,
  onOpenContract,
  onOrderSuccess,
}) => {
  if (!dog) return null;

  // Steps: 1: Delivery & Plan, 2: Customer Data, 3: Payment, 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [paymentPlan, setPaymentPlan] = useState<'deposit' | 'full'>('deposit');
  const [deliveryMethod, setDeliveryMethod] = useState<ReservationOrder['deliveryMethod']>(
    'Retirada em Porto Alegre (Canil)'
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Porto Alegre');
  const [customerState, setCustomerState] = useState('RS');

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [installments, setInstallments] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ReservationOrder | null>(null);

  const deliveryCost =
    deliveryMethod === 'Envio Aéreo Nacional (Gollog/LATAM)'
      ? 650
      : deliveryMethod === 'Entrega VIP Climatizada (RS/SC)'
      ? 280
      : 0;

  const baseAmount = paymentPlan === 'deposit' ? dog.depositAmount : dog.price;
  const totalAmount = baseAmount + deliveryCost;

  // Pix mock payload
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${config.pixKey}520400005303986540${totalAmount}.005802BR5925${config.ownerName.slice(
    0,
    25
  )}6012PORTO ALEGRE62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleProceedToStep2 = () => {
    setStep(2);
  };

  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerCpf.trim()) {
      alert('Por favor, preencha os dados obrigatórios para emissão da reserva.');
      return;
    }
    setStep(3);
  };

  const handleFinalizeReservation = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = storageService.createOrder({
        dogId: dog.id,
        dogName: dog.name,
        breed: dog.breed,
        gender: dog.gender,
        customerName,
        customerPhone,
        customerEmail,
        customerCpf,
        customerAddress,
        customerCity,
        customerState,
        deliveryMethod,
        paymentMethod,
        paymentPlan,
        totalAmount,
        installments: paymentMethod === 'credit_card' ? installments : undefined,
        status: paymentMethod === 'pix' ? 'Confirmado' : 'Aguardando Pagamento',
        notes: `Reserva realizada via checkout simplificado. Modalidade: ${
          paymentPlan === 'deposit' ? 'Sinal de Reserva' : 'Valor Total'
        }.`,
      });

      setCreatedOrder(order);
      setIsProcessing(false);
      setStep(4);
      onOrderSuccess(order);
    }, 800);
  };

  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] my-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#059669]" />
            <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
              Checkout Seguro · Canil Kandinski
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar checkout"
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 pt-3 pb-2 bg-[#FAFAF9] border-b border-[#E7E5E4]">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className={step >= 1 ? 'font-semibold text-[#1C1917]' : ''}>
              1. Opções & Envio
            </span>
            <span className="text-[#D6D3D1]">/</span>
            <span className={step >= 2 ? 'font-semibold text-[#1C1917]' : ''}>
              2. Dados do Tutor
            </span>
            <span className="text-[#D6D3D1]">/</span>
            <span className={step >= 3 ? 'font-semibold text-[#1C1917]' : ''}>
              3. Pagamento
            </span>
            <span className="text-[#D6D3D1]">/</span>
            <span className={step >= 4 ? 'font-semibold text-[#059669]' : ''}>
              4. Confirmação
            </span>
          </div>
        </div>

        {/* Dog Summary Strip */}
        <div className="px-6 py-3 bg-[#F5F5F4] flex items-center justify-between border-b border-[#E7E5E4]">
          <div className="flex items-center gap-3">
            <img
              src={dog.imageUrl}
              alt={dog.name}
              className="w-12 h-12 rounded-lg object-cover border border-[#E7E5E4]"
            />
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917]">{dog.name}</h4>
              <p className="text-xs text-[#78716C]">
                {dog.breed} · {dog.gender} · Microchip OK
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#78716C] block">Total a pagar:</span>
            <span className="text-base font-bold font-mono text-[#1C1917] tabular-nums">
              R$ {totalAmount.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: Plan & Delivery */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                  Escolha como deseja reservar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentPlan('deposit')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentPlan === 'deposit'
                        ? 'border-[#1C1917] bg-[#FAFAF9] shadow-xs'
                        : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1C1917]">
                        Sinal de Reserva Facilitado
                      </span>
                      <span className="w-4 h-4 rounded-full border border-[#1C1917] flex items-center justify-center">
                        {paymentPlan === 'deposit' && (
                          <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
                        )}
                      </span>
                    </div>
                    <span className="text-lg font-bold font-mono text-[#B45309] block tabular-nums">
                      R$ {dog.depositAmount.toLocaleString('pt-BR')}
                    </span>
                    <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                      Garante imediatamente o filhote. O restante é pago na retirada ou antes do embarque.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentPlan('full')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentPlan === 'full'
                        ? 'border-[#1C1917] bg-[#FAFAF9] shadow-xs'
                        : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1C1917]">
                        Valor Integral à Vista/Cartão
                      </span>
                      <span className="w-4 h-4 rounded-full border border-[#1C1917] flex items-center justify-center">
                        {paymentPlan === 'full' && (
                          <span className="w-2 h-2 rounded-full bg-[#1C1917]" />
                        )}
                      </span>
                    </div>
                    <span className="text-lg font-bold font-mono text-[#1C1917] block tabular-nums">
                      R$ {dog.price.toLocaleString('pt-BR')}
                    </span>
                    <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                      Quita o filhote 100%. Parcelamento disponível em até 12x no cartão de crédito.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                  Forma de Entrega / Retirada:
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setDeliveryMethod('Retirada em Porto Alegre (Canil)')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'Retirada em Porto Alegre (Canil)'
                        ? 'border-[#1C1917] bg-[#FAFAF9]'
                        : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-[#57534E]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1C1917] block">
                          Retirada Presencial no Canil Kandinski
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          Porto Alegre - RS (Belém Velho / Zona Sul) com agendamento
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#059669]">Grátis</span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('Envio Aéreo Nacional (Gollog/LATAM)')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'Envio Aéreo Nacional (Gollog/LATAM)'
                        ? 'border-[#1C1917] bg-[#FAFAF9]'
                        : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Plane className="w-4 h-4 text-[#57534E]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1C1917] block">
                          Envio Aéreo para todo o Brasil (Gollog / LATAM)
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          Em caixa homologada IATA climatizada + Guia Sanitária MAPA
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#1C1917]">
                      + R$ 650
                    </span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('Entrega VIP Climatizada (RS/SC)')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'Entrega VIP Climatizada (RS/SC)'
                        ? 'border-[#1C1917] bg-[#FAFAF9]'
                        : 'border-[#E7E5E4] hover:border-[#D6D3D1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-[#57534E]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1C1917] block">
                          Entrega VIP em Domicílio (Região Sul)
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          Veículo do canil climatizado para Porto Alegre, Serra e SC
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#1C1917]">
                      + R$ 280
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToStep2}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Avançar para Dados do Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Customer Data */}
          {step === 2 && (
            <form onSubmit={handleProceedToStep3} className="space-y-4">
              <div className="bg-[#FAFAF9] p-3 rounded-lg border border-[#E7E5E4] text-xs text-[#57534E]">
                Estes dados serão utilizados para confecção do contrato oficial de reserva e registro de transferência do pedigree no Kennel Clube (KCRGS).
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    Nome Completo do Tutor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silveira"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      WhatsApp para Contato *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(51) 99999-0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      CPF (para contrato e nota) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={customerCpf}
                      onChange={(e) => setCustomerCpf(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    E-mail para Envio de Documentos
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                </div>

                {deliveryMethod !== 'Retirada em Porto Alegre (Canil)' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Endereço Completo de Destino / Aeroporto Mais Próximo
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, número, bairro ou Aeroporto de preferência"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Ir para Escolha do Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F5F4] rounded-xl border border-[#E7E5E4]">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#059669]" />
                  <span>PIX (Instantâneo)</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Cartão 12x</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('boleto')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'boleto'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <Barcode className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Boleto</span>
                </button>
              </div>

              {/* PIX DETAILS */}
              {paymentMethod === 'pix' && (
                <div className="space-y-4">
                  <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 text-center">
                    <p className="text-xs font-semibold text-[#065F46] mb-1">
                      Aprovação Imediata & Garantia da Vaga
                    </p>
                    <p className="text-[11px] text-[#047857]">
                      Ao pagar via PIX, o sistema bloqueia automaticamente o filhote no site.
                    </p>
                  </div>

                  <div className="border border-[#E7E5E4] rounded-xl p-4 text-center space-y-3 bg-[#FAFAF9]">
                    {/* Visual QR Code Representation with clean SVG */}
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-lg border border-[#D6D3D1] shadow-xs flex items-center justify-center">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-[#1C1917]"
                        fill="currentColor"
                      >
                        <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                        <rect x="5" y="5" width="20" height="20" fill="white" />
                        <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                        <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                        <rect x="75" y="5" width="20" height="20" fill="white" />
                        <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                        <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                        <rect x="5" y="75" width="20" height="20" fill="white" />
                        <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                        {/* Pixel pattern matrix */}
                        <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="55" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="40" y="25" width="15" height="10" fill="currentColor" />
                        <rect x="40" y="45" width="20" height="20" fill="currentColor" />
                        <rect x="45" y="50" width="10" height="10" fill="white" />
                        <rect x="10" y="45" width="10" height="15" fill="currentColor" />
                        <rect x="25" y="45" width="10" height="10" fill="currentColor" />
                        <rect x="70" y="40" width="20" height="10" fill="currentColor" />
                        <rect x="65" y="60" width="10" height="20" fill="currentColor" />
                        <rect x="80" y="70" width="15" height="15" fill="currentColor" />
                        <rect x="40" y="80" width="15" height="10" fill="currentColor" />
                      </svg>
                    </div>

                    <div className="text-xs text-[#57534E] space-y-0.5">
                      <p>
                        Favorecido:{' '}
                        <strong className="text-[#1C1917]">{config.pixBeneficiary}</strong>
                      </p>
                      <p>
                        Chave PIX E-mail:{' '}
                        <strong className="text-[#1C1917] font-mono">{config.pixKey}</strong>
                      </p>
                      <p className="text-[11px] text-[#78716C]">
                        Porto Alegre / RS · Banco do Brasil / Nubank
                      </p>
                    </div>

                    <button
                      onClick={handleCopyPix}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-[#1C1917] bg-white border border-[#D6D3D1] hover:bg-[#F5F5F4] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-4 h-4 text-[#059669]" />
                          <span className="text-[#059669]">Código Pix Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#78716C]" />
                          <span>Copiar Código Pix Copia e Cola</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* CREDIT CARD */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="COMO NO CARTÃO"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        placeholder="12/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">
                      Opção de Parcelamento
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917] bg-white cursor-pointer"
                    >
                      <option value={1}>
                        1x de R$ {totalAmount.toLocaleString('pt-BR')} (sem juros)
                      </option>
                      <option value={3}>
                        3x de R$ {(totalAmount / 3).toFixed(2)} (sem juros)
                      </option>
                      <option value={6}>
                        6x de R$ {(totalAmount / 6).toFixed(2)} (sem juros)
                      </option>
                      <option value={10}>
                        10x de R$ {(totalAmount / 10).toFixed(2)}
                      </option>
                      <option value={12}>
                        12x de R$ {(totalAmount / 12).toFixed(2)}
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* BOLETO */}
              {paymentMethod === 'boleto' && (
                <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-4 text-center space-y-2">
                  <Barcode className="w-10 h-10 text-[#57534E] mx-auto" />
                  <p className="text-xs font-semibold text-[#1C1917]">
                    Boleto Bancário com Vencimento em 3 Dias
                  </p>
                  <p className="text-[11px] text-[#78716C] leading-snug">
                    A confirmação do boleto ocorre em até 1 dia útil após o pagamento em qualquer agência bancária ou internet banking.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeReservation}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <span>Registrando Reserva com Segurança...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Concluir e Confirmar Reserva</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success / Confirmation */}
          {step === 4 && createdOrder && (
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-14 h-14 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full flex items-center justify-center mx-auto text-[#059669]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#059669] block mb-1">
                  Reserva Registrada com Sucesso!
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#1C1917]">
                  Parabéns, {customerName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#57534E] mt-1 max-w-sm mx-auto">
                  O filhote <strong className="text-[#1C1917]">{dog.name}</strong> foi reservado para sua família. Nosso protocolo oficial de atendimento:
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-[#F5F5F4] rounded-md font-mono text-sm font-bold text-[#1C1917] border border-[#E7E5E4]">
                  {createdOrder.protocolNumber}
                </div>
              </div>

              <div className="bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Filhote:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {dog.name} ({dog.breed})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Modalidade:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {paymentPlan === 'deposit' ? 'Sinal de Reserva' : 'Valor Total'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Entrega:</span>
                  <span className="font-semibold text-[#1C1917]">{deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Valor Pago / Registrado:</span>
                  <span className="font-bold font-mono text-[#059669] tabular-nums">
                    R$ {totalAmount.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Conversion Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Acabei%20de%20fazer%20a%20reserva%20do%20filhote%20${encodeURIComponent(
                    dog.name
                  )}%20(${encodeURIComponent(dog.breed)})%20no%20site%20pelo%20protocolo%20${encodeURIComponent(
                    createdOrder.protocolNumber
                  )}.%20Segue%20meu%20nome:%20${encodeURIComponent(
                    customerName
                  )}%20e%20telefone:%20${encodeURIComponent(customerPhone)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Confirmação no WhatsApp da Daniela</span>
                </a>

                <button
                  onClick={() => onOpenContract(createdOrder, dog)}
                  className="w-full py-2.5 px-4 text-xs font-medium text-[#1C1917] bg-white border border-[#D6D3D1] hover:bg-[#F5F5F4] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#78716C]" />
                  <span>Visualizar Contrato de Reserva & Garantia Sanitária</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors underline pt-2 block mx-auto cursor-pointer"
              >
                Voltar à página principal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
