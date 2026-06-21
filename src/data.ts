/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, BlogArticle, ClientReview } from './types';

export const PROPERTY_LISTINGS: Property[] = [
  {
    id: 'prop-1',
    title: 'Vivenda T4 de Luxo com Piscina - Sommerschield II',
    description: 'Espetacular vivenda unifamiliar localizada na Sommerschield II, uma das zonas mais requintadas de Maputo Cidade. Dispõe de 4 suites espaçosas, sala comum com pé direito duplo, cozinha moderna totalmente equipada, dependência para trabalhadores, piscina de borda infinita, jardim relvado e segurança privada permanente. Excelente escolha para habitação diplomática ou executiva de topo.',
    price: 38000000, // 38m MZN
    purpose: 'Venda',
    type: 'Vivenda',
    location: 'Sommerschield II, Av. Julius Nyerere',
    province: 'Maputo Cidade',
    bedrooms: 4,
    bathrooms: 5,
    area: 450,
    image: '/src/assets/images/luxury_house_maputo_1782032817194.jpg',
    isFeatured: true,
    isNew: true,
    hasVirtualTour: true,
    features: ['Piscina', 'Segurança 24h', 'Garagem privada (4 carros)', 'Gerador automático', 'Cozinha equipada', 'Climatização total', 'Jardim privado'],
    ownerContact: '+258 84 958 4300',
    status: 'Disponível'
  },
  {
    id: 'prop-2',
    title: 'Apartamento T3 Vista Mar Premium - Polana Cimento',
    description: 'Moderníssimo apartamento de alto padrão, localizado no coração da Polana, Maputo. Varanda panorâmica com vista magnífica e permanente sobre a Baía de Maputo. Três generosas suítes, acabamentos de luxo importados, cozinha em open-space, ginásio exclusivo e piscina no condomínio. Condomínio seguro e com portaria moderna e automatizada.',
    price: 24500000, // 24.5m MZN
    purpose: 'Venda',
    type: 'Apartamento',
    location: 'Polana Cimento, Av. Marginal',
    province: 'Maputo Cidade',
    bedrooms: 3,
    bathrooms: 4,
    area: 210,
    image: '/src/assets/images/apartment_polana_1782032834878.jpg',
    isFeatured: true,
    isNew: false,
    hasVirtualTour: true,
    features: ['Vista Mar de 180°', 'Piscina Comum', 'Ginásio Equipado', 'Segurança Armada', 'Elevador Inteligente', 'Parqueamento Subterrâneo (2 carros)'],
    ownerContact: '+258 82 458 9000',
    status: 'Reservado'
  },
  {
    id: 'prop-3',
    title: 'Vivenda T3 Moderna e Climatizada - Matola C',
    description: 'Aconchegante vivenda T3 à venda no prestigiado bairro Matola C. Sala ampla conectada a um anexo moderno, cozinha americana, três quartos com roupeiros integrados, vedação elétrica de alta voltagem e portão automático. Próximo a escolas e supermercados.',
    price: 11000000, // 11m MZN
    purpose: 'Venda',
    type: 'Casa',
    location: 'Matola C, Próximo ao Parque dos Poetas',
    province: 'Matola',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: 'https://picsum.photos/seed/house_matola/800/600',
    isFeatured: false,
    isNew: true,
    hasVirtualTour: false,
    features: ['Portão Automático', 'Vedações Elétricas', 'Climatização total', 'Anexo T1', 'Reservatório de Água (10.000L)'],
    ownerContact: '+258 87 230 4500'
  },
  {
    id: 'prop-4',
    title: 'Apartamento T2 Luxuoso para Arrendamento - Triunfo Novo',
    description: 'Excelente apartamento T2 disponível para arrendamento no Triunfo Novo, Maputo. Mobilado com bom gosto europeu, cozinha moderna integrada, quartos com roupeiros e ar condicionado. No topo possui um terraço comum com barbecue e jacuzzi ideal para lazer regular.',
    price: 85000, // 85k MZN/mês
    purpose: 'Arrendamento',
    type: 'Apartamento',
    location: 'Triunfo Novo, Próximo ao Triunfo Shopping',
    province: 'Maputo Cidade',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: 'https://picsum.photos/seed/apartment_triunfo/800/600',
    isFeatured: true,
    isNew: true,
    hasVirtualTour: true,
    features: ['Mobilado', 'Terraço Barbecue', 'Jacuzzi Comum', 'Segurança Eletrónica', 'Estacionamento Privado', 'Gerador de Emergência'],
    ownerContact: '+258 84 100 2400',
    status: 'Em Negociação'
  },
  {
    id: 'prop-5',
    title: 'Terreno Amplo de 20x40 - Tchumene 1',
    description: 'Terreno excecional de 800 m² localizado em Tchumene 1 (Matola), uma das zonas habitacionais que mais cresce em infraestruturas modernas e valorização. Já vedado nas laterais e traseiras, com DUAT regularizado, água e energia elétrica na entrada do lote. Perfeito para construção de vivenda moderna de grandes dimensões.',
    price: 1850000, // 1.85m MZN
    purpose: 'Terrenos',
    type: 'Terreno',
    location: 'Tchumene 1, Próximo à Estrada Circular',
    province: 'Matola',
    area: 800,
    image: 'https://picsum.photos/seed/land_tchumene/800/600',
    isFeatured: false,
    isNew: false,
    hasVirtualTour: false,
    features: ['Excelente DUAT regularizado', 'Água encanada instalada', 'Energia elétrica (EDM) na porta', 'Terreno vedado', 'Acesso fácil por estrada batida pavimentada'],
    ownerContact: '+258 85 410 3200'
  },
  {
    id: 'prop-6',
    title: 'Espaço Comercial / Escritório Amplo no Triunfo',
    description: 'Imóvel corporativo ideal para representação de embaixadas, sedes de multinacionais, bancos ou clínicas privadas. Localizado numa das avenidas de maior circulação na zona do Triunfo. Possui recepção imponente, 6 gabinetes privados, salas de reuniões e estacionamento interior climatizado.',
    price: 180000, // 180k MZN/mês
    purpose: 'Comercial',
    type: 'Escritório',
    location: 'Av. Marginal, Triunfo',
    province: 'Maputo Cidade',
    area: 320,
    image: 'https://picsum.photos/seed/office_marginal/800/600',
    isFeatured: true,
    isNew: true,
    hasVirtualTour: false,
    features: ['Estacionamento Interno', 'Recepção', 'Gerador trifásico de 50kVA', 'Copa completa', 'Segurança Armada', 'Ar condicionado centralizado'],
    ownerContact: '+258 84 958 4300'
  },
  {
    id: 'prop-7',
    title: 'Terreno Industrial Estratégico - Beluluane',
    description: 'Vasto terreno industrial de 5 hectares à disposição perto do Parque Industrial de Beluluane. Ideal para implantação de fábricas, armazéns logísticos, portos secos ou garagens de frotas de grande tonelagem. Com acessos facilitados para a Estrada Nacional N4.',
    price: 15000000, // 15m MZN
    purpose: 'Terrenos',
    type: 'Terreno',
    location: 'Beluluane, Próximo à N4 e Mozal',
    province: 'Maputo Província',
    area: 50000,
    image: 'https://picsum.photos/seed/industrial_land/800/600',
    isFeatured: false,
    isNew: false,
    hasVirtualTour: false,
    features: ['Acesso a Camiões Pesados', 'Inundação Zero', 'DUAT Industrial definitivo', 'Rede elétrica de alta tensão adjacente'],
    ownerContact: '+258 84 958 4300'
  },
  {
    id: 'prop-8',
    title: 'Apartamento T3 Agradável - Macuti, Cidade da Beira',
    description: 'Excelente oportunidade de arrendamento na histórica Cidade da Beira. Apartamento T3 super acolhedor localizado no calmo bairro do Macuti. Oferece cozinhas amplas, 3 quartos com belíssimas sacadas com suave brisa marítima, condomínio seguro com portaria.',
    price: 45000, // 45k MZN/mês
    purpose: 'Arrendamento',
    type: 'Apartamento',
    location: 'Bairro do Macuti, Beira',
    province: 'Sofala',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://picsum.photos/seed/beira_flat/800/600',
    isFeatured: false,
    isNew: false,
    hasVirtualTour: false,
    features: ['Brisa Marítima', 'Varanda espaçosa', 'Portaria 12h', 'Estacionamento fechado', 'Tanque de água individual'],
    ownerContact: '+258 84 722 1100'
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Como Comprar uma Casa Legalizada em Moçambique',
    excerpt: 'Descubra os passos fundamentais e todas as verificações essenciais para comprar um imóvel de forma segura e sem cair em burlas comuns.',
    content: `Comprar uma casa é, para a maioria dos moçambicanos, o maior investimento financeiro das suas vidas. No entanto, o mercado imobiliário em Moçambique requer cuidados rigorosos devido à complexidade burocrática e ao risco de burlas. 

### 1. Verificar a Legitimidade do Vendendor
Antes de efetuar absolutamente qualquer pagamento, exija a identificação completa do proprietário e certifique-se de que ele é, de facto, o detentor legítimo dos direitos do imóvel. Se for representado por terceiros, exija uma Procuração Notarial válida com poderes específicos para a transação comercial.

### 2. Certidão de Registo Predial (Conservatória)
Vá à Conservatória do Registo Predial local e obtenha uma Certidão de Registo atualizada. Este documento revela se o imóvel possui alguma hipoteca pendente, penhora jurídica ou litígos familiares de herança.

### 3. O Famoso DUAT (Direito de Uso e Aproveitamento da Terra)
Lembre-se: em Moçambique, a terra é propriedade do Estado. O que se comercializa são as benfeitorias aplicadas. Verifique se o DUAT está devidamente emitido pela Direção Municipal correspondente e se as respetivas taxas de foro municipal anual estão regularizadas.

### 4. Elaborar um Contrato de Promessa de Compra e Venda (CPCV)
Sempre assine um CPCV redigido por advogados qualificados, detalhando as condições exatas sobre os prazos de entrega, o valor do sinal inicial e as penalidades judiciais aplicáveis a ambas as partes.`,
    image: 'https://picsum.photos/seed/legal_post/800/500',
    category: 'Legislação',
    readTime: '5 min de leitura',
    date: '10 de Junho de 2026',
    views: 1240
  },
  {
    id: 'blog-2',
    title: 'Documentos Necessários para Venda de Imóveis no País',
    excerpt: 'Compilamos a lista definitiva com toda a documentação que proprietários e compradores devem preparar para garantir um processo notarial célere.',
    content: `Para evitar atrasos no Notário durante a lavratura da Escritura Pública de Compra e Venda de um imóvel, é indispensável que organize toda a documentação necessária com antecedência. Abaixo, detalhamos todos os documentos fiscais e administrativos exigidos por lei:

1. **Documentos de Identidade**: BI dos cônjuges e respetivas NUITs atualizadas das partes envolvidas. Se casados sob o regime de bens adquiridos, é necessária a outorga conjugal.
2. **DUAT Titulado**: Título do Direito de Uso e Aproveitamento da Terra definitivo emitido pelo Município ou Conselho Municipal.
3. **Certidão Negativa de Imposto Predial Autárquico (IPA)**: Prova irrefutável de que o imóvel não possui dívidas pendentes de pagamento do imposto predial de anos transatos perante o município.
4. **Planta Topográfica**: Desenho oficial do lote autenticado pelos serviços técnicos de planeamento urbano.
5. **Certidão de Registo Predial de Teor**: Emitido há menos de 90 dias, para provar a ausência total de encargos que limitem jurídicamente a livre comercialização do espaço.`,
    image: 'https://picsum.photos/seed/documents_guide/800/500',
    category: 'Comprar',
    readTime: '4 min de leitura',
    date: '02 de Junho de 2026',
    views: 845
  },
  {
    id: 'blog-3',
    title: 'Tendências do Mercado Imobiliário em Maputo e Matola para 2026/2027',
    excerpt: 'Análise aprofundada sobre a forte demanda das estradas circulares, condomínios fechados em Tchumene e a expansão residencial rumo à Marracuene.',
    content: `O mercado imobiliário em Moçambique, nomeadamente no Grande Maputo (incluindo Maputo Cidade, Matola e Marracuene), continua em permanente mutação estrutural. Eis os pontos chave das tendências para o próximo biénio:

* **Surgimento de Condomínios Fechados de Margem**: A procura por segurança integrada aumentou mais de 45% nos últimos 18 meses. Zonas como Matola Gare, Tchumene e Triunfo Novo observam um "bloom" fulgurante de empreendimentos verticais e loteamentos vigiados.
* **A Estrada Circular de Maputo como Hub de Valorização**: Os terrenos junto aos nós de ligação da circular que antes eram pacatos observaram uma valorização residencial que ronda os 120%. A facilidade de escape ao trânsito do centro urbano tornou esta rota atrativa para jovens famílias.
* **Procura Elevada por Imóveis Verdes**: Edifícios equipados com painéis solares próprios, isolamento térmico avançado e cisternas de reaproveitamento de águas pluviais sofrem menor flutuação de preços em períodos de manutenção de infraestruturas públicas.`,
    image: 'https://picsum.photos/seed/trends_real_estate/800/500',
    category: 'Tendências',
    readTime: '6 min de leitura',
    date: '28 de Maio de 2026',
    views: 1890
  },
  {
    id: 'blog-4',
    title: 'Dicas Práticas para Investidores Iniciantes em Terrenos',
    excerpt: 'Investir em terra (terrenos e parcelamentos) é altamente rentável. Saiba como identificar terrenos seguros antes de fechar negócios informais.',
    content: `Muitas pessoas optam por adquirir lotes periféricos para construir no futuro ou para revenda a preços mais competitivos. No entanto, o investimento informal em lotes vazios sem regularização pode originar dores de cabeça infindáveis. Siga estas diretrizes práticas para investir com lucidez:

* **Procure o Líder Comunitário ou Secretário do Bairro**: Antes de efetuar o pagamento oficial de um lote sob custódia comunitária, confirme a posse histórica e registos comunitários na sede administrativa do bairro.
* **Analise as Vias de Escoamento de Água**: No período seco todo lote parece perfeito. Visite a zona logo a seguir a um dia de chuva forte em Moçambique para aferir se o solo possui problemas graves de drenagem pluvial ou se faz parte de bacias com risco de inundações graves.
* **Exija os Limites com Piqueteamento Técnico**: Realize a mediação técnica do terreno com topógrafos antes de definir muros para evitar conflitos de vizinhança futuros extremamente dispendiosos de resolver.`,
    image: 'https://picsum.photos/seed/investors_tips/800/500',
    category: 'Dicas',
    readTime: '4 min de leitura',
    date: '15 de Maio =de 2026',
    views: 955
  }
];

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    name: 'Eunice Tembe Macuacua',
    role: 'Proprietária e Investidora',
    content: 'O Grupo Edson Imobiliária ajudou-me a arrendar o meu espaço comercial em tempo recorde de 2 semanas! O profissionalismo e a transparência jurídica de todas as etapas de veracidade do DUAT transmitiram uma extrema segurança tanto a mim como aos inquilinos.',
    rating: 5,
    image: 'https://picsum.photos/seed/user_female/150/150',
    location: 'Maputo Cidade'
  },
  {
    id: 'rev-2',
    name: 'Celso Mandlate',
    role: 'Empreendedor Imobiliário',
    content: 'Comprei o meu terreno em Tchumene com mediação total da equipa do Grupo Edson Imobiliária. Aconselharam-me em toda a regularização do DUAT e demarcação correta. Um serviço de excelência internacional que recomendo vivamente a todos os moçambicanos na diáspora.',
    rating: 5,
    image: 'https://picsum.photos/seed/user_male/110/110',
    location: 'Matola'
  },
  {
    id: 'rev-3',
    name: 'Dr. Armando Langa',
    role: 'Advogado corporativo',
    content: 'Para nós que valorizamos garantias reais e transparência predial, a equipa do Grupo Edson superou todas as expectativas. Dispõe de um simulador financeiro impecável que me guiou perfeitamente nos custos da prestação bancária da minha nova vivenda.',
    rating: 5,
    image: 'https://picsum.photos/seed/user_lawyer/120/120',
    location: 'Sommerschield'
  }
];

export const OUR_TEAM = [
  {
    name: 'Naira Macuacua',
    role: 'Diretora Comercial & Relações Públicas',
    bio: 'Profissional apaixonada pela satisfação do cliente, lidera a equipa de captação e intermediação de terrenos e arrendamentos nas províncias do país.',
    image: 'https://picsum.photos/seed/naira_commercial/200/200'
  },
  {
    name: 'Eng. Felisberto Nhaca',
    role: 'Topógrafo Chefe e Supervisor de Obras',
    bio: 'Responsável técnico para validação de plantas topográficas, piqueteamentos limítrofes e assessoria de construção civil aos investidores de terrenos.',
    image: 'https://picsum.photos/seed/engineer/200/200'
  }
];
