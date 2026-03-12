import { z } from 'zod';

const linkItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  ariaLabel: z.string().min(1),
});

const homeEventSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
});

const homeStatSchema = z.object({
  value: z.number().int().nonnegative(),
  label: z.string().min(1),
  suffix: z.string().default(''),
});

const infoCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
});

const eventTypeSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const spaceSchema = z.object({
  tag: z.string().min(1),
  name: z.string().min(1),
  desc: z.string().min(1),
  icon: z.string().min(1),
  capacity: z.string().min(1),
  area: z.string().min(1),
});

const amenitySchema = z.object({
  icon: z.string().min(1),
  name: z.string().min(1),
});

const galleryCategorySchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const galleryPlaceholderSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  caption: z.string().min(1),
  icon: z.string().min(1),
});

const contactCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  lines: z.array(z.string().min(1)).min(1),
  buttonLabel: z.string().default(''),
  buttonUrl: z.string().default(''),
});

const footerContentSchema = z.object({
  description: z.string().min(1),
  navigationTitle: z.string().min(1),
  navigationLinks: z.array(linkItemSchema).min(1),
  navigationCtaLabel: z.string().min(1),
  eventsTitle: z.string().min(1),
  eventLinks: z.array(linkItemSchema).min(1),
  contactTitle: z.string().min(1),
  socialLinks: z.array(socialLinkSchema).min(1),
  creditsText: z.string().min(1),
});

const dayHoursSchema = z
  .object({
    open: z.string().min(1),
    close: z.string().min(1),
  })
  .nullable();

export const defaultBusinessHours = {
  mon: { open: '09:00', close: '18:00' },
  tue: { open: '09:00', close: '18:00' },
  wed: { open: '09:00', close: '18:00' },
  thu: { open: '09:00', close: '18:00' },
  fri: { open: '09:00', close: '18:00' },
  sat: { open: '09:00', close: '14:00' },
  sun: null,
};

