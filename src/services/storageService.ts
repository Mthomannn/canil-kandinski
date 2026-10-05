import { Dog, ReservationOrder, KennelConfig, NoticePost, Testimonial, BreedInfo, GalleryPhoto } from '../types';
import { kennelImages } from '../assets/images';
import { cloudSyncService } from './cloudSyncService';

const STORAGE_KEYS = {
  DOGS: 'kandinski_dogs_v1',
  ORDERS: 'kandinski_orders_v1',
  CONFIG: 'kandinski_config_v1',
  NOTICES: 'kandinski_notices_v1',
  TESTIMONIALS: 'kandinski_testimonials_v1',
  BREEDS: 'kandinski_breeds_v1',
  GALLERY: 'kandinski_gallery_v1',
  ADMIN_AUTH: 'kandinski_admin_auth_v1',
};

export const DEFAULT_CONFIG: KennelConfig = {
  kennelName: 'Canil Kandinski',
  ownerName: 'Daniela T. da Silva Fernandes',
  foundationYear: '2010',
  tagline: 'Criação Ética, Responsável e de Linhagem Pura em Porto Alegre/RS · Desde 2010',
  phone1: '(51) 98658-1300',
  phone2: '(51) 99238-1300',
  whatsapp: '5551986581300',
  email: 'daniela.silva999@hotmail.com',
  city: 'Porto Alegre',
  state: 'RS',
  fullAddress: 'Zona Sul / Belém Velho - Porto Alegre, Rio Grande do Sul',
  kcrgsRegister: 'Registro KCRGS nº 14.892',
  cbkcRegister: 'Afiliado CBKC - Confederação Brasileira de Cinofilia',
  fciRegister: 'Reconhecido FCI - Fédération Cynologique Internationale',
  pixKey: 'daniela.silva999@hotmail.com',
  pixBeneficiary: 'Daniela T da Silva Fernandes - Canil Kandinski',
  bannerNotice: '✨ Novas ninhadas de Golden Retriever e Bulldog Inglês disponíveis para reserva! Envio aéreo climatizado para todo o Brasil.',
  bannerNoticeActive: true,
  adminPin: 'kandinski2026',
  instagramHandle: '@canilkandinski',
  facebookUrl: 'https://facebook.com/canilkandinski',

  // Hero Section Customization
  heroTitle: 'Criação ética, pureza de linhagem e dedicação em cada filhote.',
  heroSubtitle: 'Desde 2010 selecionando exemplares com padrão morfológico internacional, temperamento dócil e rigoroso controle genético. Especializados em Golden Retriever, Bulldog Inglês e Chihuahua.',
  heroBadge1Value: 'Desde 2010',
  heroBadge1Label: 'Tradição & Seleção',
  heroBadge2Value: '100%',
  heroBadge2Label: 'Pedigree CBKC / FCI',
  heroBadge3Value: 'Brasil',
  heroBadge3Label: 'Envio Aéreo IATA Seguro',
  heroImage: kennelImages.hero,

  // History & About Section Customization
  aboutTitle: 'A história e o compromisso do Canil Kandinski',
  aboutSubtitle: 'Tradição & Amor à Cinofilia em Porto Alegre',
  aboutParagraph1: 'Fundado por Daniela T. da Silva Fernandes em Porto Alegre em 2010, o Canil Kandinski nasceu de uma paixão genuína por cães de raça pura e pelo respeito irrestrito ao bem-estar animal. Desde 2010, com dedicação ininterrupta, construímos uma reputação sólida pautada na transparência, na sanidade e no amor à cinofilia.',
  aboutParagraph2: 'Diferente de criatórios comerciais que mantêm animais confinados em gaiolas, nossos cães vivem em ambiente familiar e acolhedor, com amplos piquetes de grama natural, solário e estímulo neurológico precoce (Protocolo Bio Sensor) nos primeiros 16 dias de vida.',
  aboutPillars: [
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
  ],
  aboutImage: kennelImages.grounds,
  historyMilestones: [
    {
      id: 'mile-1',
      year: '2010',
      title: 'Fundação do Canil Kandinski',
      description: 'Início da criação ética em Porto Alegre por Daniela T. da Silva Fernandes, com dedicação incondicional à pureza e bem-estar das matrizes.',
    },
    {
      id: 'mile-3',
      year: '2014',
      title: 'Sede Campestre com 5.000m²',
      description: 'Estruturação de piquetes naturais gramados, maternidade com controle térmico e espaço de recreação livre na Zona Sul.',
    },
    {
      id: 'mile-4',
      year: '2019',
      title: 'Protocolo de Estímulo Bio Sensor',
      description: 'Aplicação de estímulos neurológicos precoces que garantem cães mais inteligentes, sociáveis e equilibrados emocionalmente.',
    },
    {
      id: 'mile-5',
      year: '2026',
      title: 'Tradição e Excelência Cinófila',
      description: 'Referência em Golden Retriever, Bulldog Inglês e Chihuahua com tutores em todos os estados do Brasil.',
    },
  ],

  // Financial & Shipping
  depositStandardAmount: 1000,
  shippingAirAmount: 650,
  shippingVipAmount: 280,
};

