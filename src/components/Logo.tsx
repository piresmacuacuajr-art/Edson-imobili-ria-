/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ showText = true, className = '', variant = 'dark' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Golden House Swoosh Emblem similar to the Edson Business Card */}
      <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="gold-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bf953f" />
              <stop offset="30%" stopColor="#fcf6ba" />
              <stop offset="50%" stopColor="#b38728" />
              <stop offset="75%" stopColor="#fcf6ba" />
              <stop offset="100%" stopColor="#aa771c" />
            </linearGradient>
          </defs>
          
          {/* Main Roof Structure */}
          <path 
            d="M 50 16 L 85 45 L 79 50 L 50 25 L 21 50 L 21 45 Z" 
            fill="url(#gold-brand-grad)" 
          />
          
          {/* Left Vertical Wall Pillar */}
          <path 
            d="M 21 45 L 21 68" 
            fill="none" 
            stroke="url(#gold-brand-grad)" 
            strokeWidth="5.5" 
            strokeLinecap="round"
          />
          
          {/* 2x2 Grid Window */}
          <rect x="42" y="34" width="7" height="7" fill="url(#gold-brand-grad)" />
          <rect x="51" y="34" width="7" height="7" fill="url(#gold-brand-grad)" />
          <rect x="42" y="43" width="7" height="7" fill="url(#gold-brand-grad)" />
          <rect x="51" y="43" width="7" height="7" fill="url(#gold-brand-grad)" />
          
          {/* Sweeping Gold Dynamic Swoop representing growth and transactions */}
          <path 
            d="M 18 64 C 10 82, 32 94, 58 91 C 76 89, 86 79, 88 64" 
            fill="none" 
            stroke="url(#gold-brand-grad)" 
            strokeWidth="5.5" 
            strokeLinecap="round"
          />
          
          {/* Upwards-Right Arrowhead integrated onto the swoop */}
          <path 
            d="M 74 65 L 89 60 L 83 75 Z" 
            fill="url(#gold-brand-grad)" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center h-10">
          {/* Vertical Separator Line as seen in the business card logo */}
          <div className="h-full w-[1.5px] bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] opacity-80 mr-3"></div>
          
          <div className="flex flex-col justify-center leading-none">
            {/* "EDSON" brand text on white, or light grey if variant is dark background */}
            <span 
              className={`text-[19px] font-black tracking-[0.06em] font-sans uppercase -mb-0.5 ${
                variant === 'dark' ? 'text-white' : 'text-[#0a1128]'
              }`}
            >
              EDSON
            </span>
            <span className="text-[9px] font-bold tracking-[0.16em] text-[#d4af37] font-sans uppercase">
              REAL ESTATE GROUP
            </span>
            <span className="text-[5.5px] font-medium tracking-[0.11em] text-gray-400 font-mono uppercase mt-0.5 whitespace-nowrap">
              YOUR TRUSTED PROPERTY PARTNER
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
