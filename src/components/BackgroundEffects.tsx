/**
 * @file BackgroundEffects.tsx
 * @description Atmospheric background effects for the Obsidian Lantern theme.
 */

import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      <div className="bg-noise" />
      
      {/* Light Trails - SVG Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <line x1="-10%" y1="60%" x2="110%" y2="60%" stroke="var(--color-primary)" strokeWidth="1" className="animate-trail" />
        <line x1="-20%" y1="75%" x2="120%" y2="75%" stroke="var(--color-primary)" strokeWidth="0.5" className="animate-trail [animation-delay:-5s]" />
        <line x1="30%" y1="-10%" x2="30%" y2="110%" stroke="var(--color-primary)" strokeWidth="0.5" className="animate-trail [animation-delay:-10s]" />
        
        {/* Diagonal trails */}
        <line x1="-10%" y1="20%" x2="120%" y2="90%" stroke="var(--color-primary)" strokeWidth="0.5" className="animate-trail [animation-delay:-3s]" />
        <line x1="-10%" y1="80%" x2="120%" y2="10%" stroke="var(--color-primary)" strokeWidth="0.5" className="animate-trail [animation-delay:-7s]" />
      </svg>

      {/* City Skyline Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-full fill-on-surface">
          <rect x="0" y="150" width="80" height="150" />
          <rect x="90" y="100" width="60" height="200" />
          <rect x="160" y="180" width="100" height="120" />
          <rect x="270" y="50" width="50" height="250" />
          <rect x="330" y="120" width="90" height="180" />
          <rect x="430" y="170" width="110" height="130" />
          <rect x="550" y="80" width="40" height="220" />
          <rect x="600" y="140" width="70" height="160" />
          <rect x="680" y="40" width="60" height="260" />
          <rect x="750" y="110" width="80" height="190" />
          <rect x="840" y="190" width="120" height="110" />
          <rect x="970" y="70" width="50" height="230" />
          <rect x="1030" y="130" width="70" height="170" />
          <rect x="1110" y="160" width="90" height="140" />
          
          {/* Subtle windows with staggered flicker */}
          <g fill="var(--color-primary)">
            <rect x="20" y="180" width="10" height="10" className="animate-window-flicker" />
            <rect x="40" y="180" width="10" height="10" className="animate-window-flicker [animation-delay:-2s]" />
            <rect x="110" y="120" width="8" height="8" className="animate-window-flicker [animation-delay:-5s]" />
            <rect x="290" y="70" width="12" height="12" className="animate-window-flicker [animation-delay:-1s]" />
            <rect x="620" y="160" width="10" height="10" className="animate-window-flicker [animation-delay:-6s]" />
            <rect x="700" y="60" width="8" height="8" className="animate-window-flicker [animation-delay:-3s]" />
            <rect x="1050" y="150" width="10" height="10" className="animate-window-flicker [animation-delay:-7s]" />
          </g>
        </svg>
      </div>
    </div>
  );
};