export const INITIAL_BREEDS: BreedInfo[] = [
  {
    id: 'breed-golden',
    name: 'Golden Retriever',
    tagline: 'O companheiro familiar por excelência',
    image: kennelImages.goldenRetriever,
    description: 'Reconhecido mundialmente por sua extrema doçura, inteligência e paciência com crianças. Nossos reprodutores possuem laudos radiográficos oficiais negativos para Displasia Coxofemoral e de Cotovelos (HD/ED), além de avaliação oftálmica.',
    traits: [
      'Temperamento dócil e tolerante com crianças',
      'Facilidade ímpar de adestramento e obediência',
      'Pelagem densa com subpelo impermeável',
      'Pais com controle genético rigoroso',
    ],
    idealFor: 'Famílias ativas, casas com jardim ou apartamentos com passeios diários.',
  },
  {
    id: 'breed-bulldog',
    name: 'Bulldog Inglês',
    tagline: 'Personalidade nobre, carismática e tranquila',
    image: kennelImages.englishBulldog,
    description: 'Criamos Bulldogs com foco inegociável na saúde respiratória e conformação física correta. Priorizamos exemplares com narinas abertas, palato proporcional e movimentação livre e vigorosa, respeitando as normas da FCI.',
    traits: [
      'Extremamente calmo, silencioso e afetuoso',
      'Pouca exigência de exercícios intensos',
      'Cabeça volumosa com rugas bem cuidadas',
      'Socialização precoce com pessoas e outros animais',
    ],
    idealFor: 'Apartamentos, tutores que apreciam cães tranquilos e companheiros de sofá.',
  },
  {
    id: 'breed-chihuahua',
    name: 'Chihuahua',
    tagline: 'Grande personalidade em tamanho compacto',
    image: kennelImages.chihuahua,
    description: 'Com porte que cabe no colo e peso adulto médio entre 1.8kg e 2.8kg, nossos Chihuahuas de pelo curto unem elegância a uma lealdade incondicional aos seus tutores. Excelente dentição e estrutura óssea sólida.',
    traits: [
      'Excelente cão de guarda de alerta',
      'Facilidade para transporte e viagens de avião na cabine',
      'Cabeça em formato maçã bem demarcada',
      'Higiene impecável e fácil manutenção',
    ],
    idealFor: 'Vida em apartamento, executivos, idosos e pessoas que viajam com frequência.',
  },
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Filhotes de Golden no Gramado',
    caption: 'Manhã de recreação e enriquecimento ambiental nos jardins de Belém Velho.',
    category: 'Filhotes',
    imageUrl: kennelImages.goldenRetriever,
    likes: '384 curtidas',
    createdAt: '2026-09-20',
  },
  {
    id: 'photo-2',
    title: 'Bulldog Inglês Campeão',
    caption: 'Conformação de padrão internacional com narinas desobstruídas e saúde impecável.',
    category: 'Matrizes',
    imageUrl: kennelImages.englishBulldog,
    likes: '492 curtidas',
    createdAt: '2026-09-22',
  },
  {
    id: 'photo-3',
    title: 'Chihuahua Toy de Bolso',
    caption: 'Cãozinho extremamente apegado e delicado, ideal para companhia e viagens.',
    category: 'Filhotes',
    imageUrl: kennelImages.chihuahua,
    likes: '275 curtidas',
    createdAt: '2026-09-25',
  },
  {
    id: 'photo-4',
    title: 'Pátio Verde e Solário',
    caption: 'Área com mais de 5.000m² para exercícios diários e bem-estar canino.',
    category: 'Instalações',
    imageUrl: kennelImages.grounds,
    likes: '610 curtidas',
    createdAt: '2026-09-28',
  },
];

