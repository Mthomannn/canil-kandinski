import React, { useState, useEffect, useRef } from 'react';
import {
  Dog,
  KennelConfig,
  ReservationOrder,
  NoticePost,
  Testimonial,
  DogBreed,
  DogStatus,
  GalleryPhoto,
  HistoryMilestone,
} from '../../types';
import { storageService } from '../../services/storageService';
import { kennelImages } from '../../assets/images';
import {
  Lock,
  LogOut,
  Globe,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Settings,
  Dog as DogIcon,
  MessageCircle,
  AlertTriangle,
  Save,
  Eye,
  Check,
  X,
  Upload,
  Search,
  Filter,
  Camera,
  Award,
  Phone,
  DollarSign,
  ShoppingBag,
  Bell,
  MessageSquareQuote,
  ShieldCheck,
  Copy,
  ChevronRight,
  Cloud,
  Download,
} from 'lucide-react';

interface Props {
  config: KennelConfig;
  onCloseAdmin: () => void;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<Props> = ({
  config,
  onCloseAdmin,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storageService.isAdminAuthenticated()
  );
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Tab - 5 Simple, Obvious Tabs
  const [activeTab, setActiveTab] = useState<
    'dogs' | 'history' | 'photos' | 'contacts' | 'orders'
  >('dogs');

  // Live Data States
  const [formConfig, setFormConfig] = useState<KennelConfig>(config);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [orders, setOrders] = useState<ReservationOrder[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [milestones, setMilestones] = useState<HistoryMilestone[]>([]);

  // Search & Filter for Dogs
  const [dogSearch, setDogSearch] = useState('');
  const [breedFilter, setBreedFilter] = useState('all');

  // Modals
  const [editingDog, setEditingDog] = useState<Partial<Dog> | null>(null);
  const [isDogModalOpen, setIsDogModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'dog' | 'photo' | 'milestone' | 'pillar' | 'order';
    id?: string;
    index?: number;
    title: string;
    message: string;
  } | null>(null);

  // Auto-save feedback timestamp
  const [lastSaved, setLastSaved] = useState<string>('Agora');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'danger' } | null>(
    null
  );

  // File input refs for instant photo replacement
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const dogPhotoFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const targetDogIdForPhoto = useRef<string | null>(null);

  const showToast = (text: string, type: 'success' | 'danger' = 'success') => {
    setToastMsg({ text, type });
    setLastSaved(new Date().toLocaleTimeString('pt-BR'));
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = () => {
    const currentCfg = storageService.getConfig();
    setFormConfig(currentCfg);
    setDogs(storageService.getDogs());
    setOrders(storageService.getOrders());
    setGallery(storageService.getGallery());
    setMilestones(currentCfg.historyMilestones || []);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('kandinski_data_updated', handleUpdate);
    return () => window.removeEventListener('kandinski_data_updated', handleUpdate);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = storageService.loginAdmin(pinInput);
    if (success) {
      setIsAuthenticated(true);
      setLoginError(false);
      setPinInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsAuthenticated(false);
  };

  // ================= AUTO-SAVE HELPER FOR CONFIG =================
  const updateConfigValue = (updates: Partial<KennelConfig>) => {
    const saved = storageService.saveConfig(updates);
    setFormConfig(saved);
    if (saved.historyMilestones) {
      setMilestones(saved.historyMilestones);
    }
    onRefreshData();
    showToast('Alteração salva automaticamente!');
  };

  // ================= INSTANT PHOTO UPLOAD HANDLERS =================
  const handleUploadHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        updateConfigValue({ heroImage: dataUrl });
        showToast('Foto de capa do topo atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAboutImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        updateConfigValue({ aboutImage: dataUrl });
        showToast('Foto da história e instalações atualizada!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDogPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetDogIdForPhoto.current) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        storageService.updateDog(targetDogIdForPhoto.current!, { imageUrl: dataUrl });
        loadData();
        onRefreshData();
        showToast('Foto do filhote trocada e salva na hora!');
      }
    };
    reader.readAsDataURL(file);
  };

  // ================= DOG CRUD (SIMPLIFIED) =================
  const handleOpenNewDog = () => {
    setEditingDog({
      name: '',
      breed: 'Golden Retriever',
      gender: 'Macho',
      birthDate: new Date().toISOString().split('T')[0],
      readyDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: 'Dourado',
      price: 5800,
      depositAmount: 1000,
      status: 'Disponível',
      imageUrl: kennelImages.goldenRetriever,
      fatherName: 'Ch. Kandinski Grand Duke',
      motherName: 'Kandinski Royal Amber',
      pedigreeRegister: 'CBKC/KCRGS 2026-09101',
      microchip: true,
      vaccines: ['1ª Dose Puppy DP', '1ª Dose V10 Importada', '3x Vermífugo'],
      description: 'Filhote saudável, sociável e de linhagem nobre.',
      traits: ['Dócil', 'Linhagem Internacional'],
    });
    setIsDogModalOpen(true);
  };

  const handleSaveDogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDog || !editingDog.name) {
      showToast('Por favor, informe o nome do filhote.', 'danger');
      return;
    }

    if (editingDog.id) {
      storageService.updateDog(editingDog.id, editingDog);
      showToast(`Filhote "${editingDog.name}" atualizado com sucesso!`);
    } else {
      storageService.addDog(editingDog as Omit<Dog, 'id'>);
      showToast(`Filhote "${editingDog.name}" cadastrado com sucesso!`);
    }

    setIsDogModalOpen(false);
    setEditingDog(null);
    loadData();
    onRefreshData();
  };

