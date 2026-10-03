import React, { useState } from 'react';
import { NoticePost } from '../types';
import { BookOpen, ChevronRight, X, Sparkles } from 'lucide-react';

interface Props {
  notices: NoticePost[];
}

export const CareGuideSection: React.FC<Props> = ({ notices }) => {
  const [selectedNotice, setSelectedNotice] = useState<NoticePost | null>(null);

  const guideArticles = [
    {
      id: 'guide-1',
      title: 'Guia de Adaptação: Os Primeiros 7 Dias do Filhote no Novo Lar',
      category: 'Adaptação',
      readTime: '4 min de leitura',
      excerpt:
        'Dicas práticas para preparar a caminha, o comedouro e lidar com os chorinhos da primeira noite sem estresse.',
      fullText:
        'A transição para um novo lar é um momento marcante na vida do filhote. No Canil Kandinski, enviamos um paninho com o cheiro da mãe e dos irmãos para que ele sinta conforto imediato. Evite mudar abruptamente a marca da ração nos primeiros 14 dias para não causar desarranjos intestinais. Mantenha uma rotina previsível de alimentação, passeios ao tapete higiênico e descanso.',
    },
    {
      id: 'guide-2',
      title: 'Calendário de Vacinas: Por que Usamos Apenas Vacinas Importadas (V10)?',
      category: 'Saúde Animal',
      readTime: '3 min de leitura',
      excerpt:
        'Entenda a diferença crucial de imunização entre vacinas nacionais e importadas para prevenir Parvovirose e Cinomose.',
      fullText:
        'As vacinas importadas (como Vanguard Plus e Nobivac) passam por rigorosos testes internacionais de termolabilidade e eficácia em anticorpos maternos. No Canil Kandinski, nenhum filhote sai sem ter recebido no mínimo a vacina Puppy DP e a primeira ou segunda dose da V10 importada com registro no CRMV.',
    },
    {
      id: 'guide-3',
      title: 'Cuidados Especiais com as Dobras e Respiração do Bulldog Inglês',
      category: 'Manejo de Raça',
      readTime: '5 min de leitura',
      excerpt:
        'Como higienizar as dobras faciais, manter a pele sempre seca e garantir passeios seguros nos dias quentes.',
      fullText:
        'O Bulldog Inglês é um cão fascinante e de fácil convívio, mas requer atenção às suas ruguinhas: devem ser limpas com gaze seca ou loção antisséptica específica para evitar umidade e fungos. Em dias de calor acima de 26°C, prefira passeios no início da manhã ou fim de tarde, mantendo o ambiente climatizado.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
              <span>Orientação Veterinária & Dicas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
              Cuidados e Bem-Estar com seu Cãozinho
            </h2>
            <p className="text-sm text-[#78716C] mt-1 max-w-xl">
              Conteúdos criados pela criadora Daniela e médicos veterinários para guiar os futuros tutores desde o nascimento até a fase adulta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guideArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-[#E7E5E4] p-6 flex flex-col justify-between hover:border-[#D6D3D1] hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-3">
                  <span className="font-semibold text-[#854D0E]">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-base font-serif-display font-bold text-[#1C1917] leading-snug mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-[#57534E] leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F5F5F4]">
                <button
                  onClick={() =>
                    setSelectedNotice({
                      id: article.id,
                      title: article.title,
                      category: 'Cuidados',
                      date: '2026',
                      excerpt: article.excerpt,
                      content: article.fullText,
                      active: true,
                    })
                  }
                  className="text-xs font-semibold text-[#1C1917] hover:text-[#78350F] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Ler artigo completo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Reading Guide */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#E7E5E4] shadow-2xl relative">
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-4 right-4 p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-wider font-semibold text-[#854D0E] block mb-1">
                Canil Kandinski · Dicas de Criador
              </span>
              <h3 className="text-xl font-serif-display font-bold text-[#1C1917] mb-4">
                {selectedNotice.title}
              </h3>

              <div className="text-xs sm:text-sm text-[#44403C] leading-relaxed space-y-3">
                <p>{selectedNotice.content}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E5E4] flex justify-end">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded-lg hover:bg-[#292524] cursor-pointer"
                >
                  Fechar Artigo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