const legacyDefaultSiteSettings = {
  venueTitle: 'Quatro Ventos',
  venueSubtitle: 'Espaco para Eventos',
  phone: '(00) 00000-0000',
  email: 'contato@quatroventos.com.br',
  address: 'Rua Exemplo, 123 - Centro',
  whatsapp: '5500000000000',
  instagram: 'https://instagram.com/quatroventos',
  facebook: 'https://facebook.com/quatroventos',
  aboutText:
    'O Quatro Ventos e o espaco perfeito para celebrar os momentos mais especiais da sua vida.',
  businessHours: defaultBusinessHours,
  homeContent: {
    heroLabel: 'Espaco para Eventos',
    heroTitle: 'Transformamos Sonhos em',
    heroTitleAccent: 'Celebracoes Inesqueciveis',
    heroSubtitle:
      'Um espaco sofisticado e versatil, projetado para tornar cada evento unico e cada momento, eterno.',
    primaryCtaLabel: 'Agendar Visita',
    secondaryCtaLabel: 'Conheca os Espacos',
    eventsSectionLabel: 'Nossos Eventos',
    eventsSectionTitle: 'Cada Celebracao e Unica',
    eventsSectionSubtitle:
      'Do intimo ao grandioso, nosso espaco se adapta para realizar o evento dos seus sonhos.',
    events: [
      {
        icon: 'CV',
        title: 'Casamentos',
        desc: 'Celebre o dia mais especial da sua vida em um cenario encantador, com elegancia e sofisticacao.',
      },
      {
        icon: 'FI',
        title: 'Festas Infantis',
        desc: 'Um espaco magico e seguro para criar memorias inesqueciveis para toda a familia.',
      },
      {
        icon: 'EV',
        title: 'Reunioes e Eventos',
        desc: 'Ambiente profissional e versatil para workshops, confraternizacoes e eventos corporativos.',
      },
    ],
    stats: [
      { value: 500, suffix: '+', label: 'Eventos Realizados' },
      { value: 98, suffix: '%', label: 'Clientes Satisfeitos' },
      { value: 15, suffix: '', label: 'Anos de Experiencia' },
      { value: 3, suffix: '', label: 'Espacos Exclusivos' },
    ],
    aboutSectionLabel: 'Sobre Nos',
    aboutSectionTitle: 'Um Espaco Pensado em Cada Detalhe',
    aboutParagraphs: [
      'O Quatro Ventos nasceu da paixao por criar momentos especiais. Com ambientes cuidadosamente projetados e uma equipe dedicada, oferecemos a estrutura ideal para que cada evento seja unico e inesquecivel.',
      'Nossa missao e proporcionar experiencias memoraveis, com conforto, elegancia e todo o suporte necessario para que voce aproveite cada instante.',
    ],
    features: [
      'Estacionamento amplo',
      'Equipe dedicada',
      'Cozinha industrial',
      'Ar-condicionado',
      'Som profissional',
      'Acessibilidade',
      'Area externa',
      'Seguranca 24h',
    ],
    aboutCtaLabel: 'Explorar Espacos',
    ctaLabel: 'Comece Agora',
    ctaTitle: 'Pronto para Conhecer Nosso Espaco?',
    ctaSubtitle:
      'Agende uma visita sem compromisso e descubra como podemos tornar o seu evento inesquecivel.',
    ctaPrimaryLabel: 'Agendar Visita Gratuita',
    ctaSecondaryLabel: 'Fale Conosco',
  },
  spacesContent: {
    heroLabel: 'Nossos Espacos',
    heroTitle: 'Ambientes Pensados Para Cada Momento',
    heroSubtitle:
      'Tres espacos unicos, cada um projetado para um tipo de celebracao, todos com a mesma excelencia.',
    spaces: [
      {
        tag: 'Salao Principal',
        name: 'Salao Grand Ventus',
        desc: 'Nosso espaco principal, ideal para casamentos, formaturas e grandes celebracoes.',
        icon: 'SV',
        capacity: '300',
        area: '450 m2',
      },
      {
        tag: 'Espaco Intimo',
        name: 'Sala Brisa',
        desc: 'Perfeito para reunioes corporativas, workshops e eventos mais intimistas.',
        icon: 'SB',
        capacity: '80',
        area: '120 m2',
      },
      {
        tag: 'Espaco Kids',
        name: 'Jardim dos Sonhos',
        desc: 'Um universo magico para festas infantis, com area interna e externa.',
        icon: 'JK',
        capacity: '150',
        area: '280 m2',
      },
    ],
    amenitiesSectionLabel: 'Infraestrutura',
    amenitiesSectionTitle: 'Tudo Que Voce Precisa',
    amenities: [
      { icon: 'PK', name: 'Estacionamento' },
      { icon: 'AC', name: 'Ar-condicionado' },
      { icon: 'SM', name: 'Som Profissional' },
      { icon: 'IL', name: 'Iluminacao Cenica' },
      { icon: 'CZ', name: 'Cozinha Industrial' },
      { icon: 'ACS', name: 'Acessibilidade' },
      { icon: 'WF', name: 'Wi-Fi Premium' },
      { icon: 'SEG', name: 'Seguranca' },
    ],
    ctaTitle: 'Ficou Interessado?',
    ctaSubtitle: 'Agende uma visita e conheca nossos espacos pessoalmente.',
    ctaLabel: 'Agendar Visita Gratuita',
  },
  galleryContent: {
    heroLabel: 'Galeria',
    heroTitle: 'Momentos que Encantam',
    heroSubtitle: 'Confira registros dos nossos espacos e eventos que marcam vidas.',
    categories: [
      { value: 'all', label: 'Todos' },
      { value: 'venue', label: 'Espaco' },
      { value: 'wedding', label: 'Casamentos' },
      { value: 'children', label: 'Festas Infantis' },
      { value: 'corporate', label: 'Corporativo' },
      { value: 'decoration', label: 'Decoracao' },
    ],
    placeholderMedia: [
      { id: '1', title: 'Salao Principal', category: 'venue', caption: 'Salao Grand Ventus', icon: 'SV' },
      { id: '2', title: 'Decoracao Casamento', category: 'wedding', caption: 'Mesa dos Noivos', icon: 'DC' },
      { id: '3', title: 'Jardim Externo', category: 'venue', caption: 'Area Externa', icon: 'JE' },
      { id: '4', title: 'Festa Infantil', category: 'children', caption: 'Espaco Kids', icon: 'FI' },
      { id: '5', title: 'Buffet', category: 'venue', caption: 'Area do Buffet', icon: 'BF' },
      { id: '6', title: 'Cerimonia', category: 'wedding', caption: 'Altar ao Ar Livre', icon: 'CR' },
      { id: '7', title: 'Reuniao', category: 'corporate', caption: 'Sala de Reunioes', icon: 'RP' },
      { id: '8', title: 'Decoracao', category: 'decoration', caption: 'Arranjo Floral', icon: 'DE' },
      { id: '9', title: 'Pista de Danca', category: 'venue', caption: 'Pista de Danca', icon: 'PD' },
    ],
    emptyMessage: 'Nenhuma imagem encontrada nesta categoria.',
  },
  bookingContent: {
    heroLabel: 'Agendamento',
    title: 'Agende Sua Visita',
    subtitle:
      'Conheca nosso espaco pessoalmente. Agende uma visita em horario comercial e descubra o cenario perfeito para o seu evento.',
    infoCards: [
      { icon: 'HR', title: 'Horario Comercial', desc: 'Seg a Sex: 09h as 18h | Sab: 09h as 14h' },
      { icon: 'TM', title: 'Duracao da Visita', desc: 'Aproximadamente 30 a 45 minutos' },
      { icon: 'VIP', title: 'Visita Personalizada', desc: 'Tour completo por todos os espacos com atendimento exclusivo' },
      { icon: 'FREE', title: 'Sem Compromisso', desc: 'Visita gratuita e sem obrigacao de contratacao' },
    ],
    formTitle: 'Preencha os Dados',
    formSubtitle: 'Todos os campos sao obrigatorios',
    successTitle: 'Agendamento Confirmado!',
    successMessage:
      'Recebemos seu agendamento com sucesso. Entraremos em contato em breve para confirmar os detalhes da sua visita.',
    resetButtonLabel: 'Novo Agendamento',
    submitButtonLabel: 'Confirmar Agendamento',
    conflictMessage:
      'Este horario ja foi reservado para outra visita. Escolha outro horario.',
    eventTypes: [
      { value: 'wedding', label: 'Casamento' },
      { value: 'children', label: 'Festa Infantil' },
      { value: 'corporate', label: 'Reuniao / Corporativo' },
      { value: 'debutante', label: 'Debutante' },
      { value: 'party', label: 'Confraternizacao' },
      { value: 'other', label: 'Outro' },
    ],
    timeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  },
  contactContent: {
    heroLabel: 'Contato',
    heroTitle: 'Fale Conosco',
    heroSubtitle: 'Estamos prontos para ajuda-lo a planejar o evento perfeito.',
    cards: [
      {
        icon: 'END',
        title: 'Endereco',
        lines: ['Rua Exemplo, 123', 'Centro - Cidade/UF', 'CEP: 00000-000'],
        buttonLabel: '',
        buttonUrl: '',
      },
      {
        icon: 'TEL',
        title: 'Telefone',
        lines: ['(00) 00000-0000'],
        buttonLabel: 'WhatsApp',
        buttonUrl: 'https://wa.me/5500000000000',
      },
      {
        icon: 'MAIL',
        title: 'Email',
        lines: ['contato@quatroventos.com.br'],
        buttonLabel: '',
        buttonUrl: '',
      },
      {
        icon: 'HRS',
        title: 'Horario de Atendimento',
        lines: ['Seg a Sex: 09h as 18h', 'Sabado: 09h as 14h', 'Domingo: Fechado'],
        buttonLabel: '',
        buttonUrl: '',
      },
    ],
    formTitle: 'Envie uma Mensagem',
    formSuccessTitle: 'Mensagem Enviada!',
    formSuccessMessage: 'Retornaremos em breve.',
    formResetLabel: 'Nova Mensagem',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'seu@email.com',
    subjectPlaceholder: 'Assunto da mensagem',
    messagePlaceholder: 'Escreva sua mensagem...',
    mapPlaceholderTitle: 'Mapa sera exibido aqui',
    mapPlaceholderSubtitle: 'Configure o Google Maps embed nas configuracoes',
  },
  footerContent: {
    description:
      'O espaco perfeito para celebrar os momentos mais especiais da sua vida. Casamentos, festas infantis, reunioes corporativas e muito mais.',
    navigationTitle: 'Navegacao',
    navigationLinks: [
      { href: '/', label: 'Inicio' },
      { href: '/espacos', label: 'Espacos' },
      { href: '/galeria', label: 'Galeria' },
      { href: '/contato', label: 'Contato' },
    ],
    navigationCtaLabel: 'Agendar Visita',
    eventsTitle: 'Eventos',
    eventLinks: [
      { href: '/espacos', label: 'Casamentos' },
      { href: '/espacos', label: 'Festas Infantis' },
      { href: '/espacos', label: 'Reunioes' },
      { href: '/espacos', label: 'Confraternizacoes' },
      { href: '/espacos', label: 'Eventos Corporativos' },
    ],
    contactTitle: 'Contato',
    socialLinks: [
      { label: 'IG', href: 'https://instagram.com/quatroventos', ariaLabel: 'Instagram' },
      { label: 'FB', href: 'https://facebook.com/quatroventos', ariaLabel: 'Facebook' },
      { label: 'WA', href: 'https://wa.me/5500000000000', ariaLabel: 'WhatsApp' },
    ],
    creditsText: 'Feito com carinho para momentos inesqueciveis',
  },
} as const;

