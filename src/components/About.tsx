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
    <div className="view-about">
      <div className="view-header">
        <h2>About {CONFIG.APP_NAME}</h2>
      </div>
      <div className="card">
        <p>
          <strong>Kagaz Kalam Hisab</strong> is a premium, minimal expense tracker designed to simplify your daily financial logging.
        </p>
        <p>
          This application is built for speed and simplicity, replacing complex Excel sheets with a streamlined interface.
        </p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Local First</strong>: Your data stays on your device (browser localStorage).</li>
          <li><strong>Quick Entry</strong>: Optimized categories and amount presets for rapid logging.</li>
          <li><strong>Smart Filters</strong>: Search and filter by date or category.</li>
          <li><strong>Bulk Import</strong>: Easily import records via JSON format.</li>
        </ul>

        <h3>Technical Specs</h3>
        <ul>
          <li>Framework: React + TypeScript</li>
          <li>Build Tool: Vite</li>
          <li>Runtime: Bun</li>
          <li>Persistence: Web Storage API</li>
        </ul>

        <div className="version-tag">Version: 0.0.1</div>
        <div className="version-tag">
          Built with ❤️ by <a href="https://github.com/nickprics">Nick</a>
        </div>
        <div className="version-tag">
          Mail box <a href="mailto:nitesh+github@gmail.com?subject=Kagaz Kalam Hisab Feedback&body=Write your feedback here">📬</a>
        </div>
      </div>
    </div>
  );
};

export default About;
