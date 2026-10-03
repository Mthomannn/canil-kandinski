import React, { useState, useEffect } from 'react';
import { Dog, KennelConfig, ReservationOrder, NoticePost, Testimonial, BreedInfo, GalleryPhoto } from './types';
import { storageService } from './services/storageService';
import { BannerAnnouncement } from './components/BannerAnnouncement';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SalesCatalog } from './components/SalesCatalog';
import { DogDetailModal } from './components/DogDetailModal';
import { SimplifiedCheckoutModal } from './components/SimplifiedCheckoutModal';
import { ContractModal } from './components/ContractModal';
import { BreedsSection } from './components/BreedsSection';
import { AboutKennelSection } from './components/AboutKennelSection';
import { CareGuideSection } from './components/CareGuideSection';
import { SocialGrowthSection } from './components/SocialGrowthSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { MessageCircle } from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';

export default function App() {
  const [config, setConfig] = useState<KennelConfig>(storageService.getConfig());
  const [dogs, setDogs] = useState<Dog[]>(storageService.getDogs());
  const [notices, setNotices] = useState<NoticePost[]>(storageService.getNotices());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(storageService.getTestimonials());
  const [breeds, setBreeds] = useState<BreedInfo[]>(storageService.getBreeds());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(storageService.getGallery());

  // View state: 'admin' if URL matches admin address, otherwise 'public'
  const checkIsAdminUrl = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      hash === '#admin' ||
      hash.startsWith('#admin') ||
      hash === '#painel' ||
      path.startsWith('/admin') ||
      path.startsWith('/painel') ||
      search.includes('admin=true')
    );
  };

  const [viewMode, setViewMode] = useState<'public' | 'admin'>(
    checkIsAdminUrl() ? 'admin' : 'public'
  );

  // Modals
  const [selectedDogForDetails, setSelectedDogForDetails] = useState<Dog | null>(null);
  const [selectedDogForCheckout, setSelectedDogForCheckout] = useState<Dog | null>(null);
  const [contractOrder, setContractOrder] = useState<ReservationOrder | null>(null);
  const [contractDog, setContractDog] = useState<Dog | null>(null);

  // Sync data whenever changed
  const refreshData = () => {
    setConfig(storageService.getConfig());
    setDogs(storageService.getDogs());
    setNotices(storageService.getNotices());
    setTestimonials(storageService.getTestimonials());
    setBreeds(storageService.getBreeds());
    setGallery(storageService.getGallery());
  };

  useEffect(() => {
    const handleUrlCheck = () => {
      if (checkIsAdminUrl()) {
        setViewMode('admin');
      } else {
        setViewMode('public');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key shortcut for site owner/admin: Ctrl+Shift+A or Alt+A
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        window.location.hash = '#admin';
        setViewMode('admin');
      }
    };

    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('kandinski_data_updated', refreshData);

    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('kandinski_data_updated', refreshData);
    };
  }, []);

  const handleCloseAdmin = () => {
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch {
      window.location.hash = '';
    }
    setViewMode('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSales = () => {
    const el = document.getElementById('vendas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBreedFilter = (breedName: string) => {
    const el = document.getElementById('vendas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContractModal = (order: ReservationOrder, dog: Dog) => {
    setContractOrder(order);
    setContractDog(dog);
  };

  const availableCount = dogs.filter((d) => d.status === 'Disponível').length;
  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  // IF ADMIN ADDRESS VISITED (#admin or /admin)
  if (viewMode === 'admin') {
    return (
      <AdminPortal
        config={config}
        onCloseAdmin={handleCloseAdmin}
        onRefreshData={refreshData}
      />
    );
  }

  // PUBLIC WEBSITE VIEW - Zero admin buttons or traces
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col font-sans selection:bg-[#E7E5E4] selection:text-[#1C1917]">
      {/* Top Banner Notice */}
      <BannerAnnouncement config={config} />

      {/* Primary Navigation Bar (Strict 3-zone contract, no admin links) */}
      <Navbar
        config={config}
        onOpenSales={handleOpenSales}
        availableCount={availableCount}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          config={config}
          onExplorePuppies={handleOpenSales}
          availableCount={availableCount}
        />

        {/* High-Conversion Sales Catalog */}
        <SalesCatalog
          dogs={dogs}
          onSelectDogForDetails={(dog) => setSelectedDogForDetails(dog)}
          onSelectDogForCheckout={(dog) => setSelectedDogForCheckout(dog)}
        />

        {/* Breeds Standard & Profiles */}
        <BreedsSection
          breeds={breeds}
          onSelectBreedFilter={handleSelectBreedFilter}
        />

        {/* About Daniela & Kennel Commitment (History) */}
        <AboutKennelSection config={config} />

        {/* Care Guides & Organic Educational Articles */}
        <CareGuideSection notices={notices} />

        {/* Social Traffic Growth & Instagram Community */}
        <SocialGrowthSection config={config} gallery={gallery} />

        {/* Testimonials from Happy Families */}
        <TestimonialsSection testimonials={testimonials} />

        {/* Direct Contact & Visit Scheduling */}
        <ContactSection config={config} />
      </main>

      {/* Institutional Footer */}
      <Footer config={config} onOpenAdmin={() => setViewMode('admin')} />

      {/* PWA Floating Install Button and Offline Status Banner */}
      <PWAInstallButton variant="floating" />
      <OfflineIndicator />

      {/* Floating WhatsApp Quick Action Button for Mobile / Desktop Conversion */}
      <aside aria-label="Atendimento rápido" className="fixed bottom-5 right-5 z-30">
        <a
          href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Estou%20no%20site%20do%20Canil%20Kandinski%20e%20gostaria%20de%20tirar%20uma%20dúvida.`}
          target="_blank"
          rel="noopener noreferrer"
          title="Falar com a Daniela no WhatsApp"
          className="flex items-center gap-2.5 px-4 py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer group"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">WhatsApp do Canil</span>
        </a>
      </aside>

      {/* MODALS */}
      {/* 1. Dog Detail View */}
      {selectedDogForDetails && (
        <DogDetailModal
          dog={selectedDogForDetails}
          config={config}
          onClose={() => setSelectedDogForDetails(null)}
          onProceedToCheckout={(dog) => {
            setSelectedDogForDetails(null);
            setSelectedDogForCheckout(dog);
          }}
        />
      )}

      {/* 2. Simplified High-Conversion Checkout */}
      {selectedDogForCheckout && (
        <SimplifiedCheckoutModal
          dog={selectedDogForCheckout}
          config={config}
          onClose={() => setSelectedDogForCheckout(null)}
          onOpenContract={handleOpenContractModal}
          onOrderSuccess={(order) => {
            refreshData();
          }}
        />
      )}

      {/* 3. Official Kennel Contract & Guarantee Modal */}
      {contractOrder && contractDog && (
        <ContractModal
          order={contractOrder}
          dog={contractDog}
          config={config}
          onClose={() => {
            setContractOrder(null);
            setContractDog(null);
          }}
        />
      )}
    </div>
  );
}