const encodedDefaultSiteSettings = {
  venueTitle: 'Quatro Ventos',
  venueSubtitle: 'Espaço para Eventos',
  phone: '(00) 00000-0000',
  email: 'contato@quatroventos.com.br',
  address: 'Rua Exemplo, 123 - Centro',
  whatsapp: '5500000000000',
  instagram: 'https://instagram.com/quatroventos',
  facebook: 'https://facebook.com/quatroventos',
  aboutText:
    'O Quatro Ventos é o espaço perfeito para celebrar os momentos mais especiais da sua vida.',
  businessHours: defaultBusinessHours,
  homeContent: {
    heroLabel: 'Espaço para Eventos',
    heroTitle: 'Transformamos Sonhos em',
    heroTitleAccent: 'Celebrações Inesquecíveis',
    heroSubtitle:
      'Um espaço sofisticado e versátil, projetado para tornar cada evento único e cada momento eterno.',
    primaryCtaLabel: 'Agendar Visita',
    secondaryCtaLabel: 'Conheça os Espaços',
    eventsSectionLabel: 'Nossos Eventos',
    eventsSectionTitle: 'Cada Celebração é Única',
    eventsSectionSubtitle:
      'Do íntimo ao grandioso, nosso espaço se adapta para realizar o evento dos seus sonhos.',
    events: [
      {
        icon: 'CV',
        title: 'Casamentos',
        desc: 'Celebre o dia mais especial da sua vida em um cenário encantador, com elegância e sofisticação.',
      },
      {
        icon: 'FI',
        title: 'Festas Infantis',
        desc: 'Um espaço mágico e seguro para criar memórias inesquecíveis para toda a família.',
      },
      {
        icon: 'EV',
        title: 'Reuniões e Eventos',
        desc: 'Ambiente profissional e versátil para workshops, confraternizações e eventos corporativos.',
      },
    ],
    stats: [
      { value: 500, suffix: '+', label: 'Eventos Realizados' },
      { value: 98, suffix: '%', label: 'Clientes Satisfeitos' },
      { value: 15, suffix: '', label: 'Anos de Experiência' },
      { value: 3, suffix: '', label: 'Espaços Exclusivos' },
    ],
    aboutSectionLabel: 'Sobre Nós',
    aboutSectionTitle: 'Um Espaço Pensado em Cada Detalhe',
    aboutParagraphs: [
      'O Quatro Ventos nasceu da paixão por criar momentos especiais. Com ambientes cuidadosamente projetados e uma equipe dedicada, oferecemos a estrutura ideal para que cada evento seja único e inesquecível.',
      'Nossa missão é proporcionar experiências memoráveis, com conforto, elegância e todo o suporte necessário para que você aproveite cada instante.',
    ],
    features: [
      'Estacionamento amplo',
      'Equipe dedicada',
      'Cozinha industrial',
      'Ar-condicionado',
      'Som profissional',
      'Acessibilidade',
      'Área externa',
      'Segurança 24h',
    ],
    aboutCtaLabel: 'Explorar Espaços',
    ctaLabel: 'Comece Agora',
    ctaTitle: 'Pronto para Conhecer Nosso Espaço?',
    ctaSubtitle:
      'Agende uma visita sem compromisso e descubra como podemos tornar o seu evento inesquecível.',
    ctaPrimaryLabel: 'Agendar Visita Gratuita',
    ctaSecondaryLabel: 'Fale Conosco',
  },
  spacesContent: {
    heroLabel: 'Nossos Espaços',
    heroTitle: 'Ambientes Pensados para Cada Momento',
    heroSubtitle:
      'Três espaços únicos, cada um projetado para um tipo de celebração, todos com a mesma excelência.',
    spaces: [
      {
        tag: 'Salão Principal',
        name: 'Salão Grand Ventus',
        desc: 'Nosso espaço principal, ideal para casamentos, formaturas e grandes celebrações.',
        icon: 'SV',
        capacity: '300',
        area: '450 m²',
      },
      {
        tag: 'Espaço Íntimo',
        name: 'Sala Brisa',
        desc: 'Perfeito para reuniões corporativas, workshops e eventos mais intimistas.',
        icon: 'SB',
        capacity: '80',
        area: '120 m²',
      },
      {
        tag: 'Espaço Kids',
        name: 'Jardim dos Sonhos',
        desc: 'Um universo mágico para festas infantis, com área interna e externa.',
        icon: 'JK',
        capacity: '150',
        area: '280 m²',
      },
    ],
    amenitiesSectionLabel: 'Infraestrutura',
    amenitiesSectionTitle: 'Tudo o Que Você Precisa',
    amenities: [
      { icon: 'PK', name: 'Estacionamento' },
      { icon: 'AC', name: 'Ar-condicionado' },
      { icon: 'SM', name: 'Som Profissional' },
      { icon: 'IL', name: 'Iluminação Cênica' },
      { icon: 'CZ', name: 'Cozinha Industrial' },
      { icon: 'ACS', name: 'Acessibilidade' },
      { icon: 'WF', name: 'Wi-Fi Premium' },
      { icon: 'SEG', name: 'Segurança' },
    ],
    ctaTitle: 'Ficou Interessado?',
    ctaSubtitle: 'Agende uma visita e conheça nossos espaços pessoalmente.',
    ctaLabel: 'Agendar Visita Gratuita',
  },
  galleryContent: {
    heroLabel: 'Galeria',
    heroTitle: 'Momentos que Encantam',
    heroSubtitle: 'Confira registros dos nossos espaços e eventos que marcam vidas.',
    categories: [
      { value: 'all', label: 'Todos' },
      { value: 'venue', label: 'Espaço' },
      { value: 'wedding', label: 'Casamentos' },
      { value: 'children', label: 'Festas Infantis' },
      { value: 'corporate', label: 'Corporativo' },
      { value: 'decoration', label: 'Decoração' },
    ],
    placeholderMedia: [
      { id: '1', title: 'Salão Principal', category: 'venue', caption: 'Salão Grand Ventus', icon: 'SV' },
      { id: '2', title: 'Decoração de Casamento', category: 'wedding', caption: 'Mesa dos Noivos', icon: 'DC' },
      { id: '3', title: 'Jardim Externo', category: 'venue', caption: 'Área Externa', icon: 'JE' },
      { id: '4', title: 'Festa Infantil', category: 'children', caption: 'Espaço Kids', icon: 'FI' },
      { id: '5', title: 'Buffet', category: 'venue', caption: 'Área do Buffet', icon: 'BF' },
      { id: '6', title: 'Cerimônia', category: 'wedding', caption: 'Altar ao Ar Livre', icon: 'CR' },
      { id: '7', title: 'Reunião', category: 'corporate', caption: 'Sala de Reuniões', icon: 'RP' },
      { id: '8', title: 'Decoração', category: 'decoration', caption: 'Arranjo Floral', icon: 'DE' },
      { id: '9', title: 'Pista de Dança', category: 'venue', caption: 'Pista de Dança', icon: 'PD' },
    ],
    emptyMessage: 'Nenhuma imagem encontrada nesta categoria.',
  },
  bookingContent: {
    heroLabel: 'Agendamento',
    title: 'Agende Sua Visita',
    subtitle:
      'Conheça nosso espaço pessoalmente. Agende uma visita em horário comercial e descubra o cenário perfeito para o seu evento.',
    infoCards: [
      { icon: 'HR', title: 'Horário Comercial', desc: 'Seg. a Sex.: 09h às 18h | Sáb.: 09h às 14h' },
      { icon: 'TM', title: 'Duração da Visita', desc: 'Aproximadamente 30 a 45 minutos' },
      { icon: 'VIP', title: 'Visita Personalizada', desc: 'Tour completo por todos os espaços com atendimento exclusivo' },
      { icon: 'FREE', title: 'Sem Compromisso', desc: 'Visita gratuita e sem obrigação de contratação' },
    ],
    formTitle: 'Preencha os Dados',
    formSubtitle: 'Todos os campos são obrigatórios',
    successTitle: 'Agendamento Confirmado!',
    successMessage:
      'Recebemos seu agendamento com sucesso. Entraremos em contato em breve para confirmar os detalhes da sua visita.',
    resetButtonLabel: 'Novo Agendamento',
    submitButtonLabel: 'Confirmar Agendamento',
    conflictMessage:
      'Este horário já foi reservado para outra visita. Escolha outro horário.',
    eventTypes: [
      { value: 'wedding', label: 'Casamento' },
      { value: 'children', label: 'Festa Infantil' },
      { value: 'corporate', label: 'Reunião / Corporativo' },
      { value: 'debutante', label: 'Debutante' },
      { value: 'party', label: 'Confraternização' },
      { value: 'other', label: 'Outro' },
    ],
    timeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  },
  contactContent: {
    heroLabel: 'Contato',
    heroTitle: 'Fale Conosco',
    heroSubtitle: 'Estamos prontos para ajudá-lo a planejar o evento perfeito.',
    cards: [
      {
        icon: 'END',
        title: 'Endereço',
        lines: ['Rua Exemplo, 123', 'Centro - Cidade/UF', 'CEP: 00000-000'],
        buttonLabel: '',
        buttonUrl: '',
      },
      {
        icon: 'TEL',
        title: 'Telefone',
        lines: ['(00) 00000-0000'],
        buttonLabel: 'WhatsApp',
        buttonUrl: 'https://wa.me/5500000000000',
      },
      {
        icon: 'MAIL',
        title: 'E-mail',
        lines: ['contato@quatroventos.com.br'],
        buttonLabel: '',
        buttonUrl: '',
      },
      {
        icon: 'HRS',
        title: 'Horário de Atendimento',
        lines: ['Seg. a Sex.: 09h às 18h', 'Sábado: 09h às 14h', 'Domingo: Fechado'],
        buttonLabel: '',
        buttonUrl: '',
      },
    ],
    formTitle: 'Envie uma Mensagem',
    formSuccessTitle: 'Mensagem Enviada!',
    formSuccessMessage: 'Retornaremos em breve.',
    formResetLabel: 'Nova Mensagem',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'seu@email.com',
    subjectPlaceholder: 'Assunto da mensagem',
    messagePlaceholder: 'Escreva sua mensagem...',
    mapPlaceholderTitle: 'Mapa será exibido aqui',
    mapPlaceholderSubtitle: 'Configure o Google Maps embed nas configurações',
  },
  footerContent: {
    description:
      'O espaço perfeito para celebrar os momentos mais especiais da sua vida. Casamentos, festas infantis, reuniões corporativas e muito mais.',
    navigationTitle: 'Navegação',
    navigationLinks: [
      { href: '/', label: 'Início' },
      { href: '/espacos', label: 'Espaços' },
      { href: '/galeria', label: 'Galeria' },
      { href: '/contato', label: 'Contato' },
    ],
    navigationCtaLabel: 'Agendar Visita',
    eventsTitle: 'Eventos',
    eventLinks: [
      { href: '/espacos', label: 'Casamentos' },
      { href: '/espacos', label: 'Festas Infantis' },
      { href: '/espacos', label: 'Reuniões' },
      { href: '/espacos', label: 'Confraternizações' },
      { href: '/espacos', label: 'Eventos Corporativos' },
    ],
    contactTitle: 'Contato',
    socialLinks: [
      { label: 'IG', href: 'https://instagram.com/quatroventos', ariaLabel: 'Instagram' },
      { label: 'FB', href: 'https://facebook.com/quatroventos', ariaLabel: 'Facebook' },
      { label: 'WA', href: 'https://wa.me/5500000000000', ariaLabel: 'WhatsApp' },
    ],
    creditsText: 'Feito com carinho para momentos inesquecíveis',
  },
} as const;

