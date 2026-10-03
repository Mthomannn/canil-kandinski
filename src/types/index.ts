export type DogBreed = 'Golden Retriever' | 'Bulldog Inglês' | 'Chihuahua';

export type DogStatus = 'Disponível' | 'Reservado' | 'Entregue';

export interface Dog {
  id: string;
  name: string;
  breed: DogBreed;
  gender: 'Macho' | 'Fêmea';
  birthDate: string; // YYYY-MM-DD
  readyDate: string; // YYYY-MM-DD
  color: string;
  price: number; // in BRL
  depositAmount: number; // in BRL (e.g. 1000 for reservation)
  status: DogStatus;
  imageUrl: string;
  fatherName: string;
  motherName: string;
  pedigreeRegister: string; // e.g. KCRGS/CBKC 2026/04882
  microchip: boolean;
  vaccines: string[];
  description: string;
  isFeatured?: boolean;
  traits: string[];
}

export interface ReservationOrder {
  id: string;
  protocolNumber: string; // e.g. #KAND-2026-904
  dogId: string;
  dogName: string;
  breed: DogBreed;
  gender: 'Macho' | 'Fêmea';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCpf: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  deliveryMethod: 'Retirada em Porto Alegre (Canil)' | 'Envio Aéreo Nacional (Gollog/LATAM)' | 'Entrega VIP Climatizada (RS/SC)';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  paymentPlan: 'deposit' | 'full'; // Sinal de reserva ou valor integral
  totalAmount: number;
  installments?: number;
  status: 'Aguardando Pagamento' | 'Confirmado' | 'Em Preparação' | 'Entregue' | 'Cancelado';
  createdAt: string;
  notes?: string;
}

export interface BreedInfo {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  traits: string[];
  idealFor: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: 'Capa' | 'Instalações' | 'Filhotes' | 'Matrizes' | 'Dia a Dia';
  imageUrl: string;
  likes?: string;
  createdAt: string;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface KennelConfig {
  kennelName: string;
  ownerName: string;
  foundationYear: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  fullAddress: string;
  kcrgsRegister: string;
  cbkcRegister: string;
  fciRegister: string;
  pixKey: string;
  pixBeneficiary: string;
  bannerNotice: string;
  bannerNoticeActive: boolean;
  adminPin: string; // Access PIN / Password
  instagramHandle: string;
  facebookUrl: string;

  // Hero Section Customization
  heroTitle: string;
  heroSubtitle: string;
  heroBadge1Value: string;
  heroBadge1Label: string;
  heroBadge2Value: string;
  heroBadge2Label: string;
  heroBadge3Value: string;
  heroBadge3Label: string;
  heroImage: string;

  // History & About Section Customization
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutPillars: { title: string; desc: string }[];
  aboutImage: string;
  historyMilestones?: HistoryMilestone[];

  // Financial & Shipping
  depositStandardAmount: number;
  shippingAirAmount: number;
  shippingVipAmount: number;
}

export interface NoticePost {
  id: string;
  title: string;
  category: 'Ninhadas' | 'Avisos' | 'Cuidados' | 'Eventos';
  date: string;
  excerpt: string;
  content: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  city: string;
  breed: string;
  dogName: string;
  rating: number;
  comment: string;
  date: string;
}