export const INITIAL_DOGS: Dog[] = [
  {
    id: 'dog-golden-thor',
    name: 'Kandinski Thor',
    breed: 'Golden Retriever',
    gender: 'Macho',
    birthDate: '2026-08-10',
    readyDate: '2026-10-15',
    color: 'Dourado Suave / Champanhe',
    price: 5800,
    depositAmount: 1000,
    status: 'Disponível',
    imageUrl: kennelImages.goldenRetriever,
    fatherName: 'Ch. Kandinski Grand Duke (Campeão KCRGS)',
    motherName: 'Kandinski Royal Amber (Excelente Linhagem)',
    pedigreeRegister: 'CBKC/KCRGS 2026-08912',
    microchip: true,
    vaccines: ['1ª Dose Nobivac Puppy DP', '2ª Dose V10 Vanguard', '3x Doses Vermífugo Drontal'],
    description: 'Filhote macho com excelente ossatura, focinho bem estruturado e temperamento dócil e brincalhão. Ideal para famílias com crianças e apartamentos espaçosos ou casas com pátio.',
    isFeatured: true,
    traits: ['Temperamento Dócil', 'Ótimo com Crianças', 'Pais com Laudo Negativo de Displasia'],
  },
  {
    id: 'dog-golden-luna',
    name: 'Kandinski Luna',
    breed: 'Golden Retriever',
    gender: 'Fêmea',
    birthDate: '2026-08-10',
    readyDate: '2026-10-15',
    color: 'Dourado Claro',
    price: 6200,
    depositAmount: 1000,
    status: 'Disponível',
    imageUrl: kennelImages.goldenRetriever,
    fatherName: 'Ch. Kandinski Grand Duke (Campeão KCRGS)',
    motherName: 'Kandinski Royal Amber',
    pedigreeRegister: 'CBKC/KCRGS 2026-08913',
    microchip: true,
    vaccines: ['1ª Dose Nobivac Puppy DP', '2ª Dose V10 Vanguard', '3x Doses Vermífugo Drontal'],
    description: 'Fêmea dócil, olhar carinhoso e pelagem exuberante. Ninhada com acompanhamento pediátrico veterinário semanal e início da socialização precoce.',
    isFeatured: true,
    traits: ['Super Afetuosa', 'Facilidade de Adestramento', 'Linhagem Internacional'],
  },
  {
    id: 'dog-bulldog-boris',
    name: 'Kandinski Boris',
    breed: 'Bulldog Inglês',
    gender: 'Macho',
    birthDate: '2026-07-28',
    readyDate: '2026-10-05',
    color: 'Baio Escuro e Branco',
    price: 7500,
    depositAmount: 1500,
    status: 'Disponível',
    imageUrl: kennelImages.englishBulldog,
    fatherName: 'Gr. Ch. Winston Lord of Kandinski',
    motherName: 'Lady Kandinski Duchess',
    pedigreeRegister: 'CBKC/KCRGS 2026-07101',
    microchip: true,
    vaccines: ['V8 / V10 Importada Completa', 'Desverminado', 'Avaliação Cardíaca e Respiratória OK'],
    description: 'Bulldog Inglês macho com conformação impecável: cabeça maciça, narinas amplas e desobstruídas, excelente respiração e marcha firme. Criado sob rigoroso padrão genético.',
    isFeatured: true,
    traits: ['Padrão Oficial CBKC', 'Narinas Abertas e Saudáveis', 'Calmo e Companheiro'],
  },
  {
    id: 'dog-bulldog-maya',
    name: 'Kandinski Maya',
    breed: 'Bulldog Inglês',
    gender: 'Fêmea',
    birthDate: '2026-07-28',
    readyDate: '2026-10-05',
    color: 'Vermelho e Branco',
    price: 7800,
    depositAmount: 1500,
    status: 'Reservado',
    imageUrl: kennelImages.englishBulldog,
    fatherName: 'Gr. Ch. Winston Lord of Kandinski',
    motherName: 'Lady Kandinski Duchess',
    pedigreeRegister: 'CBKC/KCRGS 2026-07102',
    microchip: true,
    vaccines: ['V8 / V10 Importada Completa', 'Desverminado', 'Microchip implantado'],
    description: 'Fêmea selecionada de Bulldog Inglês. Reservada por família de Curitiba/PR. Acompanhe as fotos em nosso Instagram.',
    isFeatured: false,
    traits: ['Conformação Típica', 'Excelente Linhagem Materna'],
  },
  {
    id: 'dog-chihuahua-theo',
    name: 'Kandinski Theo',
    breed: 'Chihuahua',
    gender: 'Macho',
    birthDate: '2026-08-01',
    readyDate: '2026-10-10',
    color: 'Fawn / Dourado Clássico (Pelo Curto)',
    price: 4800,
    depositAmount: 800,
    status: 'Disponível',
    imageUrl: kennelImages.chihuahua,
    fatherName: 'Little Prince of Kandinski',
    motherName: 'Kandinski Bella Flor',
    pedigreeRegister: 'CBKC/KCRGS 2026-08221',
    microchip: true,
    vaccines: ['1ª e 2ª Doses V10 Importada', 'Desverminado', 'Atestado de Saúde'],
    description: 'Macho compacto com cabeça em formato maçã perfeita, olhos expressivos e peso previsto na maturidade de 2.0 kg. Muito inteligente, ativo e apegado aos tutores.',
    isFeatured: true,
    traits: ['Porte Toy Perfeito', 'Cabeça Maçã Padrão FCI', 'Acompanha Kit Filhote'],
  },
  {
    id: 'dog-chihuahua-bella',
    name: 'Kandinski Bella',
    breed: 'Chihuahua',
    gender: 'Fêmea',
    birthDate: '2026-08-01',
    readyDate: '2026-10-10',
    color: 'Creme e Branco Neve (Pelo Curto)',
    price: 5200,
    depositAmount: 800,
    status: 'Disponível',
    imageUrl: kennelImages.chihuahua,
    fatherName: 'Little Prince of Kandinski',
    motherName: 'Kandinski Bella Flor',
    pedigreeRegister: 'CBKC/KCRGS 2026-08222',
    microchip: true,
    vaccines: ['1ª e 2ª Doses V10 Importada', 'Desverminado', 'Atestado de Saúde'],
    description: 'Fêmea Chihuahua graciosa, delicada e afetuosa. Ótima para apartamentos e viagens no colo. Pedigree emitido pelo Kennel Clube do Rio Grande do Sul.',
    isFeatured: false,
    traits: ['Muito Meiga', 'Excelente Dentição', 'Pedigree KCRGS'],
  },
];