const dayHoursShape = z.object({
  mon: dayHoursSchema,
  tue: dayHoursSchema,
  wed: dayHoursSchema,
  thu: dayHoursSchema,
  fri: dayHoursSchema,
  sat: dayHoursSchema,
  sun: dayHoursSchema,
});

const homeContentSchema = z.object({
  heroLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  heroTitleAccent: z.string().min(1),
  heroSubtitle: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  eventsSectionLabel: z.string().min(1),
  eventsSectionTitle: z.string().min(1),
  eventsSectionSubtitle: z.string().min(1),
  events: z.array(homeEventSchema).min(1),
  stats: z.array(homeStatSchema).min(1),
  aboutSectionLabel: z.string().min(1),
  aboutSectionTitle: z.string().min(1),
  aboutParagraphs: z.array(z.string().min(1)).min(1),
  features: z.array(z.string().min(1)).min(1),
  aboutCtaLabel: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaTitle: z.string().min(1),
  ctaSubtitle: z.string().min(1),
  ctaPrimaryLabel: z.string().min(1),
  ctaSecondaryLabel: z.string().min(1),
});

const spacesContentSchema = z.object({
  heroLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  spaces: z.array(spaceSchema).min(1),
  amenitiesSectionLabel: z.string().min(1),
  amenitiesSectionTitle: z.string().min(1),
  amenities: z.array(amenitySchema).min(1),
  ctaTitle: z.string().min(1),
  ctaSubtitle: z.string().min(1),
  ctaLabel: z.string().min(1),
});

