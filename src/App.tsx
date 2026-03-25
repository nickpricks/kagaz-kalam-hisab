/**
 * @file App.tsx
 * @description Main application shell with routing.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './constants/AppRoutes';
import { Header } from './components/Header';
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
    <div className="app-container">
      <Header />
      
      <main>
        <Routes>
          <Route path={AppRoutes.ADD} element={<AddEntry onExpenseAdded={refreshExpenses} />} />
          <Route path={AppRoutes.LIST} element={<ExpenseList expenses={expenses} onExpenseDeleted={refreshExpenses} />} />
          <Route path={AppRoutes.IMPORT} element={<BulkImport onImportSuccess={refreshExpenses} />} />
          <Route path={AppRoutes.ABOUT} element={<About />} />
          <Route path="/" element={<Navigate to={AppRoutes.LIST} replace />} />
        </Routes>
      </main>

      {devModeActive && (
        <DevInspector 
          data={{ 
            expensesCount: expenses.length, 
            localStorage: localStorage.getItem('kagaz_kalam_expenses') 
          }} 
          label="App State" 
        />
      )}
    </div>
  );
};

export default App;
