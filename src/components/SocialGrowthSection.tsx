import React, { useState } from 'react';
import { KennelConfig, GalleryPhoto } from '../types';
import { storageService } from '../services/storageService';
import { kennelImages } from '../assets/images';
import {
  Instagram,
  MessageCircle,
  Share2,
  Check,
  Play,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface Props {
  config: KennelConfig;
  gallery?: GalleryPhoto[];
}

export const SocialGrowthSection: React.FC<Props> = ({ config, gallery: propGallery }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const gallery = propGallery || storageService.getGallery();

  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Canil Kandinski - Filhotes de Raça Pura em Porto Alegre',
          text: 'Conheça os filhotes de Golden Retriever, Bulldog Inglês e Chihuahua com pedigree CBKC/FCI no Canil Kandinski!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const instagramPosts =
    gallery && gallery.length > 0
      ? gallery.map((item) => ({
          id: item.id,
          image: item.imageUrl,
          caption: item.caption || item.title,
          likes: item.likes || '350 curtidas',
          tag: item.category || 'Canil Kandinski',
        }))
      : [
          {
            id: 'ig-1',
            image: kennelImages.goldenRetriever,
            caption:
              'Nossos bebês de Golden aproveitando a manhã de sol no gramado de Belém Velho ☀️🐾 #CanilKandinski #GoldenRetrieverRS',
            likes: '384 curtidas',
            tag: 'Golden Retriever',
          },
          {
            id: 'ig-2',
            image: kennelImages.englishBulldog,
            caption:
              'Estrutura, saúde e ruguinhas perfeitas! Ninhada de Bulldog Inglês iniciando a introdução à ração super premium 🥣',
            likes: '492 curtidas',
            tag: 'Bulldog Inglês',
          },
          {
            id: 'ig-3',
            image: kennelImages.chihuahua,
            caption:
              'Chihuahua de bolso com peso estimado de 2kg na fase adulta. Um doce de companhia ❤️ #ChihuahuaBrasil',
            likes: '275 curtidas',
            tag: 'Chihuahua',
          },
          {
            id: 'ig-4',
            image: kennelImages.grounds,
            caption:
              'Espaço verde dedicado ao exercício diário e desenvolvimento motor dos nossos filhotes e reprodutores 🌿',
            likes: '610 curtidas',
            tag: 'Pátio do Canil',
          },
        ];

  return (
    <section id="redes" className="py-16 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
              <span>Redes Sociais & Comunidade</span>
              <span aria-hidden="true">·</span>
              <span>Engajamento Diário</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
              Acompanhe a Rotina do Canil Kandinski
            </h2>
            <p className="text-sm text-[#78716C] mt-1 max-w-2xl">
              Postamos stories diários, vídeos de brincadeiras, visitas veterinárias e novidades sobre gestações e nascimentos. Junte-se à nossa comunidade de tutores!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="text-[#059669]">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Compartilhar Site</span>
                </>
              )}
            </button>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D97706] to-[#DC2626] hover:opacity-95 rounded-lg transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Seguir {config.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Instagram Visual Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl overflow-hidden border border-[#E7E5E4] bg-[#FAFAF9] flex flex-col group hover:shadow-md transition-shadow"
            >
              {/* Media Slot */}
              <div className="relative aspect-square bg-[#F5F5F4] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    if (post.tag.includes('Golden')) e.currentTarget.src = '/golden.jpg';
                    else if (post.tag.includes('Bulldog')) e.currentTarget.src = '/bulldog.jpg';
                    else if (post.tag.includes('Chihuahua')) e.currentTarget.src = '/chihuahua.jpg';
                    else e.currentTarget.src = '/grounds.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white">
                  <span className="text-xs font-medium flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Ver no Instagram</span>
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-xs text-white p-1 rounded-md">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* Text & Likes */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs text-[#44403C] line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-2 border-t border-[#E7E5E4]">
                  <span className="flex items-center gap-1 font-medium">
                    <Heart className="w-3 h-3 text-[#DC2626] fill-current" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="text-[#854D0E] font-medium">{post.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp VIP Community Banner */}
        <div className="mt-10 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#059669] text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#065F46] uppercase tracking-wider">
                  Canal VIP & Lista de Espera
                </span>
                <span className="text-[10px] bg-[#D1FAE5] text-[#047857] px-2 py-0.5 rounded-full font-medium">
                  Acesso Direto
                </span>
              </div>
              <h3 className="text-lg font-serif-display font-bold text-[#064E3B]">
                Receba fotos exclusivas antes do lançamento de novas ninhadas
              </h3>
              <p className="text-xs text-[#047857] mt-1 max-w-xl">
                Seja avisado(a) em primeira mão no WhatsApp quando nascerem novos filhotes com prioridade na escolha do macho ou fêmea.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Gostaria%20de%20entrar%20na%20Lista%20VIP%20de%20Espera%20do%20Canil%20Kandinski%20para%20as%20próximas%20ninhadas.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <span>Entrar na Lista VIP no WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