const galleryContentSchema = z.object({
  heroLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  categories: z.array(galleryCategorySchema).min(1),
  placeholderMedia: z.array(galleryPlaceholderSchema).min(1),
  emptyMessage: z.string().min(1),
});

const bookingContentSchema = z.object({
  heroLabel: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  infoCards: z.array(infoCardSchema).min(1),
  formTitle: z.string().min(1),
  formSubtitle: z.string().min(1),
  successTitle: z.string().min(1),
  successMessage: z.string().min(1),
  resetButtonLabel: z.string().min(1),
  submitButtonLabel: z.string().min(1),
  conflictMessage: z.string().min(1),
  eventTypes: z.array(eventTypeSchema).min(1),
  timeSlots: z.array(z.string().min(1)).min(1),
});

const contactContentSchema = z.object({
  heroLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  cards: z.array(contactCardSchema).min(1),
  formTitle: z.string().min(1),
  formSuccessTitle: z.string().min(1),
  formSuccessMessage: z.string().min(1),
  formResetLabel: z.string().min(1),
  namePlaceholder: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  subjectPlaceholder: z.string().min(1),
  messagePlaceholder: z.string().min(1),
  mapPlaceholderTitle: z.string().min(1),
  mapPlaceholderSubtitle: z.string().min(1),
});