  const handleToggleDogStatus = (dog: Dog) => {
    const newStatus: DogStatus = dog.status === 'Disponível' ? 'Reservado' : 'Disponível';
    storageService.updateDog(dog.id, { status: newStatus });
    loadData();
    onRefreshData();
    showToast(`Filhote "${dog.name}" agora está marcado como ${newStatus}!`);
  };

  // ================= DELETE CONFIRM EXECUTION =================
  const executeDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'dog' && deleteConfirm.id) {
      storageService.deleteDog(deleteConfirm.id);
      showToast('Filhote apagado do site.');
    } else if (deleteConfirm.type === 'photo' && deleteConfirm.id) {
      storageService.deletePhoto(deleteConfirm.id);
      showToast('Foto apagada da galeria.');
    } else if (deleteConfirm.type === 'milestone' && deleteConfirm.id) {
      const updated = milestones.filter((m) => m.id !== deleteConfirm.id);
      setMilestones(updated);
      storageService.saveConfig({ historyMilestones: updated });
      showToast('Marco histórico apagado.');
    } else if (deleteConfirm.type === 'pillar' && deleteConfirm.index !== undefined) {
      const currentPillars = formConfig.aboutPillars || [];
      const updated = currentPillars.filter((_, i) => i !== deleteConfirm.index);
      updateConfigValue({ aboutPillars: updated });
      showToast('Garantia apagada.');
    } else if (deleteConfirm.type === 'order' && deleteConfirm.id) {
      storageService.deleteOrder(deleteConfirm.id);
      showToast('Registro de reserva apagado.');
    }

    setDeleteConfirm(null);
    loadData();
    onRefreshData();
  };

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-[#E7E5E4] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1C1917] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1C1917]">
              Painel do Canil Kandinski
            </h1>
            <p className="text-xs text-[#78716C] mt-1.5">
              Digite a senha de administração para gerenciar o site com facilidade.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder="Digite a senha..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setLoginError(false);
                }}
                className={`w-full px-4 py-3 text-center text-sm font-semibold border rounded-xl focus:outline-none transition-colors ${
                  loginError
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-[#D6D3D1] focus:border-[#1C1917]'
                }`}
              />
              {loginError && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">
                  Senha incorreta. A senha padrão é <span className="font-mono font-bold">kandinski2026</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#292524] rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="pt-4 border-t border-[#E7E5E4] space-y-3">
            <a
              href="/canil-kandinski-github.zip"
              download="canil-kandinski-github.zip"
              className="w-full py-2.5 px-4 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Código Atualizado (.ZIP para GitHub)</span>
            </a>

            <button
              onClick={onCloseAdmin}
              className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Dogs
  const filteredDogs = dogs.filter((d) => {
    if (breedFilter !== 'all' && d.breed !== breedFilter) return false;
    if (dogSearch.trim()) {
      const q = dogSearch.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.color.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] pb-24 font-sans">
      {/* Hidden File Inputs for Instant 1-Click Photo Replacement */}
      <input
        type="file"
        ref={heroFileRef}
        accept="image/*"
        onChange={handleUploadHeroImage}
        className="hidden"
      />
      <input
        type="file"
        ref={aboutFileRef}
        accept="image/*"
        onChange={handleUploadAboutImage}
        className="hidden"
      />
      <input
        type="file"
        ref={dogPhotoFileRef}
        accept="image/*"
        onChange={handleUploadDogPhoto}
        className="hidden"
      />

      {/* Top Header Bar */}
      <header className="bg-[#1C1917] text-white sticky top-0 z-40 border-b border-[#292524] px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#292524] border border-[#44403C] flex items-center justify-center text-amber-400">
              <DogIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">
                {formConfig.kennelName} · Painel Fácil
              </h1>
              <p className="text-[11px] text-[#A8A29E]">
                Edição simples e direta · Criadora {formConfig.ownerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#292524] border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cloud className="w-3.5 h-3.5" />
              <span>Nuvem Google (Firebase) Ativa</span>
            </div>

            <a
              href="/canil-kandinski-github.zip"
              download="canil-kandinski-github.zip"
              className="px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Baixar arquivo ZIP completo para atualizar no GitHub"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar ZIP (GitHub)</span>
            </a>

            <button
              onClick={onCloseAdmin}
              className="px-4 py-2 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Site ao Vivo</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-white hover:bg-[#292524] rounded-xl transition-colors cursor-pointer"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-xl border ${
              toastMsg.type === 'danger'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-emerald-600 text-white border-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Reassuring Auto-Save Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#065F46]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <span className="font-bold block text-sm text-[#064E3B]">
                Salvamento Automático Ativo
              </span>
              <span>
                Tudo o que você alterar, digitar ou escolher é salvo na hora. Você não precisa se preocupar em perder nada.
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              storageService.saveConfig(formConfig);
              storageService.saveDogs(dogs);
              onRefreshData();
              showToast('Tudo confirmado e gravado com sucesso!');
            }}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Agora</span>
          </button>
        </div>

        {/* 5 Simple, Obvious Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-2xl border border-[#E7E5E4] shadow-xs">
          <button
            onClick={() => setActiveTab('dogs')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'dogs'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'text-[#57534E] hover:bg-[#F5F5F4]'
            }`}
          >
            <DogIcon className="w-4 h-4 text-amber-400" />
            <span>Filhotes ({dogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'text-[#57534E] hover:bg-[#F5F5F4]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>História (Desde {formConfig.foundationYear || '2010'})</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'text-[#57534E] hover:bg-[#F5F5F4]'
            }`}
          >
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Fotos do Site</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'text-[#57534E] hover:bg-[#F5F5F4]'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Contatos & PIX</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
              activeTab === 'orders'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'text-[#57534E] hover:bg-[#F5F5F4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span>Reservas ({orders.length})</span>
          </button>
        </div>

        {/* ================= ABA 1: FILHOTES ================= */}
        {activeTab === 'dogs' && (
          <div className="space-y-6">
            {/* Header + Add button */}
            <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1C1917]">
                  Filhotes Cadastrados no Site
                </h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Clique em "Trocar Foto", "Mudar Preço" ou marque como "Reservado" a qualquer momento.
                </p>
              </div>

              <button
                onClick={handleOpenNewDog}
                className="px-5 py-3 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Novo Filhote</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por nome ou cor..."
                value={dogSearch}
                onChange={(e) => setDogSearch(e.target.value)}
                className="px-4 py-2.5 bg-white border border-[#D6D3D1] rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:border-[#1C1917]"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['all', 'Golden Retriever', 'Bulldog Inglês', 'Chihuahua'].map((breed) => (
                  <button
                    key={breed}
                    onClick={() => setBreedFilter(breed)}
                    className={`px-3.5 py-2 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      breedFilter === breed
                        ? 'bg-[#1C1917] text-white'
                        : 'bg-white text-[#57534E] hover:bg-[#E7E5E4]'
                    }`}
                  >
                    {breed === 'all' ? 'Todas as Raças' : breed}
                  </button>
                ))}
              </div>
            </div>

            {/* Puppy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDogs.map((dog) => (
                <div
                  key={dog.id}
                  className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Dog Photo with Instant Change Button */}
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden group">
                      <img
                        src={dog.imageUrl}
                        alt={dog.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          targetDogIdForPhoto.current = dog.id;
                          dogPhotoFileRef.current?.click();
                        }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#1C1917]/90 hover:bg-[#1C1917] text-white text-[11px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Trocar Foto</span>
                      </button>

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 rounded-md">
                          {dog.breed}
                        </span>
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                            dog.status === 'Disponível'
                              ? 'bg-emerald-600 text-white'
                              : dog.status === 'Reservado'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-600 text-white'
                          }`}
                        >
                          {dog.status}
                        </span>
                      </div>
                    </div>

                    {/* Dog Details */}
                    <div className="p-4 space-y-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-[#1C1917]">{dog.name}</h3>
                          <p className="text-[#78716C] text-[11px]">
                            {dog.gender} · Cor {dog.color}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold font-mono text-[#059669]">
                            R$ {dog.price.toLocaleString('pt-BR')}
                          </span>
                          <span className="block text-[10px] text-[#78716C]">
                            Sinal: R$ {dog.depositAmount?.toLocaleString('pt-BR') || '1.000'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#57534E] text-[11px] line-clamp-2 leading-relaxed bg-[#FAFAF9] p-2.5 rounded-lg border border-[#F5F5F4]">
                        {dog.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="p-4 pt-0 border-t border-[#F5F5F4] flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleToggleDogStatus(dog)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-[11px] ${
                        dog.status === 'Disponível'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {dog.status === 'Disponível' ? 'Marcar Reservado' : 'Marcar Disponível'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingDog(dog);
                          setIsDogModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#FAFAF9] hover:bg-[#E7E5E4] text-[#1C1917] font-semibold rounded-lg border border-[#D6D3D1] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'dog',
                            id: dog.id,
                            title: 'Apagar Filhote',
                            message: `Deseja realmente apagar o filhote "${dog.name}" do site? Esta ação removerá o cãozinho do catálogo.`,
                          })
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Apagar este filhote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA 2: HISTÓRIA & TEXTOS ================= */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 sm:p-8 shadow-xs space-y-6 text-xs">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-[#1C1917]">
                História do Canil Kandinski & Textos Institucionais
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Altere aqui o ano de fundação ({formConfig.foundationYear || '2010'}), a trajetória da criadora Daniela e a foto das instalações.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Ano que Iniciou o Canil *
                  </label>
                  <input
                    type="text"
                    value={formConfig.foundationYear || '2010'}
                    onChange={(e) => updateConfigValue({ foundationYear: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl font-mono text-base font-bold text-[#B45309]"
                  />
                  <span className="text-[10px] text-[#78716C] block mt-1">
                    Atualiza instantaneamente todos os "Desde {formConfig.foundationYear || '2010'}" do site (topo, história e rodapé).
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Nome da Criadora Responsável *
                  </label>
                  <input
                    type="text"
                    value={formConfig.ownerName}
                    onChange={(e) => updateConfigValue({ ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Título da Seção de História
                </label>
                <input
                  type="text"
                  value={formConfig.aboutTitle}
                  onChange={(e) => updateConfigValue({ aboutTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Texto da História (Parágrafo 1 - Fundação e Amor aos Cães)
                </label>
                <textarea
                  rows={4}
                  value={formConfig.aboutParagraph1}
                  onChange={(e) => updateConfigValue({ aboutParagraph1: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#D6D3D1] rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Texto sobre o Espaço e Cuidado (Parágrafo 2 - Áreas Verdes e Bio Sensor)
                </label>
                <textarea
                  rows={4}
                  value={formConfig.aboutParagraph2}
                  onChange={(e) => updateConfigValue({ aboutParagraph2: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#D6D3D1] rounded-xl leading-relaxed"
                />
              </div>

              {/* Foto das Instalações com Troca Imediata */}
              <div className="pt-4 border-t border-[#E7E5E4]">
                <label className="block font-bold text-[#1C1917] mb-2">
                  Foto do Canil e Instalações (Exibida na História)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#FAFAF9] p-4 rounded-2xl border border-[#E7E5E4]">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200 border border-[#D6D3D1]">
                    <img
                      src={formConfig.aboutImage}
                      alt="Instalações"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[#57534E] text-xs">
                      Esta foto aparece ao lado da história do canil, mostrando suas instalações e pátios verdes.
                    </p>
                    <button
                      type="button"
                      onClick={() => aboutFileRef.current?.click()}
                      className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Escolher Nova Foto do Canil</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Garantias Oficiais */}
              <div className="pt-4 border-t border-[#E7E5E4] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#1C1917]">
                    Garantias e Compromissos Exibidos na História
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const title = window.prompt('Digite o título da garantia (Ex: Acompanhamento Semanal):');
                      if (!title) return;
                      const desc = window.prompt('Digite a descrição da garantia:') || '';
                      const current = formConfig.aboutPillars || [];
                      updateConfigValue({ aboutPillars: [...current, { title, desc }] });
                    }}
                    className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Garantia</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formConfig.aboutPillars || []).map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] flex items-center justify-between gap-3"
                    >
                      <div>
                        <strong className="block text-[#1C1917]">{pillar.title}</strong>
                        <span className="text-[#57534E] text-[11px]">{pillar.desc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'pillar',
                            index: idx,
                            title: 'Apagar Garantia',
                            message: `Deseja remover "${pillar.title}" da lista de garantias?`,
                          })
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: FOTOS DO SITE ================= */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Foto de Capa do Topo (Hero) */}
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1C1917]">
                    1. Foto de Capa do Topo do Site
                  </h3>
                  <p className="text-[#78716C]">
                    Esta é a imagem principal que os visitantes veem logo que entram no site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => heroFileRef.current?.click()}
                  className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Trocar Foto de Capa</span>
                </button>
              </div>

              <div className="relative aspect-[16/8] rounded-2xl overflow-hidden bg-stone-200 border border-[#D6D3D1]">
                <img
                  src={formConfig.heroImage}
                  alt="Foto de Capa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Galeria Geral de Fotos */}
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 shadow-xs space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E5E4]">
                <div>
                  <h3 className="text-base font-bold text-[#1C1917]">
                    2. Fotos da Galeria & Redes Sociais ({gallery.length} fotos)
                  </h3>
                  <p className="text-[#78716C]">
                    Fotos de filhotes, piquetes e dia a dia que aparecem no feed do site.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const title = window.prompt('Digite um título para a foto (Ex: Filhotes brincando no pátio):');
                    if (!title) return;
                    const url = window.prompt('Cole o link da foto ou deixe em branco para carregar uma imagem padrão:');
                    storageService.addPhoto({
                      title,
                      category: 'Filhotes',
                      caption: 'Registro oficial Canil Kandinski',
                      imageUrl: url || kennelImages.goldenRetriever,
                    });
                    loadData();
                    onRefreshData();
                    showToast('Nova foto adicionada à galeria!');
                  }}
                  className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Foto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#E7E5E4] bg-stone-100 group shadow-xs"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-between p-2 text-white">
                      <span className="self-start px-2 py-0.5 bg-black/60 rounded text-[9px] font-bold">
                        {photo.category}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold truncate pr-1">{photo.title}</span>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'photo',
                              id: photo.id,
                              title: 'Apagar Foto',
                              message: `Deseja apagar a foto "${photo.title}" da galeria?`,
                            })
                          }
                          className="p-1 text-red-300 hover:text-red-100 bg-red-950/80 rounded cursor-pointer"
                          title="Apagar foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: CONTATOS & PIX ================= */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 sm:p-8 shadow-xs space-y-6 text-xs">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-[#1C1917]">
                Seus Telefones, Chave PIX e Endereço
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Todas as alterações aqui são refletidas imediatamente nos botões de WhatsApp e no checkout do site.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    WhatsApp de Atendimento *
                  </label>
                  <input
                    type="text"
                    value={formConfig.phone1}
                    onChange={(e) =>
                      updateConfigValue({
                        phone1: e.target.value,
                        whatsapp: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm font-semibold"
                  />
                  <span className="text-[10px] text-[#78716C] block mt-1">
                    Os botões de "Chamar no WhatsApp" abrem este número.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Telefone Secundário / Fixo
                  </label>
                  <input
                    type="text"
                    value={formConfig.phone2}
                    onChange={(e) => updateConfigValue({ phone2: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Chave PIX para Receber o Sinal da Reserva *
                  </label>
                  <input
                    type="text"
                    value={formConfig.pixKey}
                    onChange={(e) => updateConfigValue({ pixKey: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl font-mono text-sm text-[#059669] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Nome Completo do Beneficiário no PIX *
                  </label>
                  <input
                    type="text"
                    value={formConfig.pixBeneficiary}
                    onChange={(e) => updateConfigValue({ pixBeneficiary: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">E-mail Oficial</label>
                  <input
                    type="email"
                    value={formConfig.email}
                    onChange={(e) => updateConfigValue({ email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Endereço Completo em Porto Alegre
                  </label>
                  <input
                    type="text"
                    value={formConfig.fullAddress}
                    onChange={(e) => updateConfigValue({ fullAddress: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Mensagem de Aviso no Topo */}
              <div className="pt-4 border-t border-[#E7E5E4] space-y-2">
                <label className="block font-bold text-[#1C1917]">
                  Mensagem de Destaque no Topo do Site
                </label>
                <input
                  type="text"
                  value={formConfig.bannerNotice}
                  onChange={(e) => updateConfigValue({ bannerNotice: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-xs"
                />
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs">
                  <input
                    type="checkbox"
                    checked={formConfig.bannerNoticeActive}
                    onChange={(e) => updateConfigValue({ bannerNoticeActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1C1917]"
                  />
                  <span>Exibir esta mensagem no topo de todas as páginas</span>
                </label>
              </div>

              {/* Senha do Painel */}
              <div className="pt-4 border-t border-[#E7E5E4]">
                <label className="block font-bold text-[#1C1917] mb-1">
                  Sua Senha de Acesso a Este Painel
                </label>
                <input
                  type="text"
                  value={formConfig.adminPin}
                  onChange={(e) => updateConfigValue({ adminPin: e.target.value })}
                  className="w-full sm:w-64 px-3 py-2 border border-[#D6D3D1] rounded-xl font-mono text-sm font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 5: PEDIDOS & RESERVAS ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <div>
                <h2 className="text-lg font-bold text-[#1C1917]">
                  Reservas Realizadas no Site ({orders.length})
                </h2>
                <p className="text-[#78716C]">
                  Veja os pedidos feitos pelos clientes e entre em contato direto pelo WhatsApp.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-center py-8 text-[#78716C]">
                Nenhuma reserva realizada ainda. Quando um cliente reservar um filhote pelo site, ele aparecerá aqui com o número do WhatsApp dele.
              </p>
            ) : (
              <div className="divide-y divide-[#E7E5E4]">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {order.protocolNumber}
                        </span>
                        <strong className="text-sm text-[#1C1917]">{order.customerName}</strong>
                      </div>
                      <p className="text-[#57534E]">
                        Filhote: <strong className="text-[#1C1917]">{order.dogName}</strong> ({order.breed}) · Valor: R$ {order.totalAmount.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-[#78716C] text-[11px]">
                        Cidade: {order.customerCity || 'Porto Alegre'} · Telefone: {order.customerPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Olá,%20${order.customerName}!%20Aqui%20é%20a%20Daniela%20do%20Canil%20Kandinski%20sobre%20sua%20reserva%20do%20filhote%20${order.dogName}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Falar no WhatsApp</span>
                      </a>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'order',
                            id: order.id,
                            title: 'Apagar Reserva',
                            message: `Deseja apagar o registro da reserva de ${order.customerName}?`,
                          })
                        }
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                        title="Apagar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Auto-Save Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#1C1917]/95 backdrop-blur-md text-white border-t border-[#292524] py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Alterações salvas automaticamente no navegador · Última gravação: <strong className="text-white">{lastSaved}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                storageService.saveConfig(formConfig);
                storageService.saveDogs(dogs);
                onRefreshData();
                showToast('Todas as alterações foram confirmadas e salvas!');
              }}
              className="px-4 py-2 bg-[#292524] hover:bg-[#3E3835] text-white font-bold rounded-xl border border-[#44403C] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Gravar Manualmente</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Site ao Vivo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: CADASTRAR OU EDITAR FILHOTE ================= */}
      {isDogModalOpen && editingDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5E4] my-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4] mb-4">
              <h3 className="text-base font-bold text-[#1C1917]">
                {editingDog.id ? 'Editar Dados do Filhote' : 'Cadastrar Novo Filhote'}
              </h3>
              <button
                onClick={() => setIsDogModalOpen(false)}
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDogForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Nome do Filhote *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kandinski Thor"
                    value={editingDog.name || ''}
                    onChange={(e) => setEditingDog({ ...editingDog, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Raça *</label>
                  <select
                    value={editingDog.breed || 'Golden Retriever'}
                    onChange={(e) =>
                      setEditingDog({
                        ...editingDog,
                        breed: e.target.value as DogBreed,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl bg-white"
                  >
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Bulldog Inglês">Bulldog Inglês</option>
                    <option value="Chihuahua">Chihuahua</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Sexo</label>
                  <select
                    value={editingDog.gender || 'Macho'}
                    onChange={(e) =>
                      setEditingDog({
                        ...editingDog,
                        gender: e.target.value as 'Macho' | 'Fêmea',
                      })
                    }
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl bg-white"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Cor</label>
                  <input
                    type="text"
                    placeholder="Ex: Dourado claro"
                    value={editingDog.color || ''}
                    onChange={(e) => setEditingDog({ ...editingDog, color: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Status</label>
                  <select
                    value={editingDog.status || 'Disponível'}
                    onChange={(e) =>
                      setEditingDog({
                        ...editingDog,
                        status: e.target.value as DogStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl bg-white"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Preço Total à Vista (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingDog.price || 0}
                    onChange={(e) =>
                      setEditingDog({ ...editingDog, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Valor do Sinal de Reserva (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingDog.depositAmount || 0}
                    onChange={(e) =>
                      setEditingDog({ ...editingDog, depositAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Foto do Filhote (URL ou Carregar do Celular)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Cole o link da foto..."
                    value={editingDog.imageUrl || ''}
                    onChange={(e) => setEditingDog({ ...editingDog, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl font-mono text-[11px]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setEditingDog({
                            ...editingDog,
                            imageUrl: event.target.result as string,
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-xs text-[#78716C] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C1917] file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] mb-1">Descrição do Filhote</label>
                <textarea
                  rows={3}
                  value={editingDog.description || ''}
                  onChange={(e) => setEditingDog({ ...editingDog, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDogModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#57534E] hover:bg-[#F5F5F4] rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl cursor-pointer shadow-md"
                >
                  Salvar Filhote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRMAÇÃO DE APAGAR ================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#1C1917]">{deleteConfirm.title}</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">{deleteConfirm.message}</p>

            <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-[#57534E] hover:bg-[#F5F5F4] rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer shadow-md"
              >
                Sim, Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
