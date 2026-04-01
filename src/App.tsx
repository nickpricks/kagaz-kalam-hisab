/**
 * @file App.tsx
 * @description Main application shell with routing.
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './constants/AppRoutes';
import { Header } from './components/Header';
import { BackgroundEffects } from './components/BackgroundEffects';
import { DevInspector } from './components/DevInspector';
import { ErrorBoundary } from './components/ErrorBoundary';
import { isDevMode } from './helpers/navigation';
import { getExpenses, initSchemaVersion } from './data/store';
import { CONFIG } from './constants/Config';

import { AddEntry } from './components/AddEntry';
import { ExpenseList } from './components/ExpenseList';
import { BulkImport } from './components/BulkImport';
import { About } from './components/About';

// Initialize schema version on first load
initSchemaVersion();

/**
 * Main App component.
 */
export const App: React.FC = () => {
  const [expenses, setExpenses] = React.useState(getExpenses());
  const devModeActive = import.meta.env.DEV && isDevMode();
  const location = useLocation();

  /**
   * Refreshes the expense list from store.
   */
  const refreshExpenses = () => {
    setExpenses(getExpenses());
  };

  // Sync state when another tab modifies localStorage
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONFIG.STORAGE_KEYS.EXPENSES) refreshExpenses();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-x-hidden">
      {/* Ambient Glow Circles */}
      <div className="ambient-glow bg-primary-container/5 w-[500px] h-[500px] -top-20 -right-20" />
      <div className="ambient-glow bg-primary-container/10 w-[600px] h-[600px] -bottom-40 -left-40" />

      <BackgroundEffects />

      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative z-0">
        <Header />

        <main className="flex-1 px-4 py-6 pb-24">
          <ErrorBoundary>
            <div key={location.pathname} className="animate-page-enter">
              <Routes location={location}>
                <Route path={AppRoutes.ADD} element={<AddEntry onExpenseAdded={refreshExpenses} />} />
                <Route path={AppRoutes.LIST} element={<ExpenseList expenses={expenses} onExpenseDeleted={refreshExpenses} />} />
                <Route path={AppRoutes.IMPORT} element={<BulkImport onImportSuccess={refreshExpenses} />} />
                <Route path={AppRoutes.ABOUT} element={<About />} />
                <Route path="/" element={<Navigate to={AppRoutes.LIST} replace />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </main>

        {
          devModeActive &&
          <div className="p-4">
            <DevInspector
              data={{ expensesCount: expenses.length, localStorage: localStorage.getItem(CONFIG.STORAGE_KEYS.EXPENSES) }}
              label="App State"
            />
          </div>
        }
      </div>
    </div>
  );
};

export default App;