export const siteSettingsSchema = z.object({
  venueTitle: z.string().min(1),
  venueSubtitle: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  address: z.string().min(1),
  whatsapp: z.string().min(1),
  instagram: z.string().min(1),
  facebook: z.string().min(1),
  aboutText: z.string().min(1),
  businessHours: dayHoursShape,
  homeContent: homeContentSchema,
  spacesContent: spacesContentSchema,
  galleryContent: galleryContentSchema,
  bookingContent: bookingContentSchema,
  contactContent: contactContentSchema,
  footerContent: footerContentSchema,
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

function collectStringReplacements(
  legacyValue: unknown,
  currentValue: unknown,
  replacements = new Map<string, string>()
) {
  if (typeof legacyValue === 'string' && typeof currentValue === 'string') {
    if (legacyValue !== currentValue) {
      replacements.set(legacyValue, currentValue);
    }
    return replacements;
  }

  if (Array.isArray(legacyValue) && Array.isArray(currentValue)) {
    legacyValue.forEach((item, index) => {
      collectStringReplacements(item, currentValue[index], replacements);
    });
    return replacements;
  }

  if (
    legacyValue &&
    currentValue &&
    typeof legacyValue === 'object' &&
    typeof currentValue === 'object'
  ) {
    Object.keys(legacyValue).forEach((key) => {
      collectStringReplacements(
        (legacyValue as Record<string, unknown>)[key],
        (currentValue as Record<string, unknown>)[key],
        replacements
      );
    });
  }

  return replacements;
}

function decodeLatin1AsUtf8(value: string) {
  const bytes = Uint8Array.from(
    Array.from(value, (char) => char.charCodeAt(0) & 0xff)
  );

  return new TextDecoder('utf-8').decode(bytes);
}

function shouldDecodeLegacyText(value: string) {
  return /[ÃÂâ]|ï¿½/.test(value);
}

function decodeSuspiciousText(value: string) {
  if (!shouldDecodeLegacyText(value)) {
    return value;
  }

  try {
    const decoded = decodeLatin1AsUtf8(value);
    return decoded || value;
  } catch {
    return value;
  }
}

function decodeSuspiciousValue<T>(value: T): T {
  if (typeof value === 'string') {
    return decodeSuspiciousText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => decodeSuspiciousValue(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        decodeSuspiciousValue(nestedValue),
      ])
    ) as T;
  }

  return value;
}

