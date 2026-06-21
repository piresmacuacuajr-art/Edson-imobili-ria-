/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, X, CheckSquare, Plus, Phone, Hammer, MapPin, DollarSign, Camera, FileText } from 'lucide-react';
import { compressImage } from '../lib/image-utils';
import { PropertyType, PropertyPurpose, MozambiqueProvince } from '../types';

interface CaptaFormProps {
  onAddCapturedProperty: (property: {
    ownerName: string;
    ownerContact: string;
    title: string;
    type: PropertyType;
    purpose: PropertyPurpose;
    province: MozambiqueProvince;
    location: string;
    price: number;
    area: number;
    description: string;
    imageFiles: string[];
  }) => void;
}

export default function CaptaForm({ onAddCapturedProperty }: CaptaFormProps) {
  // Local Form state
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Casa');
  const [purpose, setPurpose] = useState<PropertyPurpose>('Venda');
  const [province, setProvince] = useState<MozambiqueProvince>('Maputo Cidade');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Handlers
  const handleFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          // Using smaller dimensions and lower quality for customer submittals to save space
          const base64 = await compressImage(file, 800, 600, 0.4);
          setImagePreviews((prev) => [...prev, base64]);
        } catch (err) {
          console.error("Error compressing image", err);
        }
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!ownerName || !ownerContact || !title || !location || !price || !area || !description) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios do formulário.');
      return;
    }

    const priceNum = parseFloat(price);
    const areaNum = parseFloat(area);

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Introduza um valor de comercialização válido.');
      return;
    }

    if (isNaN(areaNum) || areaNum <= 0) {
      setErrorMessage('Introduza uma área de lote/imóvel válida.');
      return;
    }

    // Default simulated picture if no pics uploaded
    const finalImages = imagePreviews.length > 0 
      ? imagePreviews 
      : ['https://picsum.photos/seed/submitted_property/800/600'];

    // Action execution
    onAddCapturedProperty({
      ownerName,
      ownerContact,
      title,
      type,
      purpose,
      province,
      location,
      price: priceNum,
      area: areaNum,
      description,
      imageFiles: finalImages
    });

    setIsSubmitted(true);
    
    // Reset Form fields
    setOwnerName('');
    setOwnerContact('');
    setTitle('');
    setLocation('');
    setPrice('');
    setArea('');
    setDescription('');
    setImagePreviews([]);
  };

  return (
    <div className="bg-slate-900 border border-[#d4af37]/20 rounded-2xl p-6 text-white text-left" id="ownership-capturing-form">
      {isSubmitted ? (
        <div className="text-center py-8 space-y-4 animate-scale-up">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-100">Anúncio Submetido com Sucesso!</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Obrigado por confiar no grupo <strong>Grupo Edson</strong>. A nossa equipa jurídica e gestores de expansão irão analisar os documentos anexados e entrar em contacto consigo nas próximas 24 horas.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#d4af37] text-slate-900 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition"
          >
            Anunciar Novo Imóvel
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-lg font-bold text-gray-100">Anuncie o seu Imóvel Gratuitamente</h3>
            <p className="text-xs text-gray-400 mt-1">Nós negociamos e encontramos o melhor investidor para si.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Proprietary Identification */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-wider block">1. Dados do Proprietário</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Introduza o seu nome"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Contacto WhatsApp (+258) *</label>
                <input
                  type="tel"
                  placeholder="Ex: 849584300"
                  value={ownerContact}
                  onChange={(e) => setOwnerContact(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs font-mono focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Property Metrics */}
          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-wider block">2. Ficha do Imóvel</span>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Título do Anúncio *</label>
              <input
                type="text"
                placeholder="Ex: Vivenda T4 Moderna estilo rústico com anexo - Matola Rio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Tipo de Imóvel</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-2 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Vivenda">Vivenda</option>
                  <option value="Escritório">Escritório</option>
                  <option value="Armazém">Armazém</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Finalidade</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-2 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Venda">Venda</option>
                  <option value="Arrendamento">Arrendamento</option>
                  <option value="Terrenos">Terreno</option>
                  <option value="Comercial">Espaço Comercial</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Província</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as MozambiqueProvince)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-2 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Maputo Cidade">Maputo Cidade</option>
                  <option value="Matola">Matola Munique</option>
                  <option value="Maputo Província">Maputo Província</option>
                  <option value="Sofala">Sofala (Beira)</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Cabo Delgado">Cabo Delgado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Preço Sugerido (MZN) *</label>
                <input
                  type="number"
                  placeholder="Ex: 5000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs font-mono focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Localidade / Endereço Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Bairro Tchumene 2, Próximo à bomba da Total, Matola"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Área Total do Espaço (m²) *</label>
                <input
                  type="number"
                  placeholder="Ex: 800"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs font-mono focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Descrição Avançada & Documentação Existente *</label>
              <textarea
                rows={3}
                placeholder="Explicite detalhes do imóvel: Nº de suítes, se tem furo de água, vedação elétrica, se já possui DUAT definitivo e outras informações pertinentes."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl p-3 text-xs focus:border-[#d4af37] focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Professional Drag-and-drop File Upload */}
          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-wider block">3. Fotos Reais do Imóvel (Padrão e DragnDrop)</span>

            {/* Custom Interactive Dropzone Box */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                isDragActive 
                  ? 'border-[#d4af37] bg-[#d4af37]/5' 
                  : 'border-white/10 bg-slate-950/20 hover:border-white/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={onFileSelectChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-white/5 rounded-full text-gray-400">
                  <Upload className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200">Arraste fotos para aqui ou clique para selecionar</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Suporta formatos JPEG, PNG. Limite de 5MB por ficheiro.</p>
                </div>
              </div>
            </div>

            {/* Render uploaded image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden aspect-square border border-white/10 bg-slate-950">
                    <img
                      src={url}
                      alt="Uploaded Property Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-90 hover:scale-105 transition"
                    >
                      <X className="w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-extrabold py-3 rounded-lg hover:brightness-110 transition active:scale-95 text-xs shadow-lg"
          >
            Submeter Anúncio de Imóvel
          </button>
        </form>
      )}
    </div>
  );
}