export const INITIAL_ORDERS: ReservationOrder[] = [
  {
    id: 'order-101',
    protocolNumber: '#KAND-2026-884',
    dogId: 'dog-bulldog-maya',
    dogName: 'Kandinski Maya',
    breed: 'Bulldog Inglês',
    gender: 'Fêmea',
    customerName: 'Rodrigo Alcantara Mendonça',
    customerPhone: '(41) 99124-7788',
    customerEmail: 'rodrigo.mendonca@gmail.com',
    customerCpf: '018.***.***-45',
    customerAddress: 'Rua Comendador Araújo, 400 - Batel',
    customerCity: 'Curitiba',
    customerState: 'PR',
    deliveryMethod: 'Envio Aéreo Nacional (Gollog/LATAM)',
    paymentMethod: 'pix',
    paymentPlan: 'deposit',
    totalAmount: 1500,
    status: 'Confirmado',
    createdAt: '2026-09-28T14:20:00Z',
    notes: 'Sinal de reserva confirmado via PIX. Caixa de transporte climatizada IATA reservada.',
  },
  {
    id: 'order-102',
    protocolNumber: '#KAND-2026-891',
    dogId: 'dog-golden-thor',
    dogName: 'Kandinski Thor',
    breed: 'Golden Retriever',
    gender: 'Macho',
    customerName: 'Camila Ferreira Sampaio',
    customerPhone: '(51) 98112-3344',
    customerEmail: 'camila.sampaio@uol.com.br',
    customerCpf: '741.***.***-20',
    customerAddress: 'Av. Ipiranga, 6681 - Partenon',
    customerCity: 'Porto Alegre',
    customerState: 'RS',
    deliveryMethod: 'Retirada em Porto Alegre (Canil)',
    paymentMethod: 'credit_card',
    paymentPlan: 'full',
    installments: 10,
    totalAmount: 5800,
    status: 'Confirmado',
    createdAt: '2026-09-30T10:15:00Z',
    notes: 'Pagamento integral aprovado no cartão 10x. Retirada agendada para 15/10.',
  },
];

export const INITIAL_NOTICES: NoticePost[] = [
  {
    id: 'post-1',
    title: 'Previsão de Novas Ninhadas para o Próximo Semestre',
    category: 'Ninhadas',
    date: '2026-09-25',
    excerpt: 'Abriremos lista de espera prioritária para acasalamentos programados de Golden Retriever e Bulldog Inglês.',
    content: 'O Canil Kandinski planeja com extremo rigor cada acasalamento, visando aprimoramento morfológico, saúde e temperamento equilibrado. Entre em contato para ingressar na lista prioritária.',
    active: true,
  },
  {
    id: 'post-2',
    title: 'Garantia Genética e Protocolo de Envio Aéreo Seguro',
    category: 'Cuidados',
    date: '2026-09-18',
    excerpt: 'Saiba como realizamos o envio aéreo de filhotes com caixa IATA homologada e atestado sanitário do Ministério da Agricultura.',
    content: 'Todos os nossos filhotes viajam em caixas de transporte homologadas internacionalmente pela IATA, em compartimento pressurizado e com temperatura controlada, recebendo água fresca e acompanhamento até a entrega ao novo tutor.',
    active: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'Dra. Fernanda Mattos',
    city: 'Porto Alegre - RS',
    breed: 'Golden Retriever',
    dogName: 'Barthô',
    rating: 5,
    comment: 'Experiência impecável com a Daniela e o Canil Kandinski! O Barthô chegou super sociável, saudável e com toda a documentação do KCRGS. Já tem 1 ano e é a alegria da nossa casa.',
    date: 'Setembro 2026',
  },
  {
    id: 'test-2',
    customerName: 'Marcelo Fagundes',
    city: 'Florianópolis - SC',
    breed: 'Bulldog Inglês',
    dogName: 'Chunk',
    rating: 5,
    comment: 'Buscava um Bulldog com saúde comprovada e sem problemas de respiração. O Chunk é forte, respira perfeitamente bem e a Daniela nos deu assistência em cada detalhe.',
    date: 'Agosto 2026',
  },
  {
    id: 'test-3',
    customerName: 'Juliana e Renato',
    city: 'São Paulo - SP',
    breed: 'Chihuahua',
    dogName: 'Pipoca',
    rating: 5,
    comment: 'Recebemos a Pipoca via transporte aéreo em Guarulhos. Chegou tranquila, com atestado veterinário, carteirinha de vacinas importadas e microchipada. Recomendo de olhos fechados!',
    date: 'Julho 2026',
  },
];