export const defaultSiteSettings = siteSettingsSchema.parse(
  decodeSuspiciousValue(
    encodedDefaultSiteSettings as unknown as Record<string, unknown>
  )
);

const legacyTextReplacements = collectStringReplacements(
  legacyDefaultSiteSettings,
  defaultSiteSettings
);

function scoreTextRepair(value: string) {
  let score = 0;

  if (/[À-ÿ]/.test(value)) {
    score += 4;
  }

  if (!/[ÃÂâ]/.test(value)) {
    score += 3;
  }

  if (!value.includes('�')) {
    score += 2;
  }

  return score;
}

function repairLegacyText(value: string) {
  const directReplacement = legacyTextReplacements.get(value);
  if (directReplacement) {
    return directReplacement;
  }

  if (!shouldDecodeLegacyText(value)) {
    return value;
  }

  const decoded = decodeSuspiciousText(value);
  const repaired = legacyTextReplacements.get(decoded) || decoded;
  return scoreTextRepair(repaired) >= scoreTextRepair(value) ? repaired : value;
}

function repairLegacyValue<T>(value: T): T {
  if (typeof value === 'string') {
    return repairLegacyText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => repairLegacyValue(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        repairLegacyValue(nestedValue),
      ])
    ) as T;
  }

  return value;
}

