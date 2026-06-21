/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Info, Search, HelpCircle } from 'lucide-react';
import { MozambiqueProvince } from '../types';

interface InteractiveMapProps {
  selectedProvince: MozambiqueProvince | 'Todas';
  onSelectProvince: (province: MozambiqueProvince | 'Todas') => void;
  propertyCountByProvince: Record<MozambiqueProvince, number>;
}

export default function InteractiveMap({
  selectedProvince,
  onSelectProvince,
  propertyCountByProvince
}: InteractiveMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Provinces metadata for interactive hotspots
  const hotspots = [
    {
      id: 'Maputo Cidade' as MozambiqueProvince,
      name: 'Maputo Cidade (Polana, Triunfo)',
      cx: 140,
      cy: 230,
      r: 16,
      color: 'bg-[#d4af37]',
      description: 'Capital do país com imóveis de alto padrão e forte valorização cambial.',
      coordsText: '25.9692° S, 32.5732° E'
    },
    {
      id: 'Matola' as MozambiqueProvince,
      name: 'Município da Matola (Tchumene)',
      cx: 100,
      cy: 210,
      r: 14,
      color: 'bg-amber-500',
      description: 'A maior zona residencial suburbana em expansão, excelente para moradias unifamiliares.',
      coordsText: '25.9622° S, 32.4589° E'
    },
    {
      id: 'Maputo Província' as MozambiqueProvince,
      name: 'Maputo Província (Marracuene, Beluluane)',
      cx: 120,
      cy: 160,
      r: 18,
      color: 'bg-yellow-600',
      description: 'Terrenos industriais estratégicos, quintas amplas e bairros verdes emergentes.',
      coordsText: '25.7500° S, 32.6833° E'
    },
    {
      id: 'Sofala' as MozambiqueProvince,
      name: 'Sofala (Cidade da Beira)',
      cx: 240,
      cy: 110,
      r: 12,
      color: 'bg-emerald-500',
      description: 'Zonas portuárias importantes, aeroportos e apartamentos na brisa marítima.',
      coordsText: '19.8431° S, 34.8389° E'
    },
    {
      id: 'Nampula' as MozambiqueProvince,
      name: 'Nampula (Capital do Norte)',
      cx: 320,
      cy: 70,
      r: 13,
      color: 'bg-sky-500',
      description: 'O maior polo de agronegócio e mineração no norte do país, terrenos de elevada rentabilidade.',
      coordsText: '15.1167° S, 39.2667° E'
    }
  ];

  return (
    <div className="bg-slate-900 border border-[#d4af37]/20 rounded-2xl p-5 text-white" id="interactive-mozambique-map">
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
        
        {/* SVG Interactive Graphic */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#d4af37]/10 text-[#d4af37]">
              <Navigation className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-200">Mapa de Distribuição Predial</h3>
              <p className="text-xs text-gray-400">Clique nas zonas de calor para filtrar os imóveis listados.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-white/5 relative flex items-center justify-center min-h-[300px]">
            {/* Visual SVG Map of Mozambique Coastline */}
            <svg 
              viewBox="0 0 400 300" 
              className="w-full max-w-[360px] h-auto overflow-visible select-none"
            >
              {/* Simplified Simulated Coastline of Maputo/Mozambique */}
              <path
                d="M 50,280 Q 80,260 110,240 T 150,220 T 190,190 T 230,130 T 260,110 T 310,70 T 360,30"
                fill="none"
                stroke="rgba(212,175,55,0.08)"
                strokeWidth={12}
                strokeLinecap="round"
              />
              <path
                d="M 50,280 Q 80,260 110,240 T 150,220 T 190,190 T 230,130 T 260,110 T 310,70 T 360,30"
                fill="none"
                stroke="rgba(212,175,55,0.2)"
                strokeWidth={2}
                strokeDasharray="4,4"
              />

              {/* Grid / ocean latitude markers */}
              <line x1={0} y1={75} x2={400} y2={75} stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
              <line x1={0} y1={150} x2={400} y2={150} stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
              <line x1={0} y1={225} x2={400} y2={225} stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
              <text x={395} y={145} textAnchor="end" fill="rgba(255,255,255,0.2)" className="text-[7px] font-mono">LAT-19°S (SOFALA)</text>
              <text x={395} y={220} textAnchor="end" fill="rgba(255,255,255,0.2)" className="text-[7px] font-mono">LAT-25°S (MAPUTO)</text>

              {/* Indian Ocean annotation */}
              <text x={260} y={180} fill="rgba(255,175,55,0.04)" className="text-[12px] font-bold font-display tracking-widest uppercase">Oceano ÍNDICO</text>

              {/* Hotspots Render */}
              {hotspots.map((spot) => {
                const isSelected = selectedProvince === spot.id;
                const isHovered = hoveredProvince === spot.id;
                return (
                  <g 
                    key={spot.id}
                    onClick={() => onSelectProvince(isSelected ? 'Todas' : spot.id)}
                    onMouseEnter={() => setHoveredProvince(spot.id)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Backlight */}
                    <circle
                      cx={spot.cx}
                      cy={spot.cy}
                      r={spot.r + (isHovered || isSelected ? 8 : 4)}
                      fill={isSelected ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.04)'}
                      className={isHovered ? 'animate-pulse' : ''}
                      stroke={isSelected ? '#d4af37' : '#ffffff'}
                      strokeOpacity={isSelected ? 0.8 : 0.1}
                      strokeWidth={1}
                      style={{ transition: 'all 0.2s' }}
                    />
                    
                    {/* Actual Core Node Dot */}
                    <circle
                      cx={spot.cx}
                      cy={spot.cy}
                      r={6}
                      fill={isSelected ? '#d4af37' : '#ffffff'}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                    />

                    {/* Short Text tag on map */}
                    <text
                      x={spot.cx + 12}
                      y={spot.cy + 3}
                      fill={isSelected ? '#d4af37' : '#e2e8f0'}
                      className="text-[9px] font-mono font-bold drop-shadow-md pointer-events-none select-none"
                    >
                      {spot.id === 'Maputo Cidade' ? 'Maputo (Cidade)' : spot.id === 'Maputo Província' ? 'Maputo Prov.' : spot.id} ({propertyCountByProvince[spot.id] || 0})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick Map Legend */}
            <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-white/5 py-1 px-2.2 rounded-md text-[8px] sm:text-[9px] font-mono text-gray-400 space-y-0.5 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                <span>Imóvel Selecionado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>Zonas de Oportunidades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Side Panel about selected region */}
        <div className="w-full md:w-64 bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-mono font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3 h-3 text-[#d4af37]" />
              Ficha Demográfica Regional
            </span>

            {/* If a province is selected as active filter */}
            {selectedProvince !== 'Todas' ? (
              (() => {
                const info = hotspots.find(h => h.id === selectedProvince);
                if (!info) return null;
                const count = propertyCountByProvince[selectedProvince] || 0;
                return (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <h4 className="font-bold text-sm text-[#d4af37]">{info.name}</h4>
                      <span className="text-[10px] text-gray-500 font-mono">{info.coordsText}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed text-justify">
                      {info.description}
                    </p>
                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Imóveis Disponíveis:</span>
                        <span className="font-bold font-mono text-emerald-400">{count} {count === 1 ? 'imóvel' : 'imóveis'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Nível de Procura:</span>
                        <span className="font-bold text-amber-300 font-mono">Muito Elevado</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="space-y-3 py-4 text-center">
                <MapPin className="w-7 h-7 text-[#d4af37]/40 mx-auto" />
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                  Selecione qualquer ponto informativo do mapa para ver detalhes socioeconómicos e ofertas.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={() => onSelectProvince('Todas')}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedProvince === 'Todas'
                  ? 'bg-white/5 text-gray-400 cursor-default'
                  : 'bg-[#d4af37] text-slate-900 hover:bg-yellow-500'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Limpar Filtro de Província
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
