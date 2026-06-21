/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { compressImage } from '../lib/image-utils';
import { safeStorage } from '../lib/storage';
import { 
  Plus, 
  Trash2, 
  Check, 
  X as XIcon, 
  FileText, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Home, 
  CheckCircle, 
  Tag,
  Star,
  Layers,
  Lock,
  Unlock,
  Users,
  Eye,
  AlertTriangle,
  ArrowRight,
  BedDouble,
  Waves
} from 'lucide-react';
import { Property, CaptureProperty, VisitSchedule, PropertyStatus } from '../types';

interface AdminDashboardProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  removeProperty: (id: string) => void;
  capturedList: CaptureProperty[];
  setCapturedList: React.Dispatch<React.SetStateAction<CaptureProperty[]>>;
  scheduledVisits: VisitSchedule[];
  setScheduledVisits: React.Dispatch<React.SetStateAction<VisitSchedule[]>>;
  onGoBack: () => void;
}

export default function AdminDashboard({
  properties,
  setProperties,
  removeProperty,
  capturedList,
  setCapturedList,
  scheduledVisits,
  setScheduledVisits,
  onGoBack
}: AdminDashboardProps) {
  // Authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Media Gallery State
  const [galleryItems, setGalleryItems] = useState<Array<{ id: string; type: 'image' | 'video'; url: string; name: string }>>(() => {
    const items: Array<{ id: string; type: 'image' | 'video'; url: string; name: string }> = [];
    
    // Add unique properties images
    properties.forEach((p, idx) => {
      if (p.image && !items.some(x => x.url === p.image)) {
        items.push({
          id: `prop-img-${p.id || idx}`,
          type: 'image',
          url: p.image,
          name: `Foto: ${p.title.split('-')[0].trim()}`
        });
      }
      if (p.videoUrl && !items.some(x => x.url === p.videoUrl)) {
        items.push({
          id: `prop-vid-${p.id || idx}`,
          type: 'video',
          url: p.videoUrl,
          name: `Vídeo: ${p.title.split('-')[0].trim()}`
        });
      }
    });

    // Check localStorage for custom uploaded gallery items
    const saved = safeStorage.get<any[]>('prs_gallery_media', []);
    if (saved.length > 0) {
      saved.forEach((savedItem: any) => {
        if (!items.some(x => x.url === savedItem.url)) {
          items.push(savedItem);
        }
      });
    }
    return items;
  });

  useEffect(() => {
    // Save only custom-added items which do not start with prop-img or prop-vid
    const customItems = galleryItems.filter(item => !item.id.startsWith('prop-img-') && !item.id.startsWith('prop-vid-'));
    safeStorage.set('prs_gallery_media', customItems);
  }, [galleryItems]);

  const handleUploadToGallery = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'image') {
        try {
          const base64 = await compressImage(file, 1000, 750, 0.5);
          const newItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: fileType,
            url: base64,
            name: file.name
          };
          setGalleryItems(prev => [newItem, ...prev]);
        } catch (err) {
          console.error("Error compressing image", err);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: fileType,
            url: reader.result as string,
            name: file.name
          };
          setGalleryItems(prev => [newItem, ...prev]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFromGallery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  // Dashboard state tabs: 'geral' | 'imoveis' | 'mensagens' | 'visitas'
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'imoveis' | 'capturacoes' | 'visitas'>('geral');

  // Form state for creating a new property listing
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProp, setNewProp] = useState<{
    title: string;
    description: string;
    price: string;
    purpose: Property['purpose'];
    type: Property['type'];
    location: string;
    province: Property['province'];
    bedrooms: string;
    bathrooms: string;
    area: string;
    image: string;
    videoUrl?: string;
    googleMapUrl?: string;
    isFeatured: boolean;
    features: string;
    ownerContact: string;
    status: PropertyStatus;
  }>({
    title: '',
    description: '',
    price: '',
    purpose: 'Venda',
    type: 'Vivenda',
    location: '',
    province: 'Maputo Cidade',
    bedrooms: '3',
    bathrooms: '2',
    area: '250',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    videoUrl: '',
    googleMapUrl: '',
    isFeatured: true,
    features: 'Piscina, Segurança 24h, Garagem, Climatizado, Jardim',
    ownerContact: '',
    status: 'Disponível'
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '090090') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Palavra-passe inválida. Introduza o código privado de acesso para entrar.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
  };

  // Switch features state of key listings
  const toggleFeatured = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  // Change single listing price
  const updatePrice = (id: string, newPriceText: string) => {
    const val = parseFloat(newPriceText.replace(/\D/g, ''));
    if (!isNaN(val)) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, price: val } : p));
    }
  };

  // Change single listing status
  const updateStatus = (id: string, newStatus: PropertyStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  // Manage visist schedule statuses
  const updateVisitStatus = (id: string, status: VisitSchedule['status']) => {
    setScheduledVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  // Delete visit schedule
  const deleteVisitSchedule = (id: string) => {
    setScheduledVisits(prev => prev.filter(v => v.id !== id));
  };

  // Handle CaptureProperty approval flow
  const handleApproveCapture = (capture: CaptureProperty) => {
    // 1. Convert CaptureProperty to Property format
    const newProperty: Property = {
      id: capture.id, // KEEP CONSISTENT ID
      title: capture.title,
      description: capture.description,
      price: capture.price,
      purpose: capture.purpose,
      type: capture.type,
      location: capture.location,
      province: capture.province,
      bedrooms: capture.bedrooms || 3,
      bathrooms: 2,
      area: capture.area,
      image: capture.imageFiles[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
      isFeatured: false,
      isNew: true,
      features: ['Regularizado', 'DUAT Verificado', 'Água & Luz', 'Quintal Vedado', 'Aprovado pelo Gestor'],
      ownerContact: capture.ownerContact
    };

    // 2. Add or update in listings (avoid duplicates)
    setProperties(prev => {
      const existingIdx = prev.findIndex(p => p.id === capture.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newProperty;
        return next;
      }
      return [newProperty, ...prev];
    });

    // 3. Mark capture status as Published/Aprovado
    setCapturedList(prev => prev.map(c => c.id === capture.id ? { ...c, status: 'Publicado' } : c));
    setSuccessMsg(`Sucesso! O anúncio "${capture.title}" foi aprovado e agora está ativo no catálogo oficial.`);
  };

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clear success message after 4s
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Reject / mark review capture property
  const handleRejectCapture = (id: string) => {
    setCapturedList(prev => prev.map(c => c.id === id ? { ...c, status: 'Revisão' } : c));
  };

  // Submit completely new property via form
  const handleAddPropertySubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const featuresList = newProp.features.split(',').map(f => f.trim()).filter(Boolean);
     const parsedPrice = parseFloat(newProp.price) || 0;
     const parsedArea = parseFloat(newProp.area) || 100;
     const parsedBeds = parseInt(newProp.bedrooms) || 0;
     const parsedBaths = parseInt(newProp.bathrooms) || 0;

     const newlyCreated: Property = {
       id: 'prop-manual-' + Date.now(),
       title: newProp.title || 'Vivenda Clássica no Maputo',
       description: newProp.description || 'Excelente imóvel comercial/residencial.',
       price: parsedPrice,
       purpose: newProp.purpose,
       type: newProp.type,
       location: newProp.location || 'Bairro Somerschield',
       province: newProp.province,
       bedrooms: parsedBeds,
       bathrooms: parsedBaths,
       area: parsedArea,
       image: newProp.image,
       videoUrl: newProp.videoUrl,
       googleMapUrl: newProp.googleMapUrl,
       isFeatured: newProp.isFeatured,
       isNew: true,
       features: featuresList.length > 0 ? featuresList : ['Água de Furo', 'Climatizado'],
       ownerContact: newProp.ownerContact,
       status: newProp.status
     };

     setProperties(prev => [newlyCreated, ...prev]);
     setShowAddForm(false);
     
     // Reset form seeds
     setNewProp({
       title: '',
       description: '',
       price: '',
       purpose: 'Venda',
       type: 'Vivenda',
       location: '',
       province: 'Maputo Cidade',
       bedrooms: '3',
       bathrooms: '2',
       area: '250',
       image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
       videoUrl: '',
       googleMapUrl: '',
       isFeatured: true,
       features: 'Piscina, Segurança 24h, Garagem, Climatizado, Jardim',
       ownerContact: '',
       status: 'Disponível'
     });

     setSuccessMsg('Imóvel adicionado com sucesso ao catálogo principal!');
  };

  // Formatting currency helper
  const formatMZN = (val: number) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(val);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-slate-50" id="admin-login-screen">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#aa771c]"></div>
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-50 border border-[#d4af37]/35 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#aa771c]" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">ACESSO PRIVADO</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[280px] mx-auto">
              Painel restrito para gestão e publicação de ativos prediais do <span className="text-[#aa771c] font-semibold">Grupo Edson Imobiliária</span>.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5 font-bold text-left">Palavra-passe de Administrador:</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Introduza o código de acesso"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-mono text-slate-950 text-center focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40 transition"
              />
            </div>

            {authError && (
              <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 py-2 px-3 rounded-xl text-center flex items-center gap-2 justify-center font-mono animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition shadow-md"
            >
              Entrar no Painel Seguro 🔐
            </button>
          </form>

          <button
            onClick={onGoBack}
            className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-widest"
          >
            <ArrowRight className="w-3 h-3 rotate-180" />
            Voltar para o Início
          </button>

          <p className="text-[10px] text-center text-slate-400 mt-6 font-mono">
            Acesso restrito e encriptado para a equipa Grupo Edson.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950/30 min-h-[85vh] py-12 px-4" id="admin-interactive-dashboard">
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 bg-emerald-500 text-slate-900 font-extrabold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400"
          >
            <CheckSquare className="w-5 h-5 text-slate-900" />
            <span className="text-xs uppercase tracking-wider">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner header control panel */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2.5 py-0.5 rounded-md font-bold">Acesso Autenticado</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 uppercase font-display tracking-tight">Painel de Gestão e Administração</h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Bem-vindo ao centro administrativo do <span className="text-[#d4af37] font-semibold">Grupo Edson Real Estate</span>. Faça o controlo de agendamentos, verifique as submissões de terrenos e administre o catálogo imobiliário de luxo.
            </p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                handleAdminLogout();
                onGoBack();
              }}
              className="py-2.5 px-4 bg-white/10 border border-[#d4af37]/30 hover:bg-[#d4af37]/20 text-[#d4af37] hover:text-white text-xs font-bold rounded-xl transition flex-1 sm:flex-none uppercase tracking-wider flex items-center gap-2"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Voltar ao Site
            </button>
            <button
              onClick={handleAdminLogout}
              className="py-2.5 px-4 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 hover:text-white text-xs font-bold rounded-xl transition flex-1 sm:flex-none uppercase tracking-wider"
            >
              Terminar Sessão
            </button>
          </div>
        </div>

        {/* Dynamic Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block font-bold">Catálogo Público</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{properties.length}</span>
              <div className="p-2.5 bg-sky-500/10 rounded-xl">
                <Home className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 block mt-2 font-mono">Imóveis activos e terrenos</span>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block font-bold">Pedidos de Visita</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{scheduledVisits.length}</span>
              <div className="p-2.5 bg-amber-500/10 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 block mt-2 font-mono">
              {scheduledVisits.filter(v => v.status === 'Pendente').length} visitas pendentes
            </span>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block font-bold">Captações (Proprietários)</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#d4af37] font-mono">{capturedList.length}</span>
              <div className="p-2.5 bg-yellow-500/10 rounded-xl">
                <FileText className="w-5 h-5 text-[#d4af37]" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 block mt-2 font-mono">
              {capturedList.filter(c => c.status === 'Revisão').length} aguardando DUAT
            </span>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block font-bold">Visitas Confirmadas</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {scheduledVisits.filter(v => v.status === 'Confirmada').length}
              </span>
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 block mt-2 font-mono">Agendadas c/ Consultores</span>
          </div>
        </div>

        {/* Sections layout with sub-menu switcher */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
          {[
            { id: 'geral', label: 'Painel Geral & Visitas', icon: Calendar },
            { id: 'imoveis', label: 'Gerir Catálogo Público', icon: Home },
            { id: 'capturacoes', label: 'Captações de Proprietários', icon: FileText }
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 uppercase tracking-wider ${
                  isActive 
                    ? 'bg-[#d4af37] text-slate-950 font-black shadow-lg shadow-yellow-500/5' 
                    : 'bg-white/5 border border-white/2 hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{sub.label}</span>
                {sub.id === 'capturacoes' && capturedList.filter(c => c.status === 'Revisão').length > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce -mr-1">
                    {capturedList.filter(c => c.status === 'Revisão').length}
                  </span>
                )}
                {sub.id === 'geral' && scheduledVisits.filter(v => v.status === 'Pendente').length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse -mr-1">
                    {scheduledVisits.filter(v => v.status === 'Pendente').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUBTAB 1: GERAL & VISITAS */}
        {activeSubTab === 'geral' && (
          <div className="grid grid-cols-1 gap-6">
            
            {/* Scheduled Visists Management Panel */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-2">
                    <Calendar className="w-5.5 h-5.5 text-[#d4af37]" /> Log Central de Agendamentos Físicos
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Veja todas as visitas requisitadas por clientes no site e mude o status para agendado ou cancelado.</p>
                </div>
              </div>

              {scheduledVisits.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
                  <table className="w-full text-xs font-mono text-gray-300 min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-950/80 text-[10px] text-gray-500 text-left border-b border-white/5 uppercase tracking-wider font-bold">
                        <th className="p-4 rounded-tl-xl">Ticket ID / Imóvel</th>
                        <th className="p-4">Interessado (Cliente)</th>
                        <th className="p-4">Contacto / Email</th>
                        <th className="p-4">Data Planeada</th>
                        <th className="p-4">Situação atual</th>
                        <th className="p-4 text-center rounded-tr-xl">Ações da Agência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {scheduledVisits.map((v) => (
                        <tr key={v.id} className="hover:bg-white/2 transition">
                          <td className="p-4">
                            <span className="text-[11px] font-bold text-amber-400 block uppercase">{v.id}</span>
                            <span className="text-xs font-sans font-medium text-gray-100 max-w-[140px] truncate block">{v.propertyName}</span>
                          </td>
                          <td className="p-4 font-sans">
                            <span className="font-semibold block text-white">{v.clientName}</span>
                            {v.message && <span className="block text-[10px] text-gray-500 italic mt-0.5 truncate max-w-[200px]" title={v.message}>" {v.message} "</span>}
                          </td>
                          <td className="p-4">
                            <span className="block text-gray-300 font-bold">{v.clientPhone}</span>
                            <span className="block text-gray-500 text-[10px]">{v.clientEmail}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-white block font-sans font-bold">{v.date}</span>
                            <span className="text-gray-500 text-[10px] block">{v.time}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold border ${
                              v.status === 'Confirmada'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                : v.status === 'Cancelada'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/10'
                            }`}>
                              ● {v.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => updateVisitStatus(v.id, 'Confirmada')}
                                className="p-1 px-2.5 bg-emerald-500/10 text-emerald-400 hover:text-white hover:bg-emerald-500 rounded text-[10px] font-bold transition flex items-center gap-1"
                                title="Confirmar Visita"
                              >
                                <Check className="w-3 h-3" /> Confirmar
                              </button>
                              <button
                                onClick={() => updateVisitStatus(v.id, 'Cancelada')}
                                className="p-1 px-2.5 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 rounded text-[10px] font-bold transition flex items-center gap-1"
                                title="Cancelar Agendamento"
                              >
                                <XIcon className="w-3 h-3" /> Cancelar
                              </button>
                              <button
                                onClick={() => deleteVisitSchedule(v.id)}
                                className="p-1.5 bg-white/5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                                title="Eliminar Registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 text-gray-500 text-xs">
                  Ainda não existem agendamentos de visita física registados na plataforma.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: GERIR CATÁLOGO PÚBLICO */}
        {activeSubTab === 'imoveis' && (
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-2">
                  <Home className="w-5.5 h-5.5 text-[#d4af37]" /> Catálogo Ativo do Grupo Edson Imobiliária
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Adicione vivendas, mude preços sob negociação, defina destaques e expanda a carteira pública.</p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-950 font-extrabold text-xs rounded-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Anunciar Novo Imóvel Manual</span>
              </button>
            </div>

            {/* EXPANDABLE INLINE NEW PROPERTY FORM */}
            {showAddForm && (
              <form onSubmit={handleAddPropertySubmit} className="bg-slate-950/60 border border-white/10 rounded-2xl p-6 space-y-4 animate-fade-in relative">
                <div className="absolute top-4 right-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="p-1 px-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
                  >
                    <XIcon className="w-3.5 h-3.5" /> Fechar
                  </button>
                </div>
                
                <h3 className="text-sm font-bold text-white uppercase tracking-widest text-amber-400 border-b border-white/5 pb-2">Cadastrar Ficha do Imóvel para Moçambique</h3>
                
                <div className="space-y-6">
                  {/* PRIORIDADE 1: MÉDIA (IMAGENS E VÍDEOS) */}
                  <div className="bg-slate-900/80 border-2 border-[#d4af37]/30 rounded-2xl p-6 space-y-4 shadow-xl shadow-amber-950/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                      <div>
                        <h4 className="text-base font-black text-[#d4af37] uppercase font-display tracking-tight flex items-center gap-2">
                          <span>🚀 PRIORIDADE: Fotos & Vídeos de Destaque</span>
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 italic">A primeira coisa a fazer: Carregue o visual do imóvel para captar atenção.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <label className="bg-[#d4af37] hover:bg-yellow-500 text-slate-900 font-extrabold text-[11px] uppercase font-mono px-4 py-2 rounded-xl cursor-pointer transition shadow-lg shadow-yellow-500/20 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Enviar Foto 📸
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadToGallery(e, 'image')}
                            className="hidden"
                          />
                        </label>
                        <label className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] uppercase font-mono px-4 py-2 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                          <Waves className="w-4 h-4" /> Enviar Vídeo 🎥
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleUploadToGallery(e, 'video')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-white/10">
                          <div className="space-y-2">
                            <span className="block text-[10px] font-mono text-[#d4af37] uppercase tracking-widest font-bold">Foto Principal:</span>
                            {newProp.image ? (
                              <div className="relative group">
                                <img src={newProp.image} alt="Main" className="w-full h-32 rounded-xl object-cover border-2 border-[#d4af37]" />
                                <button
                                  type="button"
                                  onClick={() => setNewProp(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="h-32 bg-slate-900 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-center p-4">
                                <span className="text-[10px] text-gray-500 font-mono italic">Seleccione da lista ao lado.</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <span className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Vídeo de Visita:</span>
                            {newProp.videoUrl ? (
                              <div className="relative group">
                                <div className="w-full h-32 bg-emerald-500/10 rounded-xl border-2 border-emerald-500/50 flex flex-col items-center justify-center text-center">
                                  <Waves className="w-8 h-8 text-emerald-400 mb-2" />
                                  <span className="text-[10px] text-white font-bold px-2 truncate w-full">Vídeo HD Vinculado</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setNewProp(prev => ({ ...prev, videoUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="h-32 bg-slate-900 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-center p-4">
                                <span className="text-[10px] text-gray-500 font-mono italic">Seleccione o vídeo abaixo.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 space-y-3">
                        <span className="block text-[10px] uppercase font-mono font-bold text-[#d4af37] tracking-widest">Base de Dados de Média (Clique para Vincular):</span>
                        {galleryItems.length === 0 ? (
                          <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-lg bg-slate-900/50 text-gray-500 text-[10px] italic">
                            Sem média carregada. Use os botões acima ＋
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                            {galleryItems.map((item) => {
                              const isUsingImage = newProp.image === item.url;
                              const isUsingVideo = newProp.videoUrl === item.url;
                              return (
                                <div key={item.id} className="relative group flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (item.type === 'image') setNewProp(prev => ({ ...prev, image: item.url }));
                                      else setNewProp(prev => ({ ...prev, videoUrl: item.url }));
                                    }}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition relative ${
                                      isUsingImage ? 'border-[#d4af37]' : isUsingVideo ? 'border-emerald-500' : 'border-white/5'
                                    }`}
                                  >
                                    {item.type === 'image' ? (
                                      <img src={item.url} alt="G" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-slate-800 flex items-center justify-center italic text-[8px] text-emerald-400 font-bold">V</div>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveFromGallery(item.id, e)}
                                    className="text-[7px] text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded p-0.5"
                                  >
                                    Apagar
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RESTO DO FORMULÁRIO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* INFO FINANCEIRA */}
                    <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                      <span className="text-[10px] font-mono text-amber-400 font-black uppercase block tracking-tighter mb-2">💰 Informação Financeira & Básicos</span>
                      
                      <div className="space-y-1.5 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                        <label className="block text-[10px] font-mono text-[#d4af37] uppercase font-black tracking-widest">Preço de Venda/Aluguer (MZN):</label>
                        <input
                          type="number"
                          required
                          placeholder="Ex: 14500000"
                          value={newProp.price}
                          onChange={(e) => setNewProp({...newProp, price: e.target.value})}
                          className="w-full bg-slate-900 border-2 border-[#d4af37]/40 rounded-xl py-3 px-4 text-base text-white focus:border-[#d4af37] focus:outline-none font-mono transition shadow-lg"
                        />
                        <p className="text-xs text-white font-mono font-bold mt-1 text-right">
                          {newProp.price ? parseInt(newProp.price).toLocaleString('pt-MZ') : '0'} MZN
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Título Comercial:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Vivenda Duplex Luxo Sommerschield"
                          value={newProp.title}
                          onChange={(e) => setNewProp({...newProp, title: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white uppercase focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Tipo:</label>
                        <select
                          value={newProp.type}
                          onChange={(e) => setNewProp({...newProp, type: e.target.value as any})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Vivenda">Vivenda</option>
                          <option value="Casa">Casa</option>
                          <option value="Apartamento">Apartamento</option>
                          <option value="Terreno">Terreno</option>
                          <option value="Escritório">Escritório</option>
                          <option value="Armazém">Armazém</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Finalidade:</label>
                        <select
                          value={newProp.purpose}
                          onChange={(e) => setNewProp({...newProp, purpose: e.target.value as any})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Venda">Venda</option>
                          <option value="Arrendamento">Aluguer</option>
                          <option value="Terrenos">Terreno</option>
                          <option value="Comercial">Comercial</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Contacto de Angariação (Proprietário/Gestor):</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: +258 84 000 0000"
                        value={newProp.ownerContact}
                        onChange={(e) => setNewProp({...newProp, ownerContact: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono focus:ring-1 focus:ring-[#d4af37]/30 transition"
                      />
                    </div>
                  </div>

                  {/* LOCATION SECTION */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase block tracking-tighter mb-2">📍 Localização & Província</span>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Província:</label>
                      <select
                        value={newProp.province}
                        onChange={(e) => setNewProp({...newProp, province: e.target.value as any})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Maputo Cidade">Maputo Cidade</option>
                        <option value="Matola">Matola</option>
                        <option value="Maputo Província">Maputo Província</option>
                        <option value="Sofala">Sofala (Beira)</option>
                        <option value="Nampula">Nampula</option>
                        <option value="Cabo Delgado">Cabo Delgado</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Endereço Exato / Bairro:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Av. Julius Nyerere, Polana"
                        value={newProp.location}
                        onChange={(e) => setNewProp({...newProp, location: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Google Maps Embed URL (Opcional):</label>
                      <input
                        type="text"
                        placeholder="Cole o link do iFrame do Google Maps aqui"
                        value={newProp.googleMapUrl}
                        onChange={(e) => setNewProp({...newProp, googleMapUrl: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-[10px] text-gray-400 focus:border-[#d4af37] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* TECHNICAL SPECS */}
                  <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase block tracking-tighter mb-2">📐 Características Técnicas & Dimensões</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold italic">Km / Dimensões (m²):</label>
                        <input
                          type="number"
                          required
                          placeholder="Ex: 450"
                          value={newProp.area}
                          onChange={(e) => setNewProp({...newProp, area: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold">Estado do Imóvel:</label>
                        <select
                          value={newProp.status}
                          onChange={(e) => setNewProp({...newProp, status: e.target.value as any})}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Disponível">Livre / Disponível</option>
                          <option value="Reservado">Reservado</option>
                          <option value="Em Negociação">Negociando</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold text-emerald-400">Quartos / Dormitórios:</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Ex: 4"
                            value={newProp.bedrooms}
                            onChange={(e) => setNewProp({...newProp, bedrooms: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono pl-8"
                          />
                          <BedDouble className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold text-sky-400">Casas de Banho (WC):</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Ex: 3"
                            value={newProp.bathrooms}
                            onChange={(e) => setNewProp({...newProp, bathrooms: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono pl-8"
                          />
                          <Waves className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold italic">Comodidades (Separar por vírgula):</label>
                      <textarea
                        rows={2}
                        placeholder="Piscina, Estacionamento, Segurança 24h, Gerador..."
                        value={newProp.features}
                        onChange={(e) => setNewProp({...newProp, features: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-[10px] text-gray-300 focus:border-[#d4af37] focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <label className="block text-[10px] font-mono text-gray-500 uppercase font-bold italic">Descrição Completa e Diferenciais Jurídicos:</label>
                  <textarea
                    rows={3}
                    placeholder="Documentação DUAT em total conformidade jurídica. Quintal espaçoso..."
                    value={newProp.description}
                    onChange={(e) => setNewProp({...newProp, description: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={newProp.isFeatured}
                      onChange={(e) => setNewProp({...newProp, isFeatured: e.target.checked})}
                      className="accent-[#d4af37] w-4.5 h-4.5 bg-slate-900 border-white/10"
                    />
                    <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Destacar Imóvel na Página Inicial Golden Deck</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider hover:brightness-110 active:scale-95 transition shadow-lg mt-2"
                >
                  Confirmar Cadastro & Publicar Online 🚀
                </button>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
              <table className="w-full text-xs font-mono text-gray-300 min-w-[800px]">
                <thead>
                  <tr className="bg-slate-950/80 text-[10px] text-gray-500 text-left border-b border-white/5 uppercase tracking-wider font-bold">
                    <th className="p-4 rounded-tl-xl">Foto / Imóvel</th>
                    <th className="p-4">Tipo / Finalidade</th>
                    <th className="p-4">Localização / Província</th>
                    <th className="p-4">Preço Publicado (MZN)</th>
                    <th className="p-4 text-center">Estado / Status</th>
                    <th className="p-4 text-center">Destaque</th>
                    <th className="p-4 text-right rounded-tr-xl">Ação</th>
                  </tr>
                </thead>
                <motion.tbody 
                  className="divide-y divide-white/5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.04
                      }
                    }
                  }}
                >
                  {properties.map((p) => (
                    <motion.tr 
                      key={p.id} 
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { duration: 0.35, ease: "easeOut" }
                        }
                      }}
                      className="hover:bg-white/2 transition border-b border-white/5 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-950 shrink-0 border border-white/5"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-gray-100 block uppercase line-clamp-1 max-w-[170px]">{p.title}</span>
                            <span className="text-[10px] text-gray-500 block font-mono">{p.area} m² • {p.bedrooms || 0} Q • {p.bathrooms || 0} WC</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-sans font-bold uppercase text-[10px] block">{p.type}</span>
                        <span className="text-[10px] text-[#d4af37] block font-mono tracking-wider">{p.purpose}</span>
                      </td>
                      <td className="p-4 font-sans text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="truncate max-w-[140px]" title={p.location}>{p.location}</span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono block pl-4.5">{p.province}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 bg-slate-900 border border-white/5 px-2.5 py-1.5 rounded-lg w-[160px]">
                          <DollarSign className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <input
                            type="text"
                            defaultValue={p.price}
                            onBlur={(e) => updatePrice(p.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updatePrice(p.id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="bg-transparent text-white font-mono text-xs w-full focus:outline-none font-bold"
                          />
                        </div>
                        <span className="text-[9px] text-gray-500 block mt-1 font-sans">{formatMZN(p.price)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={p.status || 'Disponível'}
                          onChange={(e) => updateStatus(p.id, e.target.value as PropertyStatus)}
                          className={`bg-slate-900 border text-[10px] font-mono rounded-lg px-2 py-1.5 focus:outline-none font-black uppercase ${
                            (p.status || 'Disponível') === 'Disponível'
                              ? 'text-emerald-400 border-emerald-500/20'
                              : (p.status || 'Disponível') === 'Reservado'
                              ? 'text-rose-400 border-rose-500/20'
                              : 'text-amber-400 border-amber-500/20'
                          }`}
                        >
                          <option value="Disponível" className="bg-slate-950 text-emerald-400 font-bold">🟢 Disponível</option>
                          <option value="Reservado" className="bg-slate-950 text-rose-400 font-bold">🔴 Reservado</option>
                          <option value="Em Negociação" className="bg-slate-950 text-amber-500 font-bold">🟡 Negociando</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`p-1.5 rounded-lg transition ${
                            p.isFeatured 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-white/5 hover:bg-white/10 text-gray-500'
                          }`}
                          title={p.isFeatured ? 'Remover Destaque' : 'Destaque na Home'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => removeProperty(p.id)}
                          className="p-2 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition"
                          title="Eliminar Permanente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>

          </div>
        )}

        {/* SUBTAB 3: ANÚNCIOS SUBMETIDOS POR PROPRIETÁRIOS */}
        {activeSubTab === 'capturacoes' && (
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div>
              <h2 className="text-xl font-bold font-display uppercase text-white flex items-center gap-2">
                <FileText className="w-5.5 h-5.5 text-[#d4af37]" /> Fichas de Captação e Anúncios de Clientes ({capturedList.length})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Anúncios de proprietários que submeteram o formulário de captação de imóvel online com os dados do DUAT.</p>
            </div>

            {capturedList.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
                <table className="w-full text-xs font-mono text-gray-300 min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-950/80 text-[10px] text-gray-500 text-left border-b border-white/5 uppercase tracking-wider font-bold">
                      <th className="p-4 rounded-tl-xl">Proprietário / Contacto</th>
                      <th className="p-4">Dados do Imóvel</th>
                      <th className="p-4">Localização & DUAT</th>
                      <th className="p-4">Preço Submetido</th>
                      <th className="p-4">Conformidade Jurídica</th>
                      <th className="p-4 text-right rounded-tr-xl">Ação do Delegado</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    className="divide-y divide-white/5"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 1 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.03
                        }
                      }
                    }}
                  >
                    {capturedList.map((c) => (
                      <motion.tr 
                        key={c.id} 
                        variants={{
                          hidden: { opacity: 0, x: -8 },
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { duration: 0.3 }
                          }
                        }}
                        className="hover:bg-white/2 transition"
                      >
                        <td className="p-4 bg-slate-900/10">
                          <span className="font-extrabold text-white block font-sans">{c.ownerName}</span>
                          <span className="text-[10px] text-[#d4af37] block font-mono font-bold mt-0.5">{c.ownerContact}</span>
                        </td>
                        <td className="p-4 font-sans">
                          <span className="font-bold text-gray-100 block uppercase line-clamp-1 max-w-[180px]">{c.title}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{c.type} • {c.area} m² • {c.bedrooms || 0} Quartos</span>
                          {c.description && <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate leading-relaxed">"{c.description}"</p>}
                        </td>
                        <td className="p-4 font-sans text-gray-300">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <span>{c.location}</span>
                          </div>
                          <span className="text-[9px] text-gray-500 block pl-4.5 font-mono">{c.province}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          {formatMZN(c.price)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold ${
                            c.status === 'Publicado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          }`}>
                            ● {c.status === 'Publicado' ? 'Duat Aprovado & Publicado' : 'Aguardando Verificação DUAT'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {c.status === 'Revisão' ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleApproveCapture(c)}
                                className="py-1 px-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-[10px] font-black rounded-lg transition active:scale-95 uppercase flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-slate-950" /> Aprovar & Publicar
                              </button>
                              <button
                                onClick={() => removeProperty(c.id)}
                                className="p-2 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition"
                                title="Eliminar Permanente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1.5 justify-end items-center">
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                                ✓ Ativo no Catálogo
                              </span>
                              <button
                                onClick={() => handleRejectCapture(c.id)}
                                className="p-1 px-2 bg-white/5 border border-white/5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-[9px] font-mono transition"
                                title="Reverter Aprovação"
                              >
                                Desativar / Revisar
                              </button>
                              <button
                                onClick={() => removeProperty(c.id)}
                                className="p-1.5 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition"
                                title="Excluir Permanente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 text-gray-500 text-xs">
                Nenhum proprietário submeteu formulários de venda ou veracidade de posse jurídica até ao momento.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