// In-memory runtime store so browser 5MB localStorage limits never block multi-device cloud sync
const memoryCache: {
  dogs: Dog[] | null;
  orders: ReservationOrder[] | null;
  config: KennelConfig | null;
  notices: NoticePost[] | null;
  testimonials: Testimonial[] | null;
  breeds: BreedInfo[] | null;
  gallery: GalleryPhoto[] | null;
} = {
  dogs: null,
  orders: null,
  config: null,
  notices: null,
  testimonials: null,
  breeds: null,
  gallery: null,
};

function safeSetLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // If browser 5MB localStorage quota is full due to multiple photos, keep working in memory + Firebase Cloud
    console.warn(`Local storage quota reached for ${key}, using live cloud & memory cache.`);
  }
}

export const storageService = {
  getDogs(): Dog[] {
    if (memoryCache.dogs) return memoryCache.dogs;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOGS);
      if (!data) {
        memoryCache.dogs = INITIAL_DOGS;
        safeSetLocalStorage(STORAGE_KEYS.DOGS, INITIAL_DOGS);
        return INITIAL_DOGS;
      }
      const parsed = JSON.parse(data);
      memoryCache.dogs = parsed;
      return parsed;
    } catch {
      memoryCache.dogs = INITIAL_DOGS;
      return INITIAL_DOGS;
    }
  },

  saveDogs(dogs: Dog[]): void {
    memoryCache.dogs = dogs;
    safeSetLocalStorage(STORAGE_KEYS.DOGS, dogs);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    dogs.forEach((d) => cloudSyncService.syncDog(d));
  },

  addDog(dog: Omit<Dog, 'id'>): Dog {
    const dogs = [...this.getDogs()];
    const newDog: Dog = {
      ...dog,
      id: `dog-${Date.now()}`,
    };
    dogs.unshift(newDog);
    this.saveDogs(dogs);
    cloudSyncService.syncDog(newDog);
    return newDog;
  },

  updateDog(id: string, updates: Partial<Dog>): Dog | null {
    const dogs = [...this.getDogs()];
    const index = dogs.findIndex((d) => d.id === id);
    if (index === -1) return null;
    dogs[index] = { ...dogs[index], ...updates };
    this.saveDogs(dogs);
    cloudSyncService.syncDog(dogs[index]);
    return dogs[index];
  },

  deleteDog(id: string): boolean {
    const dogs = this.getDogs();
    const filtered = dogs.filter((d) => d.id !== id);
    if (filtered.length !== dogs.length) {
      this.saveDogs(filtered);
      cloudSyncService.deleteDog(id);
      return true;
    }
    return false;
  },

  deleteMultipleDogs(ids: string[]): number {
    const dogs = this.getDogs();
    const idSet = new Set(ids);
    const filtered = dogs.filter((d) => !idSet.has(d.id));
    const count = dogs.length - filtered.length;
    if (count > 0) {
      this.saveDogs(filtered);
      ids.forEach((id) => cloudSyncService.deleteDog(id));
    }
    return count;
  },

  duplicateDog(id: string): Dog | null {
    const dogs = [...this.getDogs()];
    const original = dogs.find((d) => d.id === id);
    if (!original) return null;

    const duplicated: Dog = {
      ...original,
      id: `dog-${Date.now()}`,
      name: `${original.name} (Cópia)`,
      status: 'Disponível',
    };
    dogs.unshift(duplicated);
    this.saveDogs(dogs);
    return duplicated;
  },

  getOrders(): ReservationOrder[] {
    if (memoryCache.orders) return memoryCache.orders;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        memoryCache.orders = INITIAL_ORDERS;
        safeSetLocalStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
        return INITIAL_ORDERS;
      }
      const parsed = JSON.parse(data);
      memoryCache.orders = parsed;
      return parsed;
    } catch {
      memoryCache.orders = INITIAL_ORDERS;
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: ReservationOrder[]): void {
    memoryCache.orders = orders;
    safeSetLocalStorage(STORAGE_KEYS.ORDERS, orders);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    orders.forEach((o) => cloudSyncService.syncOrder(o));
  },

  createOrder(orderData: Omit<ReservationOrder, 'id' | 'protocolNumber' | 'createdAt'>): ReservationOrder {
    const orders = [...this.getOrders()];
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const protocolNumber = `#KAND-${year}-${randomSuffix}`;
    const newOrder: ReservationOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      protocolNumber,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    memoryCache.orders = orders;
    safeSetLocalStorage(STORAGE_KEYS.ORDERS, orders);

    // Also update dog status to Reservado if requested
    if (orderData.dogId) {
      this.updateDog(orderData.dogId, { status: 'Reservado' });
    }

    cloudSyncService.syncOrder(newOrder);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: ReservationOrder['status']): void {
    const orders = [...this.getOrders()];
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], status };
      memoryCache.orders = orders;
      safeSetLocalStorage(STORAGE_KEYS.ORDERS, orders);
      cloudSyncService.syncOrder(orders[idx]);
      window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    }
  },

  updateOrderNotes(orderId: string, notes: string): void {
    const orders = [...this.getOrders()];
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], notes };
      memoryCache.orders = orders;
      safeSetLocalStorage(STORAGE_KEYS.ORDERS, orders);
      cloudSyncService.syncOrder(orders[idx]);
      window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    }
  },

  deleteOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    if (filtered.length !== orders.length) {
      this.saveOrders(filtered);
      cloudSyncService.deleteOrder(orderId);
      return true;
    }
    return false;
  },

  deleteMultipleOrders(orderIds: string[]): number {
    const orders = this.getOrders();
    const idSet = new Set(orderIds);
    const filtered = orders.filter((o) => !idSet.has(o.id));
    const count = orders.length - filtered.length;
    if (count > 0) {
      this.saveOrders(filtered);
      orderIds.forEach((id) => cloudSyncService.deleteOrder(id));
    }
    return count;
  },

  getConfig(): KennelConfig {
    let parsed: KennelConfig;
    if (memoryCache.config) {
      parsed = { ...DEFAULT_CONFIG, ...memoryCache.config };
    } else {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (!data) {
          memoryCache.config = DEFAULT_CONFIG;
          safeSetLocalStorage(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
          return DEFAULT_CONFIG;
        }
        parsed = { ...DEFAULT_CONFIG, ...JSON.parse(data) };
      } catch {
        memoryCache.config = DEFAULT_CONFIG;
        return DEFAULT_CONFIG;
      }
    }

    // If the user configured a custom foundation year (e.g. 2010), ensure all legacy 1998 texts match
    if (parsed.foundationYear && parsed.foundationYear !== '1998') {
      const yr = parsed.foundationYear;
      if (parsed.heroBadge1Value?.includes('1998') || parsed.heroBadge1Value?.includes('Desde')) {
        parsed.heroBadge1Value = `Desde ${yr}`;
      }
      if (parsed.heroSubtitle?.includes('1998')) {
        parsed.heroSubtitle = parsed.heroSubtitle.replace(/1998/g, yr);
      }
      if (parsed.aboutParagraph1?.includes('1998')) {
        parsed.aboutParagraph1 = parsed.aboutParagraph1.replace(/1998/g, yr);
      }
      if (parsed.tagline?.includes('1998')) {
        parsed.tagline = parsed.tagline.replace(/1998/g, yr);
      }
      if (parsed.historyMilestones) {
        parsed.historyMilestones = parsed.historyMilestones.map((m) =>
          m.year === '1998' || m.title.toLowerCase().includes('fundação') ? { ...m, year: yr } : m
        );
      }
    }
    memoryCache.config = parsed;
    return parsed;
  },

  saveConfig(config: Partial<KennelConfig>): KennelConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };

    // Synchronize all foundation year references when foundationYear is changed
    if (config.foundationYear) {
      const yr = config.foundationYear;
      updated.foundationYear = yr;
      updated.heroBadge1Value = `Desde ${yr}`;
      if (updated.heroSubtitle) {
        updated.heroSubtitle = updated.heroSubtitle.replace(/1998/g, yr);
      }
      if (updated.tagline) {
        updated.tagline = updated.tagline.replace(/1998/g, yr);
      }
      if (updated.aboutParagraph1) {
        updated.aboutParagraph1 = updated.aboutParagraph1.replace(/1998/g, yr);
      }
      if (updated.historyMilestones) {
        updated.historyMilestones = updated.historyMilestones.map((m) =>
          m.year === '1998' || m.title.toLowerCase().includes('fundação') ? { ...m, year: yr } : m
        );
      }
    }

    memoryCache.config = updated;
    safeSetLocalStorage(STORAGE_KEYS.CONFIG, updated);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    cloudSyncService.syncConfig(updated);
    return updated;
  },

  getNotices(): NoticePost[] {
    if (memoryCache.notices) return memoryCache.notices;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (!data) {
        memoryCache.notices = INITIAL_NOTICES;
        safeSetLocalStorage(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
        return INITIAL_NOTICES;
      }
      const parsed = JSON.parse(data);
      memoryCache.notices = parsed;
      return parsed;
    } catch {
      memoryCache.notices = INITIAL_NOTICES;
      return INITIAL_NOTICES;
    }
  },

  saveNotices(notices: NoticePost[]): void {
    memoryCache.notices = notices;
    safeSetLocalStorage(STORAGE_KEYS.NOTICES, notices);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    notices.forEach((n) => cloudSyncService.syncNotice(n));
  },

  addNotice(notice: Omit<NoticePost, 'id'>): NoticePost {
    const notices = [...this.getNotices()];
    const newNotice: NoticePost = {
      ...notice,
      id: `notice-${Date.now()}`,
    };
    notices.unshift(newNotice);
    this.saveNotices(notices);
    cloudSyncService.syncNotice(newNotice);
    return newNotice;
  },

  updateNotice(id: string, updates: Partial<NoticePost>): NoticePost | null {
    const notices = [...this.getNotices()];
    const idx = notices.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    notices[idx] = { ...notices[idx], ...updates };
    this.saveNotices(notices);
    cloudSyncService.syncNotice(notices[idx]);
    return notices[idx];
  },

  deleteNotice(id: string): boolean {
    const notices = this.getNotices();
    const filtered = notices.filter((n) => n.id !== id);
    if (filtered.length !== notices.length) {
      this.saveNotices(filtered);
      cloudSyncService.deleteNotice(id);
      return true;
    }
    return false;
  },

  getTestimonials(): Testimonial[] {
    if (memoryCache.testimonials) return memoryCache.testimonials;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (!data) {
        memoryCache.testimonials = TESTIMONIALS;
        safeSetLocalStorage(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
        return TESTIMONIALS;
      }
      const parsed = JSON.parse(data);
      memoryCache.testimonials = parsed;
      return parsed;
    } catch {
      memoryCache.testimonials = TESTIMONIALS;
      return TESTIMONIALS;
    }
  },

  saveTestimonials(testimonials: Testimonial[]): void {
    memoryCache.testimonials = testimonials;
    safeSetLocalStorage(STORAGE_KEYS.TESTIMONIALS, testimonials);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    testimonials.forEach((t) => cloudSyncService.syncTestimonial(t));
  },

  addTestimonial(testimonial: Omit<Testimonial, 'id'>): Testimonial {
    const list = [...this.getTestimonials()];
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
    };
    list.unshift(newTestimonial);
    this.saveTestimonials(list);
    return newTestimonial;
  },

  updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const list = [...this.getTestimonials()];
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.saveTestimonials(list);
    return list[idx];
  },

  deleteTestimonial(id: string): boolean {
    const list = this.getTestimonials();
    const filtered = list.filter((t) => t.id !== id);
    if (filtered.length !== list.length) {
      this.saveTestimonials(filtered);
      cloudSyncService.deleteTestimonial(id);
      return true;
    }
    return false;
  },

  getBreeds(): BreedInfo[] {
    if (memoryCache.breeds) return memoryCache.breeds;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BREEDS);
      if (!data) {
        memoryCache.breeds = INITIAL_BREEDS;
        safeSetLocalStorage(STORAGE_KEYS.BREEDS, INITIAL_BREEDS);
        return INITIAL_BREEDS;
      }
      const parsed = JSON.parse(data);
      memoryCache.breeds = parsed;
      return parsed;
    } catch {
      memoryCache.breeds = INITIAL_BREEDS;
      return INITIAL_BREEDS;
    }
  },

  saveBreeds(breeds: BreedInfo[]): void {
    memoryCache.breeds = breeds;
    safeSetLocalStorage(STORAGE_KEYS.BREEDS, breeds);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    breeds.forEach((b) => cloudSyncService.syncBreed(b));
  },

  addBreed(breed: Omit<BreedInfo, 'id'>): BreedInfo {
    const list = [...this.getBreeds()];
    const newBreed: BreedInfo = {
      ...breed,
      id: `breed-${Date.now()}`,
    };
    list.push(newBreed);
    this.saveBreeds(list);
    return newBreed;
  },

  updateBreed(id: string, updates: Partial<BreedInfo>): BreedInfo | null {
    const list = [...this.getBreeds()];
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.saveBreeds(list);
    return list[idx];
  },

  deleteBreed(id: string): boolean {
    const list = this.getBreeds();
    const filtered = list.filter((b) => b.id !== id);
    if (filtered.length !== list.length) {
      this.saveBreeds(filtered);
      cloudSyncService.deleteBreed(id);
      return true;
    }
    return false;
  },

  getGallery(): GalleryPhoto[] {
    if (memoryCache.gallery) return memoryCache.gallery;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (!data) {
        memoryCache.gallery = INITIAL_GALLERY;
        safeSetLocalStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
        return INITIAL_GALLERY;
      }
      const parsed = JSON.parse(data);
      memoryCache.gallery = parsed;
      return parsed;
    } catch {
      memoryCache.gallery = INITIAL_GALLERY;
      return INITIAL_GALLERY;
    }
  },

  saveGallery(gallery: GalleryPhoto[]): void {
    memoryCache.gallery = gallery;
    safeSetLocalStorage(STORAGE_KEYS.GALLERY, gallery);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
    gallery.forEach((p) => cloudSyncService.syncPhoto(p));
  },

  addPhoto(photo: Omit<GalleryPhoto, 'id' | 'createdAt'>): GalleryPhoto {
    const list = [...this.getGallery()];
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newPhoto);
    this.saveGallery(list);
    return newPhoto;
  },

  deletePhoto(id: string): boolean {
    const list = this.getGallery();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length !== list.length) {
      this.saveGallery(filtered);
      cloudSyncService.deletePhoto(id);
      return true;
    }
    return false;
  },

  deleteMultiplePhotos(ids: string[]): number {
    const list = this.getGallery();
    const idSet = new Set(ids);
    const filtered = list.filter((p) => !idSet.has(p.id));
    const count = list.length - filtered.length;
    if (count > 0) {
      this.saveGallery(filtered);
      ids.forEach((id) => cloudSyncService.deletePhoto(id));
    }
    return count;
  },

  updatePhoto(id: string, updates: Partial<GalleryPhoto>): GalleryPhoto | null {
    const list = [...this.getGallery()];
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.saveGallery(list);
    return list[idx];
  },

  exportBackup(): string {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      config: this.getConfig(),
      dogs: this.getDogs(),
      orders: this.getOrders(),
      notices: this.getNotices(),
      testimonials: this.getTestimonials(),
      breeds: this.getBreeds(),
      gallery: this.getGallery(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) {
        memoryCache.config = data.config;
        safeSetLocalStorage(STORAGE_KEYS.CONFIG, data.config);
      }
      if (data.dogs) {
        memoryCache.dogs = data.dogs;
        safeSetLocalStorage(STORAGE_KEYS.DOGS, data.dogs);
      }
      if (data.orders) {
        memoryCache.orders = data.orders;
        safeSetLocalStorage(STORAGE_KEYS.ORDERS, data.orders);
      }
      if (data.notices) {
        memoryCache.notices = data.notices;
        safeSetLocalStorage(STORAGE_KEYS.NOTICES, data.notices);
      }
      if (data.testimonials) {
        memoryCache.testimonials = data.testimonials;
        safeSetLocalStorage(STORAGE_KEYS.TESTIMONIALS, data.testimonials);
      }
      if (data.breeds) {
        memoryCache.breeds = data.breeds;
        safeSetLocalStorage(STORAGE_KEYS.BREEDS, data.breeds);
      }
      if (data.gallery) {
        memoryCache.gallery = data.gallery;
        safeSetLocalStorage(STORAGE_KEYS.GALLERY, data.gallery);
      }
      window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      return true;
    } catch {
      return false;
    }
  },

  isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  loginAdmin(pin: string): boolean {
    const config = this.getConfig();
    if (pin.trim() === config.adminPin.trim()) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },

  resetAllData(): void {
    memoryCache.dogs = INITIAL_DOGS;
    memoryCache.orders = INITIAL_ORDERS;
    memoryCache.config = DEFAULT_CONFIG;
    memoryCache.notices = INITIAL_NOTICES;
    memoryCache.testimonials = TESTIMONIALS;
    memoryCache.breeds = INITIAL_BREEDS;
    memoryCache.gallery = INITIAL_GALLERY;

    safeSetLocalStorage(STORAGE_KEYS.DOGS, INITIAL_DOGS);
    safeSetLocalStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSetLocalStorage(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    safeSetLocalStorage(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    safeSetLocalStorage(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
    safeSetLocalStorage(STORAGE_KEYS.BREEDS, INITIAL_BREEDS);
    safeSetLocalStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
  },
};

// Bootstrap cloud sync and listeners in the background
if (typeof window !== 'undefined') {
  cloudSyncService.initRealtimeSync({
    onDogsUpdate: (cloudDogs) => {
      if (cloudDogs && cloudDogs.length > 0) {
        memoryCache.dogs = cloudDogs;
        safeSetLocalStorage(STORAGE_KEYS.DOGS, cloudDogs);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onConfigUpdate: (cloudConfig) => {
      if (cloudConfig) {
        const current = storageService.getConfig();
        const merged = { ...current, ...cloudConfig };
        memoryCache.config = merged;
        safeSetLocalStorage(STORAGE_KEYS.CONFIG, merged);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onOrdersUpdate: (cloudOrders) => {
      if (cloudOrders) {
        memoryCache.orders = cloudOrders;
        safeSetLocalStorage(STORAGE_KEYS.ORDERS, cloudOrders);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onNoticesUpdate: (cloudNotices) => {
      if (cloudNotices) {
        memoryCache.notices = cloudNotices;
        safeSetLocalStorage(STORAGE_KEYS.NOTICES, cloudNotices);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onGalleryUpdate: (cloudGallery) => {
      if (cloudGallery) {
        memoryCache.gallery = cloudGallery;
        safeSetLocalStorage(STORAGE_KEYS.GALLERY, cloudGallery);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onTestimonialsUpdate: (cloudTestimonials) => {
      if (cloudTestimonials) {
        memoryCache.testimonials = cloudTestimonials;
        safeSetLocalStorage(STORAGE_KEYS.TESTIMONIALS, cloudTestimonials);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
    onBreedsUpdate: (cloudBreeds) => {
      if (cloudBreeds) {
        memoryCache.breeds = cloudBreeds;
        safeSetLocalStorage(STORAGE_KEYS.BREEDS, cloudBreeds);
        window.dispatchEvent(new CustomEvent('kandinski_data_updated'));
      }
    },
  });

  // Seed cloud if empty on startup
  setTimeout(() => {
    cloudSyncService.seedCloudIfEmpty({
      dogs: storageService.getDogs(),
      config: storageService.getConfig(),
      orders: storageService.getOrders(),
      notices: storageService.getNotices(),
      gallery: storageService.getGallery(),
    });
  }, 1200);
}

