/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyPurpose = 'Venda' | 'Arrendamento' | 'Terrenos' | 'Comercial';

export type PropertyType = 'Casa' | 'Apartamento' | 'Terreno' | 'Escritório' | 'Armazém' | 'Vivenda';

export type MozambiqueProvince = 'Maputo Cidade' | 'Matola' | 'Maputo Província' | 'Sofala' | 'Nampula' | 'Cabo Delgado';

export type PropertyStatus = 'Disponível' | 'Reservado' | 'Em Negociação';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // in MZN
  purpose: PropertyPurpose;
  type: PropertyType;
  location: string;
  province: MozambiqueProvince;
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in m²
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
  videoUrl?: string; // Base64 video block or video URL
  googleMapUrl?: string; // Exact google maps iframe embed or coords link
  hasVirtualTour?: boolean;
  features: string[]; // e.g. ["Piscina", "Segurança 24h", "Garagem", "Gerador"]
  ownerContact?: string;
  status?: PropertyStatus;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Comprar' | 'Legislação' | 'Dicas' | 'Tendências';
  readTime: string;
  date: string;
  views: number;
}

export interface ClientReview {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  location: string;
}

export interface VisitSchedule {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  message?: string;
  status: 'Pendente' | 'Confirmada' | 'Cancelada';
}

export interface CaptureProperty {
  id: string;
  ownerName: string;
  ownerContact: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  province: MozambiqueProvince;
  location: string;
  price: number;
  area: number;
  bedrooms?: number;
  imageFiles: string[]; // simulated base64 or file names
  description: string;
  status: 'Revisão' | 'Publicado';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
