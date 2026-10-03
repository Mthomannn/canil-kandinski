import React from 'react';
import { KennelConfig } from '../types';
import { kennelImages } from '../assets/images';
import { ShieldCheck, Stethoscope, Trees, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface Props {
  config: KennelConfig;
}

export const AboutKennelSection: React.FC<Props> = ({ config }) => {
  const pillars =
    config.aboutPillars && config.aboutPillars.length > 0
      ? config.aboutPillars
      : [
          {
            title: 'Transparência & Acompanhamento:',
            desc: 'Os futuros tutores recebem fotos, vídeos e atualizações semanais do desenvolvimento do filhote até o dia da entrega.',
          },
          {
            title: 'Garantia Genética e Sanitária:',
            desc: 'Entregamos contrato formal registrado, atestado de saúde assinado por médico veterinário e garantia contra doenças congênitas.',
          },
          {
            title: 'Envio Aéreo Seguro Homologado:',
            desc: 'Experiência comprovada em embarque aéreo humanizado para qualquer capital do Brasil, com caixas IATA novas e lacradas.',
          },
        ];

  return (
    <section id="sobre" className="py-16 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image & Proof Stack */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E7E5E4] shadow-md aspect-[16/10] bg-[#F5F5F4]">
              <img
                src={config.aboutImage || kennelImages.grounds}
                alt="Instalações e áreas verdes do Canil Kandinski em Porto Alegre"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/grounds.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-white text-xs font-medium">
                Pátios amplos para socialização precoce · Porto Alegre / RS
              </div>
            </div>
          </div>

          {/* Text & History */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
                <span>{config.aboutSubtitle || 'Tradição & Amor à Cinofilia'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
                {config.aboutTitle || 'A história e o compromisso do Canil Kandinski'}
              </h2>
            </div>

            <p className="text-sm text-[#44403C] leading-relaxed text-justify">
              {(
                config.aboutParagraph1 ||
                `Fundado por ${config.ownerName} em Porto Alegre em ${config.foundationYear || '2010'}, o ${config.kennelName} nasceu de uma paixão genuína por cães de raça pura e pelo respeito irrestrito ao bem-estar animal. Desde ${config.foundationYear || '2010'}, com dedicação ininterrupta, construímos uma reputação sólida pautada na transparência, na sanidade e no amor à cinofilia.`
              ).replace(/1998/g, config.foundationYear || '2010')}
            </p>

            <p className="text-sm text-[#57534E] leading-relaxed text-justify">
              {config.aboutParagraph2 ||
                'Diferente de criatórios comerciais que mantêm animais confinados em gaiolas, nossos cães vivem em ambiente familiar e acolhedor, com amplos piquetes de grama natural, solário e estímulo neurológico precoce (Protocolo Bio Sensor) nos primeiros 16 dias de vida.'}
            </p>

            {/* Core Pillars */}
            <div className="space-y-3 pt-2">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#1C1917] block">{pillar.title}</strong>
                    <span className="text-[#57534E]">{pillar.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* History Milestones Timeline (if configured) */}
            {config.historyMilestones && config.historyMilestones.length > 0 && (
              <div className="pt-4 border-t border-[#E7E5E4] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#B45309]" />
                  <span>Marcos Históricos da Nossa Trajetória</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {config.historyMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-3 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] space-y-1 hover:border-[#D6D3D1] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold font-mono text-[#92400E] bg-[#FEF3C7] rounded-md">
                          {milestone.year === '1998' || milestone.title.toLowerCase().includes('fundação')
                            ? config.foundationYear || milestone.year
                            : milestone.year}
                        </span>
                        <span className="text-[10px] font-semibold text-[#78716C] truncate max-w-[140px]">
                          {milestone.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed line-clamp-2">
                        {milestone.description.replace(/1998/g, config.foundationYear || '1998')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
