/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { safeStorage } from './lib/storage';
import { 
  Home, 
  Search, 
  MapPin, 
  Percent, 
  Calculator, 
  BookOpen, 
  Users, 
  Phone, 
  Award, 
  CheckCircle, 
  Heart, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Instagram, 
  Facebook, 
  Linkedin,
  Play, 
  Compass, 
  Send, 
  Menu, 
  X, 
  MessageSquare,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles,
  DollarSign,
  Tv,
  Eye,
  CheckSquare,
  Bookmark,
  Share2,
  MoreVertical,
  Sliders,
  Bell,
  LayoutGrid,
  List
} from 'lucide-react';

import { 
  Property, 
  PropertyPurpose, 
  PropertyType, 
  MozambiqueProvince, 
  BlogArticle, 
  ClientReview, 
  VisitSchedule, 
  CaptureProperty 
} from './types';

import { 
  PROPERTY_LISTINGS, 
  BLOG_ARTICLES, 
  CLIENT_REVIEWS, 
  OUR_TEAM 
} from './data';

import InteractiveMap from './components/InteractiveMap';
import CaptaForm from './components/CaptaForm';
import BlogSection from './components/BlogSection';
import ChatOnline from './components/ChatOnline';
import ScheduleModal from './components/ScheduleModal';
import Logo from './components/Logo';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Navigation Menu tabs per requested menu structure:
  // 1. Início, 2. Imóveis, 3. Comprar, 4. Arrendar, 5. Terrenos, 6. Anuncie seu Imóvel, 7. Blog, 8. Sobre Nós, 9. Contactos
  type NavTab = 'inicio' | 'imoveis' | 'comprar' | 'arrendar' | 'terrenos' | 'anuncie' | 'blog' | 'sobre' | 'contactos' | 'admin';
  
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  // Listing collections
  const [properties, setProperties] = useState<Property[]>(() => 
    safeStorage.get('ge_catalogo_properties', PROPERTY_LISTINGS)
  );
  const [favorites, setFavorites] = useState<string[]>(() => 
    safeStorage.get('prs_favorites', [])
  );

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<MozambiqueProvince | 'Todas'>('Todas');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'Todos'>('Todos');
  const [maxPrice, setMaxPrice] = useState<number>(45000000); // Max starting point MZN
  const [purposeFilter, setPurposeFilter] = useState<PropertyPurpose | 'Todos'>('Todos');

  // Customer submittals list (CaptaForm)
  const [capturedList, setCapturedList] = useState<CaptureProperty[]>(() => 
    safeStorage.get('prs_captured_properties', [])
  );

  // Scheduled physical visits list
  const [scheduledVisits, setScheduledVisits] = useState<VisitSchedule[]>(() => 
    safeStorage.get('prs_visit_schedules', [])
  );

  // Media Player Modals
  const [active360Prop, setActive360Prop] = useState<Property | null>(null);
  const [viewing360Angle, setViewing360Angle] = useState<number>(0);
  const [activeVideoProp, setActiveVideoProp] = useState<Property | null>(null);
  const [activeMapProp, setActiveMapProp] = useState<Property | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Active visit-scheduling targets
  const [schedulingTarget, setSchedulingTarget] = useState<Property | null>(null);

  // Newsletter Subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribedNewsletter, setIsSubscribedNewsletter] = useState(false);

  // Contact Message form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // WhatsApp FLOATING quick contact menu triggers
  const [isWhatsAppHubOpen, setIsWhatsAppHubOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync favorites
  useEffect(() => {
    safeStorage.set('prs_favorites', favorites);
  }, [favorites]);

  // Sync captured properties
  useEffect(() => {
    safeStorage.set('prs_captured_properties', capturedList);
  }, [capturedList]);

  // Sync catalogue properties
  useEffect(() => {
    safeStorage.set('ge_catalogo_properties', properties);
  }, [properties]);

  // Sync visits
  useEffect(() => {
    safeStorage.set('prs_visit_schedules', scheduledVisits);
  }, [scheduledVisits]);

  // Property Alert Subscription state
  const [subscribingProperty, setSubscribingProperty] = useState<Property | null>(null);

  // Management functions for Admin
  const removeProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setCapturedList(prev => prev.filter(c => c.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    setAlertSubscriptions(prev => prev.filter(s => s.propertyId !== id));
  };

  const [alertEmail, setAlertEmail] = useState('');
  const [alertType, setAlertType] = useState<'both' | 'price' | 'status'>('both');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertSubscriptions, setAlertSubscriptions] = useState<Array<{propertyId: string; email: string; type: string}>>(() => 
    safeStorage.get('prs_alert_subscriptions', [])
  );

  useEffect(() => {
    safeStorage.set('prs_alert_subscriptions', alertSubscriptions);
  }, [alertSubscriptions]);

  // Helper trigger to filter listings by direct categories
  const handleSetPurposeTab = (tab: 'comprar' | 'arrendar' | 'terrenos') => {
    if (tab === 'comprar') {
      setPurposeFilter('Venda');
      setTypeFilter('Todos');
    } else if (tab === 'arrendar') {
      setPurposeFilter('Arrendamento');
      setTypeFilter('Todos');
    } else if (tab === 'terrenos') {
      setPurposeFilter('Terrenos');
      setTypeFilter('Todos');
    }
    setActiveTab('imoveis');
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  // Callback of CaptaForm
  const onAddCapturedProperty = (formData: any) => {
    const newCap: CaptureProperty = {
      id: `captured-${Date.now()}`,
      ownerName: formData.ownerName,
      ownerContact: formData.ownerContact,
      title: formData.title,
      type: formData.type,
      purpose: formData.purpose,
      province: formData.province,
      location: formData.location,
      price: formData.price,
      area: formData.area,
      imageFiles: formData.imageFiles,
      description: formData.description,
      status: 'Revisão'
    };

    setCapturedList(prev => [newCap, ...prev]);

    // Append to search catalog on the fly as a simulated new property!
    const simulatedProp: Property = {
      id: newCap.id,
      title: newCap.title,
      description: newCap.description,
      price: newCap.price,
      purpose: newCap.purpose,
      type: newCap.type,
      location: newCap.location,
      province: newCap.province,
      area: newCap.area,
      image: newCap.imageFiles[0],
      isNew: true,
      features: ['Electricidade na porta', 'Acesso Facilitado', 'Anúncio de Proprietário'],
      ownerContact: newCap.ownerContact
    };

    setProperties(prev => [simulatedProp, ...prev]);
  };

  // Callback of visit scheduling
  const onConfirmSchedule = (scheduleData: any) => {
    const newSchedule: VisitSchedule = {
      id: `visit-${Date.now()}`,
      propertyId: scheduleData.propertyId,
      propertyName: scheduleData.propertyName,
      clientName: scheduleData.clientName,
      clientEmail: scheduleData.clientEmail,
      clientPhone: scheduleData.clientPhone,
      date: scheduleData.date,
      time: scheduleData.time,
      message: scheduleData.message,
      status: 'Pendente'
    };
    setScheduledVisits(prev => [newSchedule, ...prev]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribedNewsletter(true);
      setNewsletterEmail('');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactPhone) {
      setContactSuccess(true);
      setContactName('');
      setContactPhone('');
      setContactMsg('');
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  // Floating WhatsApp message dispatchers
  const formatWhatsAppLink = (messageType: 'visita' | 'orcamento' | 'duvida') => {
    const phoneNumber = '258852408905'; // Official Grupo Edson Imobiliária WhatsApp
    let text = '';
    if (messageType === 'visita') {
      text = 'Olá Grupo Edson Imobiliária! Gostaria de agendar uma visita guiada para as vossas vivendas e terrenos em destaque.';
    } else if (messageType === 'orcamento') {
      text = 'Olá equipa do Grupo Edson! Desejo pedir um orçamento detalhado e prazos de legalização para um terreno/casa.';
    } else {
      text = 'Olá, tenho algumas dúvidas relativamente ao processo de verificação de DUAT e aquisição de imóveis.';
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsWhatsAppHubOpen(false);
  };

  // Property list filtered
  const filteredList = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = provinceFilter === 'Todas' || prop.province === provinceFilter;
    const matchesType = typeFilter === 'Todos' || prop.type === typeFilter;
    const matchesPurpose = purposeFilter === 'Todos' || prop.purpose === purposeFilter;
    const matchesPrice = prop.price <= maxPrice;
    return matchesSearch && matchesProvince && matchesType && matchesPurpose && matchesPrice;
  });

  // Calculate dynamic regional metrics
  const propertyCountByProvince: Record<MozambiqueProvince, number> = {
    'Maputo Cidade': properties.filter(p => p.province === 'Maputo Cidade').length,
    'Matola': properties.filter(p => p.province === 'Matola').length,
    'Maputo Província': properties.filter(p => p.province === 'Maputo Província').length,
    'Sofala': properties.filter(p => p.province === 'Sofala').length,
    'Nampula': properties.filter(p => p.province === 'Nampula').length,
    'Cabo Delgado': properties.filter(p => p.province === 'Cabo Delgado').length,
  };

  // Fast Navigation Handler representing requested exact structured menus
  const handleNavClick = (tab: NavTab) => {
    setIsMobileMenuOpen(false);
    
    if (tab === 'comprar') {
      handleSetPurposeTab('comprar');
    } else if (tab === 'arrendar') {
      handleSetPurposeTab('arrendar');
    } else if (tab === 'terrenos') {
      handleSetPurposeTab('terrenos');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen flex flex-col font-sans selection:bg-[#d4af37] selection:text-white relative scroll-smooth overflow-x-hidden">
      
      {/* PROFESSIONAL FLOATING WHATSAPP HUB */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2" id="floating-whatsapp-integrated">
        {isWhatsAppHubOpen && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl w-64 md:w-72 space-y-3 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold font-mono text-emerald-400">Atendimento WhatsApp</span>
              </div>
              <button onClick={() => setIsWhatsAppHubOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              Escolha uma das opções para falar diretamente com a Naira Macuacua no WhatsApp corporativo:
            </p>
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => formatWhatsAppLink('visita')}
                className="w-full text-left py-2 px-3 bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-xs flex items-center justify-between font-medium transition text-gray-200"
              >
                <span>📅 Solicitar Visita Física</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </button>
              <button
                onClick={() => formatWhatsAppLink('orcamento')}
                className="w-full text-left py-2 px-3 bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-xs flex items-center justify-between font-medium transition text-gray-200"
              >
                <span>💰 Pedir Orçamento de Imóvel</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => formatWhatsAppLink('duvida')}
                className="w-full text-left py-2 px-3 bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-xs flex items-center justify-between font-medium transition text-gray-200"
              >
                <span>💬 Tirar Dúvidas Rápidas</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
            <div className="text-[9px] text-gray-500 font-mono text-center pt-1 border-t border-white/5">
              Tempo de resposta médio: ~5 minutos
            </div>
          </div>
        )}

        <button
          onClick={() => setIsWhatsAppHubOpen(!isWhatsAppHubOpen)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative transition hover:scale-106 active:scale-95 border-2 border-slate-950 cursor-pointer"
        >
          {/* Custom SVG logo of WhatsApp */}
          <svg className="w-7 h-7 fill-slate-900" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.994 9.994 0 004.78 1.22h.004c5.505 0 9.99-4.478 9.99-9.983A9.982 9.982 0 0012.012 2zm5.735 14.258c-.248.697-1.448 1.353-2.002 1.412-.553.058-1.107.295-3.541-.667-2.93-1.161-4.814-4.136-4.96-4.332-.146-.195-1.168-1.55-1.154-2.955.014-1.406.743-2.1 1.006-2.378.262-.279.568-.35.758-.35.19 0 .38.001.546.009.175.008.408-.066.64.491.242.58.828 2.013.9 2.158.073.146.121.315.022.51-.099.196-.15.316-.298.491-.148.175-.313.291-.444.444-.143.167-.294.347-.126.634.167.288.745 1.229 1.597 1.987.896.797 1.652 1.042 1.94 1.162.288.119.454.099.624-.099.17-.196.726-.843.92-1.134.193-.292.387-.243.654-.146.268.099 1.696.8 1.99.946.294.146.49.219.562.343.072.126.072.712-.176 1.409z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-950 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-bounce">
            3
          </span>
        </button>
      </div>

      {/* FLOATING GENERAL CHATBOT */}
      <ChatOnline />

      {/* FIXED PREMIUM HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 fixed top-0 w-full z-45 transition duration-300 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo brand */}
          <div 
            onClick={() => setActiveTab('inicio')} 
            className="cursor-pointer select-none group"
          >
            <Logo variant="light" />
          </div>

          {/* Desktop navigation bar strictly following user menu sequence requested */}
          <nav className="hidden lg:flex items-center gap-0.5" id="desktop-primary-nav-menu">
            {[
              { id: 'inicio', label: 'Início' },
              { id: 'imoveis', label: 'Imóveis' },
              { id: 'comprar', label: 'Comprar' },
              { id: 'arrendar', label: 'Arrendar' },
              { id: 'terrenos', label: 'Terrenos' },
              { id: 'anuncie', label: 'Anuncie seu Imóvel' },
              { id: 'blog', label: 'Blog' },
              { id: 'sobre', label: 'Sobre Nós' },
              { id: 'contactos', label: 'Contactos' }
            ].map((item) => {
              // Highlight based on current state
              const isSelected = activeTab === item.id || 
                (item.id === 'comprar' && activeTab === 'imoveis' && purposeFilter === 'Venda') ||
                (item.id === 'arrendar' && activeTab === 'imoveis' && purposeFilter === 'Arrendamento') ||
                (item.id === 'terrenos' && activeTab === 'imoveis' && purposeFilter === 'Terrenos');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as NavTab)}
                  className={`text-xs px-3.5 py-2 rounded-lg font-bold uppercase tracking-wider transition ${
                    isSelected
                      ? 'text-[#aa771c] bg-amber-500/10 border-b border-[#aa771c]/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Side: Display quick contact & mobile menu trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('contactos')}
              className="hidden sm:inline-flex bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 border border-amber-600/30 font-black text-[10px] md:text-xs px-4 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition shadow-md uppercase tracking-wider"
            >
              Agendar Visita 📅
            </button>

            {/* THREE DOTS OVERFLOW DROP-DOWN FOR BACK-OFFICE / ADMIN ACTION */}
            <div className="relative">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="p-2 bg-slate-100 border border-slate-200 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 text-slate-600 hover:text-[#d4af37] rounded-lg transition flex items-center justify-center focus:outline-none"
                title="Mais Opções / Administração"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {isAdminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 p-2 shadow-2xl z-50 animate-fade-in text-left">
                  <div className="px-2 py-1 border-b border-slate-100 mb-1 text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Opções
                  </div>
                  <button
                    onClick={() => {
                      handleNavClick('admin');
                      setIsAdminDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Painel Administrador</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE NAVIGATION MENU BLOCK */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-slate-50 border-b border-slate-200 py-4 px-4 space-y-1 animate-fade-in" id="mobile-primary-nav-menu">
            {[
              { id: 'inicio', label: 'Início' },
              { id: 'imoveis', label: 'Imóveis' },
              { id: 'comprar', label: 'Comprar (Venda)' },
              { id: 'arrendar', label: 'Arrendar (Aluguer)' },
              { id: 'terrenos', label: 'Terrenos Moçambique' },
              { id: 'anuncie', label: 'Anuncie seu Imóvel' },
              { id: 'blog', label: 'Blog Imobiliário' },
              { id: 'sobre', label: 'Sobre Nós' },
              { id: 'contactos', label: 'Contactos & Localização' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavTab)}
                className={`w-full text-left font-bold text-xs uppercase tracking-wider py-2.5 px-3.5 rounded-lg transition ${
                  activeTab === item.id ? 'bg-[#d4af37]/15 text-[#aa771c]' : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('contactos')}
                className="w-full bg-[#d4af37] text-slate-900 font-extrabold text-xs py-2.5 rounded-lg hover:bg-yellow-500 transition text-center uppercase tracking-wider block"
              >
                Agendar Visita Agora 📅
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* PRIMARY VIEWS LAYOUT SWITCHER */}
      <main className="mt-[74px] flex-1">
        
        {/* ==================== 1. TABA - INÍCIO (HOME) ==================== */}
        {activeTab === 'inicio' && (
          <div className="space-y-16 animate-fade-in pb-12">
            
            {/* HERO BANNER BLOCK WITH SEARCH FILTER TRIGGERS */}
            <section className="relative min-h-[500px] flex items-center justify-center text-center px-4 overflow-hidden" id="luxury-home-hero">
              {/* Background cover image generated earlier */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/src/assets/images/luxury_house_maputo_1782032817194.jpg"
                  alt="Luxury Modern Villa in Maputo"
                  className="w-full h-full object-cover brightness-[0.25]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80"></div>
              </div>

              {/* Contents overlay */}
              <div className="max-w-4xl mx-auto space-y-6 z-10 relative py-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] md:text-xs font-bold uppercase tracking-wider animate-pulse">
                  <Award className="w-3.5 h-3.5" />
                  Membro Comercial da Associação Imobiliária de Moçambique
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase font-display max-w-3xl mx-auto">
                  Encontre a sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-500">Próxima Conquista</span>
                </h1>

                {/* Slogan requested exactly by the user */}
                <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed font-sans pr-1">
                  “Realizamos o sonho da casa própria e conectamos investidores às melhores oportunidades imobiliárias.”
                </p>

                {/* Simulated quick unified Search Engine */}
                <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto text-left space-y-3 backdrop-blur-md">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Province dropdown select */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Onde procura?</span>
                      <select
                        value={provinceFilter}
                        onChange={(e) => setProvinceFilter(e.target.value as MozambiqueProvince | 'Todas')}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl p-2.5 text-xs text-white uppercase focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Todas">Moçambique (Todas)</option>
                        <option value="Maputo Cidade">Maputo Cidade</option>
                        <option value="Matola">Matola Munique</option>
                        <option value="Maputo Província">Maputo Província</option>
                        <option value="Sofala">Sofala (Beira)</option>
                        <option value="Nampula">Nampula</option>
                      </select>
                    </div>

                    {/* Type dropdown select */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Tipo Imóvel</span>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'Todos')}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Todos">Todos os tipos</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Vivenda">Vivenda</option>
                        <option value="Terreno">Terrenos</option>
                        <option value="Escritório">Escritório</option>
                      </select>
                    </div>

                    {/* Search query input */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Palavra-chave</span>
                      <input
                        type="text"
                        placeholder="Ex: Sommerschield, Piscina"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      setPurposeFilter('Todos');
                      setActiveTab('imoveis');
                    }}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-extrabold text-xs py-3 rounded-xl transition hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest shadow-md"
                  >
                    <Search className="w-4 h-4 text-slate-900" />
                    Pesquisar {filteredList.length} Imóveis Disponíveis
                  </button>
                </div>

                {/* Quick features tracker */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono pt-4">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#d4af37]" /> DUAT Verificados</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#d4af37]" /> Matola e Maputo Expansão</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#d4af37]" /> Escritura Notarial Célere</span>
                </div>
              </div>
            </section>

            {/* ==================== SEÇÃO EXTERNA DE PUBLICIDADE DESTACADA ==================== */}
            <section className="max-w-7xl mx-auto px-4" id="special-ad-section">
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border-2 border-[#d4af37]/45 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
                
                {/* Decorative Premium Tag */}
                <div className="absolute top-4 right-4 bg-red-600 text-white font-extrabold text-[9px] sm:text-[10px] uppercase px-3 py-1 rounded-full tracking-widest shadow animate-pulse">
                  Destaque Comercial 🔥
                </div>

                {/* Left side: Property Image and Quick Badges */}
                <div className="w-full lg:w-5/12 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" 
                    alt="Vivenda de Luxo Publicidade" 
                    className="w-full h-64 object-cover object-center hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-2.5 px-4 backdrop-blur-sm text-center text-xs font-semibold text-white uppercase tracking-wider">
                    📍 Pronta para Habitar no Triunfo, Maputo
                  </div>
                </div>

                {/* Middle/Right: Information specifications requested by the user */}
                <div className="w-full lg:w-7/12 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-[#a3700b] text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    📢 ESPAÇO DE PUBLICIDADE PATROCINADA
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase font-display">
                    VIVENDA EXCLUSIVA DUPLEX T4 CONDOMÍNIO FECHADO
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    Aproveite esta oportunidade única anunciada pelo Consultor Oficial para adquirir este imóvel premium de alto padrão, idealizado para famílias que valorizam segurança absoluta, áreas de lazer completas e acabamentos finos.
                  </p>

                  {/* Core specifications requested: Quartos, Preço, Km, Localização */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans text-slate-800">
                    
                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-left">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Quartos</span>
                      <p className="text-sm font-black text-slate-950">4 Quartos (2 Suítes)</p>
                      <span className="text-[9px] text-slate-500 font-medium font-mono leading-none">Climatizado e Pronto</span>
                    </div>

                    <div className="bg-white border border-[#d4af37]/35 p-3 rounded-xl shadow-sm text-left">
                      <span className="text-[9px] uppercase font-mono font-bold text-amber-600 block">Preço</span>
                      <p className="text-sm font-black text-[#aa771c] font-display flex items-baseline gap-1">
                        14.500.000
                        <span className="text-[9px] font-mono font-black text-[#aa771c] uppercase tracking-wider">MZN</span>
                      </p>
                      <span className="text-[9px] text-emerald-600 font-bold font-mono leading-none">Negociável directamente</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-left">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Localização</span>
                      <p className="text-sm font-black text-slate-950">Bairro de Triunfo</p>
                      <span className="text-[9px] text-slate-500 font-mono leading-none">Zona de Alto Prestígio</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-left">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Distância / Km</span>
                      <p className="text-sm font-black text-slate-950">1.5 km do Centro</p>
                      <span className="text-[9px] text-slate-500 font-mono leading-none">Apenas 300m da praia</span>
                    </div>

                  </div>

                  {/* Featured Consultor Edson Massingue Profile area */}
                  <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-amber-500/10 text-[#aa771c] flex items-center justify-center font-bold text-sm shadow shrink-0">
                        EM
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#aa771c] font-bold block uppercase tracking-widest leading-none">Consultor Responsável</span>
                        <h4 className="text-sm font-black text-slate-950 leading-tight">Equipa de Gestão Imobiliária</h4>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono leading-none">Grupo Edson</p>
                      </div>
                    </div>

                    {/* Button Redirecting clients to the WhatsApp panel with details of this publicidade */}
                    <button
                      onClick={() => {
                        const message = `Olá Equipa Grupo Edson,\n\nVi a publicidade destacada no site referente ao imóvel:\n• Vivenda Duplex T4 no Triunfo\n• Quartos: 4 Quartos\n• Preço: 14.500.000 MZN\n• Localização: Bairro de Triunfo (a 1.5 km do centro)\n\nGostaria de obter mais informações, discutir os detalhes e agendar uma reunião comercial.`;
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/258852408905?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-[11px] px-4 py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
                    >
                      <svg className="w-4 h-4 fill-slate-950" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.994 9.994 0 004.78 1.22h.004c5.505 0 9.99-4.478 9.99-9.983A9.982 9.982 0 0012.012 2zm5.735 14.258c-.248.697-1.448 1.353-2.002 1.412-.553.058-1.107.295-3.541-.667-2.93-1.161-4.814-4.136-4.96-4.332-.146-.195-1.168-1.55-1.154-2.955.014-1.406.743-2.1 1.006-2.378.262-.279.568-.35.758-.35.19 0 .38.001.546.009.175.008.408-.066.64.491.242.58.828 2.013.9 2.158.073.146.121.315.022.51-.099.196-.15.316-.298.491-.148.175-.313.291-.444.444-.143.167-.294.347-.126.634.167.288.745 1.229 1.597 1.987.896.797 1.652 1.042 1.94 1.162.288.119.454.099.624-.099.17-.196.726-.843.92-1.134.193-.292.387-.243.654-.146.268.099 1.696.8 1.99.946.294.146.49.219.562.343.072.126.072.712-.176 1.409z" />
                      </svg>
                      Falar com Consultor Edson no WhatsApp 💬
                    </button>

                  </div>

                </div>

              </div>
            </section>

            {/* SEPARATE TARGET CATEGORIES (Comprar / Arrendar / Terrenos) PANELS */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6" id="quick-category-gateways">
              <div 
                onClick={() => handleSetPurposeTab('comprar')}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#d4af37]/60 hover:shadow-md transition duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#aa771c] flex items-center justify-center font-bold">
                    MZN
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded">
                    Aquisição Habitacional
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mt-4 group-hover:text-[#aa771c] transition">Comprar Casas & Vivendas</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                  Realize o sonho da casa própria. Encontre vivendas prontas a habitar nas melhores artérias de Sommerschield, Triunfo e Matola.
                </p>
                <span className="text-xs text-[#aa771c] font-black inline-flex items-center gap-1 mt-4">
                  Ver imóveis à venda <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </span>
              </div>

              <div 
                onClick={() => handleSetPurposeTab('arrendar')}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#d4af37]/60 hover:shadow-md transition duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    🔑
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded">
                    Renda Mensal
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mt-4 group-hover:text-[#aa771c] transition">Arrendar Apartamentos</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                  Apartamentos modernos T2, T3 fully furnished vista mar na Polana, Triunfo, e escritórios corporativos premium pronto-a-usar.
                </p>
                <span className="text-xs text-[#aa771c] font-black inline-flex items-center gap-1 mt-4">
                  Ver apartamentos para alugar <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </span>
              </div>

              <div 
                onClick={() => handleSetPurposeTab('terrenos')}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#d4af37]/60 hover:shadow-md transition duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                    🌱
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 px-2 py-0.5 rounded">
                    Loteamento Definitivo
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mt-4 group-hover:text-[#aa771c] transition">Terrenos & DUAT</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                  Lotes limpos e demarcados de 20x40 na Matola Gare, Tchumene, Beluluane e Marracuene, prontos para assentamento e construção civil.
                </p>
                <span className="text-xs text-[#aa771c] font-black inline-flex items-center gap-1 mt-4">
                  Ver terrenos disponíveis <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </section>

            {/* FEATURED PROPERTIES SECTION */}
            <section className="max-w-7xl mx-auto px-4 space-y-8" id="featured-homes-grid">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-l-4 border-[#d4af37] pl-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#aa771c] font-bold block">Conforto Extra</span>
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display uppercase">Imóveis em Destaque Especial</h2>
                    
                    {/* VIEW MODE TOGGLE */}
                    <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#aa771c]' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Grelha"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#aa771c]' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Lista"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPurposeFilter('Todos');
                    setTypeFilter('Todos');
                    setActiveTab('imoveis');
                  }}
                  className="text-xs font-bold text-[#aa771c] hover:brightness-110 flex items-center gap-1 font-mono tracking-wider transition"
                >
                  Ver Todo o Catálogo ({properties.length} imóveis)
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slider / grid layout */}
              <motion.div 
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "flex flex-col gap-6"
                }
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {properties.filter(p => p.isFeatured).map((prop) => (
                  <motion.div 
                    key={prop.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }
                    }}
                    className={`bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-[#d4af37]/60 hover:shadow-md transition duration-300 group flex text-slate-800 ${
                      viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row'
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'flex flex-col sm:flex-row flex-1' : ''}>
                      {/* Image block */}
                      <div className={`overflow-hidden bg-slate-100 relative ${
                        viewMode === 'grid' ? 'aspect-[4/3]' : 'aspect-square sm:w-64 sm:h-auto'
                      }`}>
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Purpose Tag */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className={`font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg ${
                            prop.purpose === 'Venda' 
                              ? 'bg-amber-500 text-slate-950' 
                              : prop.purpose === 'Arrendamento' 
                              ? 'bg-emerald-500 text-slate-950' 
                              : 'bg-orange-500 text-slate-100'
                          }`}>
                            {prop.purpose === 'Terrenos' ? 'Terreno' : prop.purpose}
                          </span>

                          {/* DYNAMIC STATUS BADGE */}
                          {prop.status && (
                            <span className={`font-black text-[8px] uppercase tracking-tighter px-2 py-0.5 rounded-md shadow-lg border backdrop-blur-sm self-start ${
                              prop.status === 'Disponível'
                                ? 'bg-emerald-400/90 text-emerald-950 border-emerald-500/20'
                                : prop.status === 'Reservado'
                                ? 'bg-rose-500/90 text-white border-rose-600/20'
                                : 'bg-amber-400/90 text-amber-950 border-amber-500/20'
                            }`}>
                              {prop.status}
                            </span>
                          )}
                        </div>

                        {/* Top Right features (Virtual Tour 360 available, etc) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {prop.hasVirtualTour && (
                            <span className="bg-slate-950/80 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Compass className="w-3 h-3 text-[#d4af37] animate-spin" />
                              Tour 360°
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleFavorite(prop.id, e)}
                            className="bg-slate-950/60 hover:bg-slate-950/90 text-white rounded-full p-1.5 border border-white/10 transition"
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(prop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-bold uppercase">
                          <MapPin className="w-3.5 h-3.5 text-[#aa771c] shrink-0" />
                          <span>{prop.location}</span>
                        </div>

                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#aa771c] transition duration-200 line-clamp-1">
                          {prop.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed font-sans">
                          {prop.description}
                        </p>

                        {/* House/plot size metrics */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-200 text-[11px] font-mono text-slate-600">
                          <div className="text-center border-r border-slate-200">
                            <span className="block text-[9px] text-slate-400 uppercase">Área</span>
                            <span className="font-bold text-slate-900">{prop.area} m²</span>
                          </div>
                          <div className="text-center border-r border-slate-200">
                            <span className="block text-[9px] text-slate-400 uppercase">Quartos</span>
                            <span className="font-bold text-slate-900">{prop.bedrooms !== undefined ? `${prop.bedrooms} Suítes` : 'N/A'}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[9px] text-slate-400 uppercase">WCs</span>
                            <span className="font-bold text-slate-900">{prop.bathrooms !== undefined ? `${prop.bathrooms} WC` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom actionable price bar with redesigned clean luxury writing */}
                    <div className="p-5 pt-0 mt-auto">
                      <div className="flex items-center justify-between gap-3">
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-3 py-1 text-left inline-block">
                          <span className="text-[8px] text-[#aa771c] font-mono block uppercase tracking-widest font-black leading-none mb-0.5">Valor</span>
                          <span className="font-extrabold font-display text-base text-[#aa771c] flex items-baseline gap-1">
                            {prop.price.toLocaleString('pt-MZ')}
                            <span className="text-[9px] font-mono font-black text-[#aa771c] uppercase tracking-wider">MZN</span>
                            {prop.purpose === 'Arrendamento' && <span className="text-[9px] text-slate-500 font-normal">/mês</span>}
                          </span>
                        </div>

                        {/* Direct contact options */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubscribingProperty(prop);
                              setAlertEmail('');
                              setAlertSuccess(false);
                            }}
                            className={`p-2 rounded-lg text-xs transition border ${
                              alertSubscriptions.some(sub => sub.propertyId === prop.id)
                                ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-800'
                                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                            }`}
                            title="Alertas de Redução de Preço/Estado"
                          >
                            <Bell className={`w-4 h-4 ${alertSubscriptions.some(sub => sub.propertyId === prop.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
                          </button>

                          {prop.hasVirtualTour && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActive360Prop(prop);
                              }}
                              className="p-2 bg-[#d4af37]/10 text-[#aa771c] border border-[#d4af37]/30 hover:bg-[#d4af37]/20 rounded-lg text-xs transition font-bold"
                              title="Ver Visita 360"
                            >
                              <Compass className="w-4 h-4 text-[#aa771c]" />
                            </button>
                          )}

                          {prop.videoUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoProp(prop);
                              }}
                              className="p-2 bg-slate-900 hover:bg-slate-950 text-[#d4af37] border border-[#d4af37]/30 rounded-lg text-xs transition"
                              title="Ver Vídeo HD do Telemóvel"
                            >
                              <Play className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                            </button>
                          )}

                          {prop.googleMapUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMapProp(prop);
                              }}
                              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-xs transition"
                              title="📍 Localização Exata no Mapa"
                            >
                              <MapPin className="w-4 h-4 text-[#aa771c]" />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedulingTarget(prop);
                            }}
                            className="px-3 py-2 bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-bold text-xs rounded-lg hover:brightness-110 transition shrink-0"
                          >
                            Visita
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* INTERACTIVE GEOGRAPHIC DISTRIBUTION MAP */}
            <section className="max-w-7xl mx-auto px-4 space-y-6" id="interactive-map-section">
              <div className="border-l-4 border-[#d4af37] pl-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block">Pesquisa por Localização</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display uppercase">Pesquisa de Imóvel Inteligente</h2>
              </div>
              <InteractiveMap
                selectedProvince={provinceFilter}
                onSelectProvince={(prov) => {
                  setProvinceFilter(prov);
                  if (prov !== 'Todas') {
                    // direct user to listing to see filtered results
                    setActiveTab('imoveis');
                  }
                }}
                propertyCountByProvince={propertyCountByProvince}
              />
            </section>

            {/* NEW PROPERTIES ARRIVALS GRID ("Novos Imóveis") */}
            <section className="max-w-7xl mx-auto px-4 space-y-8" id="recent-arrivals">
              <div className="flex items-center gap-3 border-l-4 border-[#d4af37] pl-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                    Oportunidades de Ouro do Mês
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display uppercase">Novos Imóveis Entrados</h2>
                </div>
              </div>

              {/* Grid 2x1 */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                {properties.slice(0, 4).map((prop) => (
                  <motion.div 
                    key={prop.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: 0.45, ease: "circOut" }
                      }
                    }}
                    onClick={() => {
                      setActiveTab('imoveis');
                      setSearchQuery(prop.title);
                    }}
                    className="bg-slate-900/60 border border-white/5 hover:border-[#d4af37]/35 rounded-2xl overflow-hidden p-4 flex flex-col sm:flex-row items-stretch gap-4 cursor-pointer hover:bg-slate-900 transition duration-300"
                  >
                    <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-left space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase">{prop.province} • {prop.location}</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase bg-emerald-400/10 px-2 py-0.5 rounded">Entrada Recente</span>
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-gray-100 line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{prop.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="font-mono font-bold text-xs text-gray-300">{prop.area} m² construído</span>
                        <span className="font-black font-mono text-sm text-[#d4af37]">{prop.price.toLocaleString('pt-MZ')} MZN</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* CLIENT TESTIMONIALS SECTION */}
            <section className="max-w-7xl mx-auto px-4 space-y-8" id="customer-opinions">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">Garantias & Avaliações</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase">Depoimentos de Clientes Satisfeitos</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Confie na transparência jurídica e liderança comercial do Grupo Edson em Moçambique. Veja opiniões de quem fechou contatos connosco.
                </p>
              </div>

              {/* Grid 3 cols */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CLIENT_REVIEWS.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between">
                    <span className="text-5xl font-serif text-[#d4af37]/15 absolute top-4 left-4">“</span>
                    <div className="space-y-4 relative">
                      <p className="text-xs text-justify text-gray-300 leading-relaxed italic">
                        {rev.content}
                      </p>
                      
                      {/* Interactive score star */}
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-950 shrink-0 border border-[#d4af37]/20">
                        <img
                          src={rev.image}
                          alt={rev.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-extrabold text-xs text-white">{rev.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono font-bold block">{rev.role} ({rev.location})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================== 2. TABA - CATÁLOGO DE IMÓVEIS (IMÓVEIS COMPLETE) ==================== */}
        {activeTab === 'imoveis' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            
            {/* Header portion */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-l-4 border-[#d4af37] pl-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                  {purposeFilter === 'Todos' ? 'Nosso Portfólio Predial' : `Imóveis para: ${purposeFilter}`}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Encontrámos {filteredList.length} imóveis correspondentes aos seus parâmetros de pesquisa no país.
                </p>
              </div>

              {/* Reset filter trigger */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setProvinceFilter('Todas');
                  setTypeFilter('Todos');
                  setMaxPrice(45000000);
                  setPurposeFilter('Todos');
                }}
                className="text-xs font-bold text-[#d4af37] hover:brightness-110 font-mono border-b border-dashed border-[#d4af37] py-1 cursor-pointer self-start md:self-auto"
              >
                Limpar Todos os Filtros
              </button>
            </div>

            {/* COMPLEX SEARCH CONTROL PANEL */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Purpose filtering (Sale, Rent, Land) */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-400">Finalidade do Imóvel</label>
                  <select
                    value={purposeFilter}
                    onChange={(e) => setPurposeFilter(e.target.value as PropertyPurpose | 'Todos')}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white uppercase font-bold focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Todos">Todas finalidades</option>
                    <option value="Venda">Venda de Casas</option>
                    <option value="Arrendamento">Arrendamentos</option>
                    <option value="Terrenos">Terrenos / DUAT</option>
                    <option value="Comercial">Espaços Comerciais</option>
                  </select>
                </div>

                {/* Province Selector */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-400">Localização (Província)</label>
                  <select
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value as MozambiqueProvince | 'Todas')}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Todas">Em todo o país (Todas)</option>
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Matola">Matola Munique</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Sofala">Sofala (Beira)</option>
                    <option value="Nampula">Nampula</option>
                  </select>
                </div>

                {/* Property Type selection */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-400">Tipo de Estrutura</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'Todos')}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Todos">Todos os formatos</option>
                    <option value="Casa">Casa Típica</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Vivenda">Vivenda de Luxo</option>
                    <option value="Terreno">Terrenos Demarcados</option>
                    <option value="Escritório">Escritório Corporal</option>
                  </select>
                </div>

                {/* Sliders for Maximum prices */}
                <div className="space-y-1.5 text-left flex flex-col justify-center">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400 uppercase">
                    <span>Preço Máximo</span>
                    <span className="text-[#d4af37]">{(maxPrice).toLocaleString('pt-MZ')} MZN</span>
                  </div>
                  <input
                    type="range"
                    min={40000}
                    max={45000000}
                    step={10000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37] mt-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-gray-500 font-mono mt-1">
                    <span>40k MZN</span>
                    <span>22 MZN (Média)</span>
                    <span>45 MZN (Luxo)</span>
                  </div>
                </div>

              </div>

              {/* Text keyword input */}
              <div className="relative text-left">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquise por palavras-chave: Sommerschield II, piscina, suite, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* RESULTS CATALOG FILTERED LIST */}
            {filteredList.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {filteredList.map((prop) => (
                  <motion.div
                    key={prop.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                    className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/35 transition duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo backdrop */}
                      <div className="aspect-[4/3] overflow-hidden bg-slate-950 relative">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Purpose Tag */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className={`font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg ${
                            prop.purpose === 'Venda' 
                              ? 'bg-amber-500 text-slate-950' 
                              : prop.purpose === 'Arrendamento' 
                              ? 'bg-emerald-500 text-slate-950' 
                              : 'bg-orange-500 text-slate-100'
                          }`}>
                            {prop.purpose === 'Terrenos' ? 'Terreno' : prop.purpose}
                          </span>

                          {/* DYNAMIC STATUS BADGE */}
                          {prop.status && (
                            <span className={`font-black text-[8px] uppercase tracking-tighter px-2 py-0.5 rounded-md shadow-lg border backdrop-blur-sm self-start ${
                              prop.status === 'Disponível'
                                ? 'bg-emerald-400/90 text-emerald-950 border-emerald-500/20'
                                : prop.status === 'Reservado'
                                ? 'bg-rose-500/90 text-white border-rose-600/20'
                                : 'bg-amber-400/90 text-amber-950 border-amber-500/20'
                            }`}>
                              {prop.status}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {prop.hasVirtualTour && (
                            <span className="bg-slate-950/80 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Compass className="w-3 h-3 text-[#d4af37] animate-spin" />
                              Tour 360°
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleFavorite(prop.id, e)}
                            className="bg-slate-950/60 hover:bg-slate-950/90 text-white rounded-full p-1.5 border border-white/10 transition"
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(prop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Card Content data */}
                      <div className="p-5 text-left space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[#d4af37] font-bold uppercase truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span>{prop.location}</span>
                        </div>

                        <h3 className="font-extrabold text-sm sm:text-base text-gray-100 group-hover:text-[#d4af37] transition duration-200 line-clamp-1">
                          {prop.title}
                        </h3>

                        <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
                          {prop.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-white/5 text-[11px] font-mono text-gray-300">
                          <div className="text-center border-r border-white/5">
                            <span className="block text-[9px] text-gray-500 uppercase">Área</span>
                            <span className="font-bold">{prop.area} m²</span>
                          </div>
                          <div className="text-center border-r border-white/5">
                            <span className="block text-[9px] text-gray-500 uppercase">Quartos</span>
                            <span className="font-bold">{prop.bedrooms !== undefined ? `${prop.bedrooms} Suítes` : 'N/A'}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[9px] text-gray-500 uppercase">WCs</span>
                            <span className="font-bold">{prop.bathrooms !== undefined ? `${prop.bathrooms} WC` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer bar with redesigned luxury dark-theme price writing */}
                    <div className="p-5 pt-0 mt-auto">
                      <div className="flex items-center justify-between gap-3">
                        <div className="bg-[#d4af37]/5 border border-[#d4af37]/15 rounded-xl px-3 py-1 text-left inline-block">
                          <span className="text-[8px] text-[#d4af37] font-mono block uppercase tracking-widest font-black leading-none mb-0.5">Preço</span>
                          <span className="font-extrabold font-display text-base text-[#d4af37] flex items-baseline gap-1">
                            {prop.price.toLocaleString('pt-MZ')}
                            <span className="text-[9px] font-mono font-black text-[#d4af37] uppercase tracking-wider">MZN</span>
                            {prop.purpose === 'Arrendamento' && <span className="text-[9px] text-gray-400 font-normal">/mês</span>}
                          </span>
                        </div>

                        {/* Actions block list */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubscribingProperty(prop);
                              setAlertEmail('');
                              setAlertSuccess(false);
                            }}
                            className={`p-2 rounded-lg text-xs transition border ${
                              alertSubscriptions.some(sub => sub.propertyId === prop.id)
                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                                : 'bg-slate-800 hover:bg-slate-750 border-white/10 text-[#d4af37]'
                            }`}
                            title="Subscrever Alertas de Preço"
                          >
                            <Bell className={`w-4 h-4 ${alertSubscriptions.some(sub => sub.propertyId === prop.id) ? 'fill-[#d4af37]' : ''}`} />
                          </button>

                          {prop.hasVirtualTour && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActive360Prop(prop);
                              }}
                              className="p-2 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/20 rounded-lg text-xs transition"
                            >
                              <Compass className="w-4 h-4 text-[#d4af37] animate-spin" />
                            </button>
                          )}

                          {prop.videoUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoProp(prop);
                              }}
                              className="p-2 bg-slate-850 hover:bg-slate-900 border border-[#d4af37]/25 text-[#d4af37] rounded-lg text-xs transition"
                              title="Ver Vídeo HD da Galeria"
                            >
                              <Play className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                            </button>
                          )}

                          {prop.googleMapUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMapProp(prop);
                              }}
                              className="p-2 bg-slate-800 hover:bg-slate-755 border border-white/10 text-[#d4af37] rounded-lg text-xs transition"
                              title="Localização GPS Exata"
                            >
                              <MapPin className="w-4 h-4 text-[#d4af37]" />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedulingTarget(prop);
                            }}
                            className="px-3 py-2 bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-bold text-xs rounded-lg hover:brightness-110 transition shrink-0"
                          >
                            Visitar
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl py-16 px-4 text-center text-gray-400">
                <Search className="w-12 h-12 text-gray-600 mx-auto opacity-40 mb-3" />
                <p className="text-sm font-bold text-gray-300">Nenhum imóvel corresponde aos parâmetros de busca.</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Tente alargar a sua margem de preços, selecionar "Todas" as províncias ou apagar a palavra-chave.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setProvinceFilter('Todas');
                      setTypeFilter('Todos');
                      setMaxPrice(45000000);
                      setPurposeFilter('Todos');
                    }}
                    className="bg-[#d4af37] text-slate-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                  >
                    Restabelecer Parâmetros
                  </button>
                </div>
              </div>
            )}
            
          </div>
        )}

        {/* ==================== 6. TABA - ANUNCIE SEU IMÓVEL (CAPTAFORM ADVERTISE) ==================== */}
        {activeTab === 'anuncie' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="border-l-4 border-[#d4af37] pl-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block">Conectando Proprietários</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                Anuncie Connosco Gratuitamente
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Atraia compradores qualificados e corporações de investimento locais/internacionais para o seu ativo predial.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2">
                <CaptaForm onAddCapturedProperty={onAddCapturedProperty} />
              </div>

              {/* Informative side steps panel */}
              <div className="space-y-6 text-left">
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-sm text-[#d4af37] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#d4af37]" /> Informações Úteis para Vendas
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-3.5 leading-normal list-none pl-0">
                    <li className="flex gap-2">
                      <span className="text-[#d4af37] font-bold">1.</span>
                      <span>Após submeter, o seu imóvel será listado provisoriamente sob revisão de autenticidade predial.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#d4af37] font-bold">2.</span>
                      <span>O proprietário deve certificar-se de que os limites do lote estão em conformidade com as diretivas municipais.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#d4af37] font-bold">3.</span>
                      <span>Anexar o DUAT titulado ou plantas topográficas acelera o processo de avaliação no conselho predial.</span>
                    </li>
                  </ul>
                </div>

                {/* Local submitted list tracker if any */}
                {capturedList.length > 0 && (
                  <div className="bg-slate-900 border border-[#d4af37]/10 rounded-2xl p-5 space-y-3">
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Os Seus Anúncios Submetidos ({capturedList.length})</h4>
                    <div className="divide-y divide-white/5">
                      {capturedList.map((item) => (
                        <div key={item.id} className="py-2.5 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-gray-500">Ref: {item.id.slice(-6)}</span>
                            <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">{item.status}</span>
                          </div>
                          <h5 className="font-bold text-xs text-gray-200 line-clamp-1">{item.title}</h5>
                          <div className="flex justify-between items-center text-[11px] font-mono text-[#d4af37]">
                            <span>{item.price.toLocaleString('pt-MZ')} MZN</span>
                            <span className="text-gray-400">{item.area} m²</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* ==================== 7. TABA - BLOG (BLOG GUIDE READS) ==================== */}
        {activeTab === 'blog' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="border-l-4 border-[#d4af37] pl-3 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">Dicas, Legislação & Análise</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                Fórum & Blog Imobiliário
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Conhecimento técnico que ajuda na escalabilidade e legalização jurídica do seu investimento em Moçambique.
              </p>
            </div>

            <BlogSection articles={BLOG_ARTICLES} />
          </div>
        )}

        {/* ==================== 8. TABA - SOBRE NÓS (HISTORY, MISSION, VISION) ==================== */}
        {activeTab === 'sobre' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-16 animate-fade-in text-left">
            
            {/* Header / Intro story block */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] font-mono bg-[#d4af37]/10 text-[#d4af37] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full">
                  Liderança e Solidez
                </span>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase leading-tight">
                  A Nossa História & <span className="text-[#d4af37]">A Nossa Missão</span>
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-justify">
                  O <strong>Grupo Edson Imobiliária</strong> nasceu com a missão clara de transformar o mercado imobiliário em Moçambique. Reconhecemos os desafios burocráticos e os medos inerentes à aquisição de terras e habitações no país, e decidimos erguer uma ponte pautada pela total conformidade legal, transparência e profissionalismo absoluto.
                </p>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-justify">
                  Conectamos investidores locais, a diáspora moçambicana de elite comercial e consórcios multinacionais a ativos de alto valor produtivo na Matola, Maputo e outras províncias, garantindo a veracidade de cada certidão predial, conformidade de DUAT e demarcação sob os mais estritos preceitos de agrimensura.
                </p>
              </div>

              {/* Cover mock side image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-950">
                <img
                  src="https://picsum.photos/seed/real_estate_meeting/800/600"
                  alt="Grupo Edson Corporate Board Meeting"
                  className="w-full h-full object-cover brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-[#d4af37]/25 p-4 rounded-xl text-xs font-mono">
                  <span className="text-[#d4af37] font-black">TRANSPARÊNCIA CORPORATIVA</span>
                  <p className="text-gray-400 mt-1">Conduzindo negócios com conformidade junto ao Conselho Notarial de Maputo.</p>
                </div>
              </div>
            </section>

            {/* MISSION, VISION, VALUES CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-500/15 border border-[#d4af37]/25 text-[#d4af37] rounded-xl flex items-center justify-center font-bold">
                  🎯
                </div>
                <h3 className="font-extrabold text-base text-gray-100 uppercase tracking-wider font-display">Missão</h3>
                <p className="text-xs text-gray-400 leading-relaxed text-justify">
                  Garantir transações imobiliárias e agrárias extraordinariamente seguras e simplificadas, ajudando cada cliente a realizar o sonho da habitação própria legalizada ou escalabilidade empresarial em Moçambique.
                </p>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-500/15 border border-[#d4af37]/15 text-[#d4af37] rounded-xl flex items-center justify-center">
                  👁️
                </div>
                <h3 className="font-extrabold text-base text-gray-100 uppercase tracking-wider font-display">Visão</h3>
                <p className="text-xs text-gray-400 leading-relaxed text-justify">
                  Consolidarmo-nos como o grupo de consultores de ativos imobiliários mais respeitado e tecnológico de Moçambique, sendo a autoridade de cabeceira para investidores estrangeiros e diáspora.
                </p>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/15 border border-[#d4af37]/15 text-[#d4af37] rounded-xl flex items-center justify-center">
                  🤝
                </div>
                <h3 className="font-extrabold text-base text-gray-100 uppercase tracking-wider font-display">Valores</h3>
                <p className="text-xs text-gray-400 leading-relaxed text-justify">
                  Soberania legal e ética, conformidade total de DUAT, segurança anti-burla, respeito irredutível ao esforço financeiro do cliente e foco inegociável na agilidade de atendimento.
                </p>
              </div>

            </section>

            {/* TEAM BLOCK - Naira, Pires Jr., Felisberto Nhaca */}
            <section className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">Nossa Equipa Técnica</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase">Lado a Lado Com o Seu Investimento</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Profissionais especializados com registo ativo e ampla vivência prática de negócios públicos e corporativos.
                </p>
              </div>

              {/* Grid 3 cols */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {OUR_TEAM.map((member, i) => (
                  <div key={i} className="bg-slate-900 border border-white/5 hover:border-[#d4af37]/20 rounded-2xl overflow-hidden text-center group transition">
                    <div className="aspect-square bg-slate-950 relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent"></div>
                    </div>
                    <div className="p-6 space-y-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-gray-100 group-hover:text-[#d4af37] transition duration-200">{member.name}</h4>
                        <span className="text-[10px] font-mono text-gray-500 font-bold uppercase block mt-0.5">{member.role}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed text-center font-sans line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================== 9. TABA - CONTACTOS (CONTACT INFORMATION / SCHEDULING LIST) ==================== */}
        {activeTab === 'contactos' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fade-in text-left">
            <div className="border-l-4 border-[#d4af37] pl-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">Canais de Atendimento</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                Contacte o Grupo Edson Imobiliária
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Fale connosco, tire dúvidas sobre DUAT ou agende uma visita presencial às nossas dependências.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6 lg:col-span-1">
                
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">Escritório Central (Moçambique)</span>
                  <div className="text-xs text-gray-300 space-y-3 leading-normal">
                    <p className="font-medium">
                      Vaz Spenser Street, Q28, No. 125, Matola, Moçambique.
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" /> -
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp: -
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" /> Telefone Alternativo: +258 87 292 1104
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 font-mono">
                      E-mail: info@edsongroup.co.mz
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Horário de Atendimento</span>
                  <div className="text-xs text-gray-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span className="font-bold text-white">08h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábados:</span>
                      <span className="font-bold text-white">09h00 - 13h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingos:</span>
                      <span className="text-amber-500 font-bold">Por marcação especial</span>
                    </div>
                  </div>
                </div>

                {/* Social Networks Integration block asked */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Nossas Redes Sociais</span>
                  <div className="flex items-center gap-3">
                    <a href="https://facebook.com" target="_blank" className="p-2.5 bg-slate-950/60 hover:bg-slate-950 text-gray-300 hover:text-[#d4af37] rounded-xl border border-white/10 transition">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="https://instagram.com" target="_blank" className="p-2.5 bg-slate-950/60 hover:bg-slate-950 text-gray-300 hover:text-[#d4af37] rounded-xl border border-white/10 transition">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" className="p-2.5 bg-slate-950/60 hover:bg-slate-950 text-gray-300 hover:text-[#d4af37] rounded-xl border border-white/10 transition">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" className="p-2.5 bg-slate-950/60 hover:bg-slate-950 text-gray-300 hover:text-[#d4af37] rounded-xl border border-white/10 transition flex items-center justify-center font-bold text-xs" title="TikTok Grupo Edson">
                      🎵 TikT
                    </a>
                  </div>
                </div>

              </div>

              {/* Central Contact message card & Scheduling ledger */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-extrabold text-base text-gray-100 uppercase tracking-wider mb-4 font-display">Enviar Mensagem Direta</h3>
                  
                  {contactSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs mb-4">
                      ✓ Mensagem enviada com sucesso! O nosso Diretor Comercial responderá ao seu terminal telefónico muito em breve.
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Seu Nome *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ex: Celso Mandlate"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Telemóvel de Contacto *</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Ex: 849584300"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Assunto ou Requisito de Propriedade *</label>
                      <textarea
                        rows={3}
                        required
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Ex: Procuro terreno demarcado de 20x40 para arrendamento ou casa T3 na Matola Rio..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:border-[#d4af37] focus:outline-none resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition shadow-md"
                    >
                      Enviar Mensagem
                    </button>
                  </form>
                </div>

                {/* Scheduling visitor appointments table tracker as requested */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-extrabold text-base text-gray-100 uppercase tracking-widwider mb-1 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#d4af37]" />
                    Ficha de Agendamentos Recentes ({scheduledVisits.length})
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Acompanhe as datas de visita reservadas por si neste dispositivo:</p>

                  {scheduledVisits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-gray-300">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] text-gray-500 text-left">
                            <th className="py-2">Imóvel Pretendido</th>
                            <th className="py-2">Nome Cliente</th>
                            <th className="py-2">Data / Hora</th>
                            <th className="py-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {scheduledVisits.map((v) => (
                            <tr key={v.id} className="hover:bg-white/2">
                              <td className="py-3 font-semibold text-gray-200 pr-2 max-w-[150px] truncate">{v.propertyName}</td>
                              <td className="py-3 text-gray-400">{v.clientName}</td>
                              <td className="py-3 text-white">
                                {v.date} 
                                <span className="block text-[10px] text-gray-500">{v.time}</span>
                              </td>
                              <td className="py-3 text-right">
                                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500 text-xs">
                      Ainda não efetuou nenhum pedido de visita física online neste dispositivo.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== 8. TAB - ADMIN / MANAGEMENT BACK-OFFICE ==================== */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminDashboard
              properties={properties}
              setProperties={setProperties}
              removeProperty={removeProperty}
              capturedList={capturedList}
              setCapturedList={setCapturedList}
              scheduledVisits={scheduledVisits}
              setScheduledVisits={setScheduledVisits}
              onGoBack={() => setActiveTab('inicio')}
            />
          </div>
        )}

      </main>

      {/* ==================== PROFESSIONAL OVERLAYS AND SIMULATORS ==================== */}
      
      {/* 1. TOUR VIRTUAL 360° SIMULATOR OVERLAY */}
      {active360Prop && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 z-55 text-left font-sans" id="virtual-360-tour-window">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#d4af37]/90 tracking-widest block flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin" />
                Simulador de Tour Panorâmico 360°
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">{active360Prop.title}</h2>
            </div>
            
            <button
              onClick={() => setActive360Prop(null)}
              className="bg-white/5 hover:bg-white/10 text-white rounded-full p-2 border border-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panoramic viewport simulation */}
          <div className="flex-1 my-6 rounded-2xl overflow-hidden border border-white/10 relative bg-slate-900 flex items-center justify-center">
            
            {/* Visual simulation shifting background positioning depending on the viewer angle */}
            <div 
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{
                backgroundImage: `url(${active360Prop.image})`,
                backgroundSize: '250% 150%',
                backgroundPosition: `${viewing360Angle}% center`,
                filter: 'brightness(0.7)'
              }}
            />

            {/* Simulated navigation nodes floating onto the layout */}
            <div className="absolute top-[40%] left-[30%] text-center pointer-events-none">
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-[#d4af37]/30">
                Aceder à Suite Principal 🛏️
              </span>
            </div>
            <div className="absolute top-[55%] right-[25%] text-center pointer-events-none">
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-[#d4af37]/30">
                Piscina exterior & Alpendre 🏊
              </span>
            </div>

            {/* Instruction tooltip in screen center */}
            <div className="relative z-10 text-center bg-slate-950/80 pb-3 pt-4 px-4 rounded-xl max-w-xs border border-[#d4af37]/20">
              <Compass className="w-6 h-6 text-[#d4af37] mx-auto animate-pulse mb-1.5" />
              <p className="text-[11px] font-medium leading-relaxed">
                Utilize as setas inferiores para rotacionar horizontalmente o giroscópio virtual de 360 graus.
              </p>
            </div>

            {/* Virtual Compass degree indicators */}
            <div className="absolute top-4 left-4 bg-slate-950/85 py-1 px-2.5 rounded-lg text-[10px] font-mono text-gray-400">
              COORD: <span className="text-[#d4af37] font-bold">{viewing360Angle * 3.6}°</span> AZIMUTE
            </div>
          </div>

          {/* Controls bar */}
          <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 leading-normal max-w-sm">
              Estamos a reproduzir fotografias esféricas de elevada amostragem de cores para permitir uma visão panorâmica autónoma a partir da sua casa.
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setViewing360Angle(prev => (prev - 15 + 100) % 100)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition"
              >
                ◀ Rodar Esquerda
              </button>
              <button
                onClick={() => setViewing360Angle(prev => (prev + 15) % 100)}
                className="bg-slate-850 hover:bg-slate-700 text-[#d4af37] font-extrabold px-4 py-2.5 rounded-xl text-xs transition border border-[#d4af37]/30"
              >
                Rodar Direita ▶
              </button>
              <button
                onClick={() => {
                  setActive360Prop(null);
                  setSchedulingTarget(active360Prop);
                }}
                className="bg-[#d4af37] text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition"
              >
                Agendar Visita Física 📅
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Video Player overlay */}
      {activeVideoProp && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 z-55 text-left font-sans" id="video-preview-window">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#d4af37]/90 tracking-widest block flex items-center gap-1">
                <Play className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                Vídeo HD de Visualização Premium
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">{activeVideoProp.title}</h2>
            </div>
            
            <button
              onClick={() => setActiveVideoProp(null)}
              className="bg-white/5 hover:bg-white/10 text-white rounded-full p-2 border border-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player */}
          <div className="flex-1 my-6 rounded-2xl overflow-hidden border border-white/10 relative bg-black flex items-center justify-center">
            {activeVideoProp.videoUrl ? (
              <video 
                src={activeVideoProp.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full max-h-[70vh] object-contain rounded-xl"
              />
            ) : (
              <div className="text-center p-8 space-y-4 max-w-sm">
                <p className="text-slate-400 text-sm font-semibold">Sem arquivo de vídeo de alta definição carregado.</p>
                <p className="text-xs text-slate-500 font-mono">Peça ao Consultor Edson para carregar um vídeo na galeria.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="text-xs text-slate-400 font-mono">
              Grupo Edson Imobiliária • Conteúdo multimédia exclusivo em alta definição.
            </div>

            <button
              onClick={() => {
                setActiveVideoProp(null);
                setSchedulingTarget(activeVideoProp);
              }}
              className="bg-[#d4af37] text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition"
            >
              Agendar Visita Física 📅
            </button>
          </div>
        </div>
      )}

      {/* Google Map overlay */}
      {activeMapProp && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 z-55 text-left font-sans" id="map-preview-window">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#d4af37]/90 tracking-widest block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                Localização Exata no Google Maps
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">{activeMapProp.title}</h2>
            </div>
            
            <button
              onClick={() => setActiveMapProp(null)}
              className="bg-white/5 hover:bg-white/10 text-white rounded-full p-2 border border-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Map display */}
          <div className="flex-1 my-6 rounded-2xl overflow-hidden border border-white/10 relative bg-slate-900 flex items-center justify-center">
            {activeMapProp.googleMapUrl ? (
              <iframe
                title={`Map for ${activeMapProp.title}`}
                src={activeMapProp.googleMapUrl.includes('src="') 
                  ? activeMapProp.googleMapUrl.split('src="')[1].split('"')[0] 
                  : activeMapProp.googleMapUrl
                }
                className="w-full h-full border-0 rounded-xl"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="text-center p-8 space-y-4 max-w-sm">
                <MapPin className="w-12 h-12 text-[#d4af37]/30 mx-auto animate-bounce" />
                <p className="text-slate-400 text-sm font-semibold">Sem localização mapeada exata.</p>
                <p className="text-xs text-slate-500 font-mono">Localização Geral: {activeMapProp.province} • {activeMapProp.location}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="text-xs text-slate-400 font-mono">
              Ponto GPS Georreferenciado • Direcione o seu percurso de navegação directamente ao imóvel.
            </div>

            <button
              onClick={() => {
                setActiveMapProp(null);
                setSchedulingTarget(activeMapProp);
              }}
              className="bg-[#d4af37] text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition"
            >
              Agendar Visita Física 📅
            </button>
          </div>
        </div>
      )}

      {/* 4. EMAIL ALERTS FOR PRICE DROPS / STATUS CHANGES ON SPECIFIC PROPERTIES */}
      {subscribingProperty && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-55 text-left font-sans" id="property-subscription-modal">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#aa771c]/5 rounded-full blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37]">
                  <Bell className="w-5 h-5 fill-[#d4af37]/20" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white font-display uppercase tracking-tight">Alertas de Imóvel</h3>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Grupo Edson Imobiliária</span>
                </div>
              </div>
              <button 
                onClick={() => setSubscribingProperty(null)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full p-1.5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {alertSuccess ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#d4af37] uppercase font-mono">Subscrição Ativa!</h4>
                  <p className="text-xs text-slate-300 px-2 leading-relaxed">
                    Registou o e-mail <strong className="font-mono text-white text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">{alertEmail}</strong> para receber alertas de <span className="font-bold text-[#d4af37]">{alertType === 'both' ? 'Preço e Estado' : alertType === 'price' ? 'Redução de Preço' : 'Mudança de Estado'}</span> no imóvel:
                  </p>
                  <p className="font-bold text-xs text-white bg-slate-950/40 p-2.5 rounded-xl border border-white/5 mt-2 font-mono">
                    {subscribingProperty.title}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubscribingProperty(null);
                      setAlertSuccess(false);
                    }}
                    className="w-full bg-[#d4af37] hover:bg-yellow-500 text-slate-900 font-extrabold text-xs py-2.5 rounded-xl transition"
                  >
                    Estupendo, Obrigado!
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!alertEmail) return;
                  
                  // Add alert subscription if not already registered
                  const exists = alertSubscriptions.some(sub => sub.propertyId === subscribingProperty.id && sub.email === alertEmail);
                  if (!exists) {
                    setAlertSubscriptions(prev => [...prev, {
                      propertyId: subscribingProperty.id,
                      email: alertEmail,
                      type: alertType
                    }]);
                  }
                  setAlertSuccess(true);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                    <img src={subscribingProperty.image} alt={subscribingProperty.title} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">{subscribingProperty.province} • {subscribingProperty.location}</span>
                      <h4 className="font-bold text-xs text-white truncate">{subscribingProperty.title}</h4>
                      <p className="text-[10px] font-bold text-[#d4af37] font-mono">{subscribingProperty.price.toLocaleString('pt-MZ')} MZN</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-justify text-slate-300 leading-normal">
                    Seja notificado no minuto exato em que este imóvel sofrer uma redução de preço de mercado ou for alterado o seu estado de disponibilidade.
                  </p>
                </div>

                {/* Email inputs */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-[#d4af37] uppercase font-bold tracking-wider">Seu Endereço de Email:</label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#d4af37] font-mono shadow-inner"
                  />
                </div>

                {/* Choices checkbox or radio option */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-[#d4af37] uppercase font-bold tracking-wider">Tipo de Alertas Desejados:</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-left ${alertType === 'both' ? 'bg-[#d4af37]/15 border-[#d4af37] text-white' : 'bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-950/60'}`}>
                      <input 
                        type="radio" 
                        name="alertType" 
                        checked={alertType === 'both'} 
                        onChange={() => setAlertType('both')} 
                        className="accent-[#d4af37]"
                      />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold">Ambos os Eventos</span>
                        <span className="block text-[9px] text-gray-400">Receber redução de preço e status do imóvel</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-left ${alertType === 'price' ? 'bg-[#d4af37]/15 border-[#d4af37] text-white' : 'bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-950/60'}`}>
                      <input 
                        type="radio" 
                        name="alertType" 
                        checked={alertType === 'price'} 
                        onChange={() => setAlertType('price')} 
                        className="accent-[#d4af37]"
                      />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold">Redução de Preço Só</span>
                        <span className="block text-[9px] text-gray-400">Receber alertas de queda de preço para negociação rápida</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-left ${alertType === 'status' ? 'bg-[#d4af37]/15 border-[#d4af37] text-white' : 'bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-950/60'}`}>
                      <input 
                        type="radio" 
                        name="alertType" 
                        checked={alertType === 'status'} 
                        onChange={() => setAlertType('status')} 
                        className="accent-[#d4af37]"
                      />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold">Mudanças de Estado Só</span>
                        <span className="block text-[9px] text-gray-400">Receber status de reserva, venda ou indisponibilidade</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-yellow-500 text-slate-900 font-extrabold text-xs py-2.5 rounded-xl transition font-mono uppercase tracking-wider"
                >
                  Activar Alertas de Imóvel 🔔
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. ON-SPOT VISITS SCHEDULER WIDGET OVERLAY */}
      {schedulingTarget && (
        <ScheduleModal
          property={schedulingTarget}
          onClose={() => setSchedulingTarget(null)}
          onConfirmSchedule={(data) => {
            onConfirmSchedule(data);
            setSchedulingTarget(null);
          }}
        />
      )}

      {/* FOOTER PORTION */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-left" id="agency-footer">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              “Realizamos o sonho da casa própria e conectamos investidores às melhores oportunidades imobiliárias em todo o território de Moçambique.”
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Registada no Conselho Predial sob o Nº 9021/2026.
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-[#aa771c] text-xs uppercase tracking-wider">Atalhos de Portfólio</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600">
              <button onClick={() => { setActiveTab('imoveis'); setPurposeFilter('Venda'); }} className="text-left hover:text-[#aa771c] transition">Venda de Casas & Vivendas</button>
              <button onClick={() => { setActiveTab('imoveis'); setPurposeFilter('Arrendamento'); }} className="text-left hover:text-[#aa771c] transition">Apartamentos para Alugar</button>
              <button onClick={() => { setActiveTab('imoveis'); setPurposeFilter('Terrenos'); }} className="text-left hover:text-[#aa771c] transition">Terrenos e DUAT em Matola</button>
              <button onClick={() => handleNavClick('blog')} className="text-left hover:text-[#aa771c] transition">Guias de Aquisição Legal</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-[#aa771c] text-xs uppercase tracking-wider">Investimento Seguro</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600">
              <button onClick={() => handleNavClick('anuncie')} className="text-left hover:text-[#aa771c] transition">Anuncie Seu Imóvel Gratuitamente</button>
              <button onClick={() => handleNavClick('sobre')} className="text-left hover:text-[#aa771c] transition">A Nossa História & Visão</button>
              <button onClick={() => handleNavClick('contactos')} className="text-left hover:text-[#aa771c] transition">Canais de Atendimento Municipal</button>
            </div>
          </div>

          {/* Newsletter email intake */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-[#aa771c] text-xs uppercase tracking-wider">Boletim Informativo de Imóveis</h4>
            <p className="text-xs text-slate-600 leading-normal">
              Inscreva-se para receber novos terrenos em vanguarda e vivendas raras na Sommerschield diretamente no e-mail:
            </p>

            {isSubscribedNewsletter ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 text-xs font-semibold">
                ✓ E-mail registado na Newsletter com sucesso!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-yellow-500 text-slate-900 font-extrabold text-xs px-3 rounded-xl transition"
                >
                  Registar
                </button>
              </form>
            )}
            
            {/* Social icons integration asked */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" className="text-slate-500 hover:text-[#aa771c] transition"><Facebook className="w-4 h-4" /></a>
              <a href="https://instagram.com" target="_blank" className="text-slate-500 hover:text-[#aa771c] transition"><Instagram className="w-4 h-4" /></a>
              <a href="https://linkedin.com" target="_blank" className="text-slate-500 hover:text-[#aa771c] transition"><Linkedin className="w-4 h-4" title="Linkedin Grupo Edson" /></a>
              <span className="text-[10px] text-slate-400 font-mono">/grupoedson.imobiliaria</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-mono">
          GRUPO EDSON IMOBILIÁRIA MOÇAMBIQUE • MAPUTO, MATOLA & ADJACENTES • 2026 GENERAL PLATFORM
        </div>
      </footer>

    </div>
  );
}
