/**
 * @file ErrorBoundary.tsx
 * @description Catches render errors and displays a recovery UI instead of a white screen.
 */

import React from 'react';
import { CONFIG } from '../constants/Config';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that wraps the app routes.
 * Offers retry, raw data copy, and full reset options.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleCopyData = () => {
    const raw = window.localStorage.getItem(CONFIG.STORAGE_KEYS.EXPENSES) || '[]';
    navigator.clipboard.writeText(raw);
  };

  handleReset = () => {
    if (window.confirm('This will delete all your expense data. Are you sure?')) {
      window.localStorage.removeItem(CONFIG.STORAGE_KEYS.EXPENSES);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="glass-panel p-8 max-w-md w-full space-y-6 text-center">
            {/* Dimmed lantern */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20 mx-auto">
              <rect x="24" y="8" width="16" height="4" rx="2" fill="var(--color-on-surface)" />
              <rect x="28" y="4" width="8" height="4" rx="1" fill="var(--color-on-surface)" />
              <path d="M20 12h24v8c0 2-2 4-4 4H24c-2 0-4-2-4-4V12z" fill="var(--color-on-surface)" />
              <path d="M22 24h20v24c0 2-2 4-4 4H26c-2 0-4-2-4-4V24z" fill="var(--color-surface-container-high)" stroke="var(--color-on-surface)" strokeWidth="1" />
              <rect x="26" y="52" width="12" height="4" rx="2" fill="var(--color-on-surface)" />
              <rect x="28" y="56" width="8" height="3" rx="1.5" fill="var(--color-on-surface)" />
            </svg>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-on-surface">Something went wrong</h2>
              <p className="text-sm text-on-surface-variant">The lantern flickered. Your data may still be safe.</p>
            </div>

            {this.state.error && (
              <p className="text-xs text-red-400 font-mono bg-background/80 rounded-lg p-3 break-all">
                {this.state.error.message}
              </p>
            )}

            <div className="space-y-3">
              <button onClick={this.handleRetry} className="btn-primary w-full">
                Try Again
              </button>
              <button onClick={this.handleCopyData} className="btn-ghost w-full border border-outline-variant/15">
                Copy Raw Data
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 text-xs font-medium uppercase tracking-[0.05em] text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Data &amp; Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
