import React from 'react';
import { Testimonial } from '../types';
import { storageService } from '../services/storageService';
import { Star, CheckCircle } from 'lucide-react';

interface Props {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<Props> = ({ testimonials: propTestimonials }) => {
  const testimonials = propTestimonials || storageService.getTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
            <span>Famílias Satisfeitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
            O que dizem os tutores dos nossos cães
          </h2>
          <p className="text-sm text-[#78716C] mt-2">
            Centenas de lares transformados pela alegria, saúde e companheirismo dos cães criados pela Daniela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#D97706]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#44403C] italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>

              {/* Author & Breed */}
              <div className="pt-4 mt-4 border-t border-[#E7E5E4] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917] flex items-center gap-1">
                    <span>{test.customerName}</span>
                    <CheckCircle className="w-3 h-3 text-[#059669]" />
                  </h4>
                  <span className="text-[11px] text-[#78716C] block">{test.city}</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#854D0E] block">
                    {test.dogName}
                  </span>
                  <span className="text-[10px] text-[#A8A29E]">{test.breed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
