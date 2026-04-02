/**
 * @file ExpenseList.tsx
 * @description View for listing and filtering expenses.
 */

import React from 'react';
import type { Expense } from '../data/types';
import { CATEGORIES } from '../data/categories';
import { deleteExpense, insertExpense } from '../data/store';
import { CONFIG } from '../constants/Config';
import { useExpenseFilters } from '../hooks/useExpenseFilters';

import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../constants/AppRoutes';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

const UNDO_TIMEOUT_MS = 5000;

/**
 * View component for listing expenses.
 * @param props - Component props.
 */
export const ExpenseList: React.FC<ExpenseListProps> = (props: ExpenseListProps) => {
  const navigate = useNavigate();
  const [undoExpense, setUndoExpense] = React.useState<Expense | null>(null);
  const undoTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    searchTerm, setSearchTerm,
    dateFilter, setDateFilter,
    customDateRange, setCustomDateRange,
    categoryFilter, setCategoryFilter,
    groupedExpenses, sortedDates, grandTotal,
  } = useExpenseFilters(props.expenses);

  // Clear undo timer on unmount
  React.useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  /**
   * Handles deletion with undo toast.
   * @param id - The ID of the expense to delete.
   */
  const handleDelete = (id: string) => {
    const removed = deleteExpense(id);
    if (!removed) return;

    // Clear any previous undo timer
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    setUndoExpense(removed);
    props.onExpenseDeleted();

    undoTimerRef.current = setTimeout(() => {
      setUndoExpense(null);
      undoTimerRef.current = null;
    }, UNDO_TIMEOUT_MS);
  };

  /**
   * Restores the most recently deleted expense.
   */
  const handleUndo = () => {
    if (!undoExpense) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    insertExpense(undoExpense);
    setUndoExpense(null);
    undoTimerRef.current = null;
    props.onExpenseDeleted(); // refresh list
  };

  const calculateTotal = (expenses: Expense[]) => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="space-y-12">
      {/* Asymmetrical Layout for Header / Balance */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary-container animate-[pulse_2s_ease-in-out_infinite]" />
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-[0.05em]">Total Balance</p>
        </div>
        <div className="text-[3.5rem] leading-none font-display tracking-tight text-on-surface flex items-baseline gap-1">
          <span className="text-primary-container/80 text-3xl font-sans font-normal">{CONFIG.CURRENCY_SYMBOL}</span>
          {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes or categories..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="input-field py-2 text-sm appearance-none cursor-pointer flex-1 min-w-[140px]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="current_week">Current Week</option>
            <option value="current_month">Current Month</option>
            <option value="last_12_months">Last 12 Months</option>
            <option value="current_fy">Current Fin Year</option>
            <option value="last_fy">Last Fin Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            className="input-field py-2 text-sm appearance-none cursor-pointer flex-1 min-w-[140px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {
              Object.values(CATEGORIES).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
            }
          </select>
        </div>

        {dateFilter === 'custom' && (
          <div className="flex gap-3 animate-fade-in pt-2 border-t border-outline-variant/15 mt-2">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">From</label>
              <input
                type="date"
                className="input-field py-2 text-sm text-on-surface-variant"
                value={customDateRange.start}
                onChange={e => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">To</label>
              <input
                type="date"
                className="input-field py-2 text-sm text-on-surface-variant"
                value={customDateRange.end}
                onChange={e => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      {
        sortedDates.length === 0 &&
        <div className="glass-card p-12 flex flex-col items-center gap-6 animate-fade-in">
          {/* Dimmed lantern icon */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
            <rect x="24" y="8" width="16" height="4" rx="2" fill="var(--color-on-surface)" />
            <rect x="28" y="4" width="8" height="4" rx="1" fill="var(--color-on-surface)" />
            <path d="M20 12h24v8c0 2-2 4-4 4H24c-2 0-4-2-4-4V12z" fill="var(--color-on-surface)" />
            <path d="M22 24h20v24c0 2-2 4-4 4H26c-2 0-4-2-4-4V24z" fill="var(--color-surface-container-high)" stroke="var(--color-on-surface)" strokeWidth="1" />
            <ellipse cx="32" cy="38" rx="4" ry="6" fill="var(--color-primary-container)" className="opacity-30" />
            <line x1="32" y1="34" x2="32" y2="30" stroke="var(--color-primary-container)" strokeWidth="1" className="opacity-40" />
            <rect x="26" y="52" width="12" height="4" rx="2" fill="var(--color-on-surface)" />
            <rect x="28" y="56" width="8" height="3" rx="1.5" fill="var(--color-on-surface)" />
          </svg>
          <div className="space-y-2 text-center">
            <p className="text-on-surface-variant font-medium tracking-wide">No matching hisab found.</p>
            <p className="text-on-surface-variant/50 text-xs tracking-[0.05em]">The lantern sees nothing here.</p>
          </div>
        </div>
      }

      <div className="space-y-10">
        {
          sortedDates.map((date) => (
            <div key={date} className="relative">
              <div className="sticky top-[72px] z-10 py-3 bg-background/90 backdrop-blur-xl -mx-4 px-4 flex justify-between items-center mb-6">
                <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">
                  {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant/80">
                  {CONFIG.CURRENCY_SYMBOL}{calculateTotal(groupedExpenses[date]).toFixed(2)}
                </span>
              </div>

              <div className="space-y-6">
                {
                  groupedExpenses[date].map((expense) => (
                    <div key={expense.id} className="glass-card p-5 flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold text-on-surface tracking-wide">
                            {CATEGORIES[expense.category]?.label || expense.category}
                          </span>
                          {expense.subCat && (
                            <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-sm">
                              {expense.subCat}
                            </span>
                          )}
                        </div>
                        {expense.note && (
                          <p className="text-[13px] text-on-surface-variant mt-2 font-normal leading-relaxed line-clamp-2">
                            {expense.note}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-lg font-semibold text-on-surface tracking-tight">
                          {CONFIG.CURRENCY_SYMBOL}{expense.amount.toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            className="p-1.5 rounded-md text-on-surface-variant/60 hover:text-primary-container hover:bg-surface-container-high transition-colors cursor-pointer"
                            onClick={() => navigate(AppRoutes.ADD, { state: { editExpense: expense } })}
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 rounded-md text-on-surface-variant/60 hover:text-red-400 hover:bg-surface-container-high transition-colors cursor-pointer"
                            onClick={() => handleDelete(expense.id)}
                            title="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>

      {/* Undo Toast */}
      {undoExpense && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-5 py-3 flex items-center gap-4 animate-fade-in shadow-glow-primary-subtle">
          <span className="text-sm text-on-surface">
            Dropped {CATEGORIES[undoExpense.category]?.label || undoExpense.category} {CONFIG.CURRENCY_SYMBOL}{undoExpense.amount.toFixed(2)}
          </span>
          <button
            className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container hover:text-primary transition-colors"
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
