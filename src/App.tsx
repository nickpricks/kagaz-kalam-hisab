/**
 * @file App.tsx
 * @description Main application shell with routing.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './constants/AppRoutes';
import { Header } from './components/Header';
import { BackgroundEffects } from './components/BackgroundEffects';
import { DevInspector } from './components/DevInspector';
import { isDevMode } from './helpers/navigation'; // Keeping this for now for devMode check
import { getExpenses } from './data/store';

import { AddEntry } from './components/AddEntry';
import { ExpenseList } from './components/ExpenseList';
import { BulkImport } from './components/BulkImport';
import { About } from './components/About';

/**
 * Main App component.
 */
export const App: React.FC = () => {
  const [expenses, setExpenses] = React.useState(getExpenses());
  const devModeActive = isDevMode();

  /**
   * Refreshes the expense list from store.
   */
  const refreshExpenses = () => {
    setExpenses(getExpenses());
  };

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-x-hidden">
      {/* Ambient Glow Circles */}
      <div className="ambient-glow bg-primary-container/5 w-[500px] h-[500px] -top-20 -right-20" />
      <div className="ambient-glow bg-primary-container/10 w-[600px] h-[600px] -bottom-40 -left-40" />

      <BackgroundEffects />

      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative z-0">
        <Header />

        <main className="flex-1 px-4 py-6 pb-24">
          <Routes>
            <Route path={AppRoutes.ADD} element={<AddEntry onExpenseAdded={refreshExpenses} />} />
            <Route path={AppRoutes.LIST} element={<ExpenseList expenses={expenses} onExpenseDeleted={refreshExpenses} />} />
            <Route path={AppRoutes.IMPORT} element={<BulkImport onImportSuccess={refreshExpenses} />} />
            <Route path={AppRoutes.ABOUT} element={<About />} />
            <Route path="/" element={<Navigate to={AppRoutes.LIST} replace />} />
          </Routes>
        </main>

        {
          devModeActive &&
          <div className="p-4">
            <DevInspector
              data={{ expensesCount: expenses.length, localStorage: localStorage.getItem('kagaz_kalam_expenses') }}
              label="App State"
            />
          </div>
        }
      </div>
    </div>
  );
};

export default App;
