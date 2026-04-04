/**
 * @file About.tsx
 * @description About section with application information.
 */

import React from 'react';
import { CONFIG } from '../constants/Config';

/**
 * About component.
 */
export const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-[1.75rem] font-medium tracking-tight text-on-surface">About {CONFIG.APP_NAME}</h2>
        <p className="text-on-surface-variant text-[0.75rem] font-medium uppercase tracking-[0.05em]">Application Info</p>
      </div>

      <div className="glass-panel p-6 space-y-8">
        <div className="space-y-4">
          <p className="text-[1rem] font-normal leading-relaxed text-on-surface-variant">
            <span className="text-primary-container font-semibold uppercase tracking-wider text-on-surface">Kagaz Kalam Hisab</span> is a premium, minimal expense tracker designed to simplify your daily financial logging.
          </p>
          <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
            This application is built for speed and simplicity, replacing complex Excel sheets with a streamlined interface optimized for a nocturnal, high-energy finance workflow.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Key Features</h3>
          <ul className="space-y-3">
            {[
              ['Local First', 'Your data stays on your device using browser localStorage.'],
              ['Quick Entry', 'Optimized categories and amount presets for rapid logging.'],
              ['Smart Filters', 'Search and filter by date or category with ease.'],
              ['Bulk Import', 'Easily import records via standardized JSON format.']
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3 items-start">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary shrink-0" />
                <div>
                  <span className="text-sm font-bold text-on-surface block">{title}</span>
                  <span className="text-xs text-on-surface-variant">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6 border-t border-outline/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-surface-container rounded-full border border-outline/20 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              v{CONFIG.VERSION}
            </div>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            <a href="https://github.com/nickpricks/kagaz-kalam-hisab" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Github</a>
            <a href="mailto:niteshkac+github@gmail.com?subject=Kagaz Kalam Hisab Feedback" className="hover:text-primary transition-colors italic">Feedback 📬</a>
          </div>
        </div>
      </div>
    </div>
  );
};