function parseJsonValue<T>(value: unknown, fallback: T) {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    try {
      return repairLegacyValue(JSON.parse(value) as T);
    } catch {
      return fallback;
    }
  }

  return repairLegacyValue(value as T);
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim()
    ? repairLegacyText(value)
    : fallback;
}

function mergeSection<T extends Record<string, unknown>>(value: unknown, fallback: T) {
  const parsed = parseJsonValue<Partial<T>>(value, {});
  return {
    ...fallback,
    ...parsed,
  } as T;
}

export function normalizeSiteSettings(raw?: Record<string, unknown> | null): SiteSettings {
  return siteSettingsSchema.parse({
    venueTitle: readString(raw?.venueTitle, defaultSiteSettings.venueTitle),
    venueSubtitle: readString(raw?.venueSubtitle, defaultSiteSettings.venueSubtitle),
    phone: readString(raw?.phone, defaultSiteSettings.phone),
    email: readString(raw?.email, defaultSiteSettings.email),
    address: readString(raw?.address, defaultSiteSettings.address),
    whatsapp: readString(raw?.whatsapp, defaultSiteSettings.whatsapp),
    instagram: readString(raw?.instagram, defaultSiteSettings.instagram),
    facebook: readString(raw?.facebook, defaultSiteSettings.facebook),
    aboutText: readString(raw?.aboutText, defaultSiteSettings.aboutText),
    businessHours: {
      ...defaultSiteSettings.businessHours,
      ...parseJsonValue(raw?.businessHours, {}),
    },
    homeContent: mergeSection(raw?.homeContent, defaultSiteSettings.homeContent),
    spacesContent: mergeSection(raw?.spacesContent, defaultSiteSettings.spacesContent),
    galleryContent: mergeSection(raw?.galleryContent, defaultSiteSettings.galleryContent),
    bookingContent: mergeSection(raw?.bookingContent, defaultSiteSettings.bookingContent),
    contactContent: mergeSection(raw?.contactContent, defaultSiteSettings.contactContent),
    footerContent: mergeSection(raw?.footerContent, defaultSiteSettings.footerContent),
  });
}

export function createDefaultSiteSettings(): SiteSettings {
  return normalizeSiteSettings(defaultSiteSettings as unknown as Record<string, unknown>);
}
