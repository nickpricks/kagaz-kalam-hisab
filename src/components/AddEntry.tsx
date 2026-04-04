/**
 * @file AddEntry.tsx
 * @description View for adding a new expense.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, getSubCategories } from '../data/categories';
import { addExpense, updateExpense } from '../data/store';
import { toLocalDateString } from '../helpers/dateUtils';
import { AppRoutes } from '../constants/AppRoutes';
import { CONFIG } from '../constants/Config';
import { ValidationMsg } from '../constants/Messages';
import type { Expense } from '../data/types';

interface AddEntryProps {
  onExpenseAdded: () => void;
}

/**
 * View component for adding a new expense.
 * @param props - Component props.
 */
function parseEditExpense(state: unknown): Expense | null {
  if (state == null || typeof state !== 'object') return null;
  const s = state as Record<string, unknown>;
  if (s.editExpense == null || typeof s.editExpense !== 'object') return null;
  const e = s.editExpense as Record<string, unknown>;
  if (
    typeof e.id !== 'string' || !e.id ||
    typeof e.date !== 'string' ||
    typeof e.category !== 'string' ||
    typeof e.amount !== 'number' || !isFinite(e.amount) || e.amount <= 0
  ) return null;
  return e as unknown as Expense;
}

export const AddEntry: React.FC<AddEntryProps> = (props: AddEntryProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editExpense = parseEditExpense(location.state);

  const [date, setDate] = React.useState(editExpense?.date ?? toLocalDateString(new Date()));
  const [category, setCategory] = React.useState(editExpense?.category ?? '');
  const [subCat, setSubCat] = React.useState(editExpense?.subCat ?? '');
  const [amount, setAmount] = React.useState(editExpense ? editExpense.amount.toString() : '');
  const [note, setNote] = React.useState(editExpense?.note ?? '');
  const [activeAmountPreset, setActiveAmountPreset] = React.useState<number | null>(null);
  const [showMoreAmounts, setShowMoreAmounts] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');

  const amountPresets = [10, 20, 50, 100, 200];
  const extendedPresets = [0.1, 0.2, 0.5, 1, 2, 5, 500, 1000, 2000, 5000, 10000];

  /**
   * Handles form submission.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || parseFloat(amount) <= 0) {
      setValidationError(ValidationMsg.CATEGORY_AND_AMOUNT);
      setTimeout(() => setValidationError(''), 3000);
      return;
    }

    if (editExpense) {
      const result = updateExpense(editExpense.id, {
        date,
        category,
        subCat,
        amount: parseFloat(amount),
        note,
      });
      if (!result.found) {
        setValidationError(ValidationMsg.UPDATE_NOT_FOUND);
        setTimeout(() => setValidationError(''), 3000);
        return;
      }
      if (!result.saved) {
        setValidationError(ValidationMsg.UPDATE_STORAGE_FULL);
        setTimeout(() => setValidationError(''), 5000);
      }
      props.onExpenseAdded();
      navigate(AppRoutes.LIST);
      return;
    }

    const { saved } = addExpense({
      date,
      category,
      subCat,
      amount: parseFloat(amount),
      note,
    });

    if (!saved) {
      setValidationError(ValidationMsg.ADD_STORAGE_FULL);
      setTimeout(() => setValidationError(''), 5000);
    }

    handleReset();
    props.onExpenseAdded();
  };

  /**
   * Resets the form to initial state.
   */
  const handleReset = () => {
    setCategory('');
    setSubCat('');
    setAmount('');
    setNote('');
    setShowMoreAmounts(false);
    setValidationError('');
  };

  /**
   * Adds an amount to the current input.
   * @param val - The amount to add.
   */
  const handleAddAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    const newVal = (current + val).toFixed(2);
    setAmount(newVal);

    // Bubble glow effect
    setActiveAmountPreset(val);
    setTimeout(() => setActiveAmountPreset(null), 750);
  };

  const selectedCategorySubCats = category ? getSubCategories(category) : [];
  const isFormValid = category && amount && parseFloat(amount) > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.75rem] font-medium tracking-tight text-on-surface">{editExpense ? 'Edit Entry' : 'Add Entry'}</h2>
          <p className="text-on-surface-variant text-[0.75rem] font-medium uppercase tracking-[0.05em] mt-1">{editExpense ? 'Update Transaction' : 'New Transaction'}</p>
        </div>
        <button
          className="p-2 rounded-full text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors active:scale-95"
          onClick={handleReset}
          title="Reset Form"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1">
            Category <span className="text-primary-container italic">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {
              Object.values(CATEGORIES).map((cat) => {
                const [emoji, ...rest] = cat.label.split(' ');
                const text = rest.join(' ');
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`group inline-flex items-center justify-center rounded-full transition-all duration-300 border
                      ${isSelected
                        ? 'h-10 px-4 gap-2 bg-primary-container/20 text-primary-container border-primary-container/40 shadow-glow-primary-medium'
                        : 'h-10 w-10 bg-background/50 text-on-surface-variant border-outline-variant/15 hover:border-outline-variant/30 hover:bg-surface-container-high/40 active:scale-95 active:shadow-glow-primary-subtle'
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        setCategory('');
                      } else {
                        setCategory(cat.id);
                      }
                      setSubCat('');
                      setValidationError('');
                    }}
                    aria-label={cat.label}
                    title={cat.label}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    {isSelected && (
                      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.05em] animate-fade-in whitespace-nowrap">
                        {text}
                      </span>
                    )}
                  </button>
                );
              })
            }
          </div>
        </div>

        {
          selectedCategorySubCats.length > 0 && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1">Sub-Category</label>
              <div className="flex flex-wrap gap-2">
                {
                  selectedCategorySubCats.map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      className={`py-2 px-4 rounded-full text-[10.5px] font-medium uppercase tracking-[0.05em] transition-all duration-300 border
                        ${subCat === sc
                          ? 'bg-secondary/20 text-secondary border-secondary/40'
                          : 'bg-background/50 text-on-surface-variant border-outline-variant/15 hover:border-outline-variant/30 hover:text-on-surface'
                        }`}
                      onClick={() => setSubCat(subCat === sc ? '' : sc)}
                    >
                      {sc}
                    </button>
                  ))
                }
              </div>
            </div>
          )
        }

        <div className="space-y-3">
          <label className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1">
            Amount ({CONFIG.CURRENCY_SYMBOL}) <span className="text-primary-container italic">*</span>
          </label>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setValidationError(''); }}
              placeholder="0.00"
              className="w-full bg-transparent text-[3.5rem] font-display tracking-tight text-on-surface text-right border-none focus:ring-0 placeholder:text-on-surface/10 selection:bg-primary-container/30"
              required
              step="any"
              min="0.01"
            />
            <div className="grid grid-cols-6 gap-2">
              {
                amountPresets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`py-2 flex items-center justify-center rounded-[0.5rem] text-[0.75rem] font-medium tracking-[0.05em] transition-all duration-300 border
                      ${activeAmountPreset === p
                        ? 'bg-primary-container/40 text-primary-container border-primary-container/50 shadow-glow-primary-intense scale-[0.95]'
                        : 'bg-surface-container-high/40 text-on-surface-variant border-outline-variant/15 hover:border-primary-container/30 hover:text-primary-container active:scale-95'
                      }`}
                    onClick={() => handleAddAmount(p)}
                  >
                    +{p}
                  </button>
                ))
              }
              <button
                type="button"
                className={`py-2 flex items-center justify-center rounded-[0.5rem] text-[0.75rem] font-medium tracking-[0.05em] transition-all duration-300 border
                  ${showMoreAmounts
                    ? 'bg-primary-container/20 text-primary-container border-primary-container/40'
                    : 'bg-surface-container-high/40 text-on-surface-variant border-outline-variant/15 hover:border-primary-container/30 hover:text-primary-container active:scale-95'
                  }`}
                onClick={() => setShowMoreAmounts(!showMoreAmounts)}
                title="More amounts"
              >
                ···
              </button>
            </div>
            {showMoreAmounts && (
              <div className="grid grid-cols-6 gap-2 animate-fade-in">
                {
                  extendedPresets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`py-2 flex items-center justify-center rounded-[0.5rem] text-[0.75rem] font-medium tracking-[0.05em] transition-all duration-300 border
                        ${activeAmountPreset === p
                          ? 'bg-primary-container/40 text-primary-container border-primary-container/50 shadow-glow-primary-intense scale-[0.95]'
                          : 'bg-surface-container-high/40 text-on-surface-variant border-outline-variant/15 hover:border-primary-container/30 hover:text-primary-container active:scale-95'
                        }`}
                      onClick={() => handleAddAmount(p)}
                    >
                      +{p}
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            rows={2}
            className="input-field resize-none"
          />
        </div>

        {validationError && (
          <div className="p-3 rounded-xl text-xs font-bold border bg-red-500/10 border-red-500/30 text-red-500 animate-fade-in">
            {validationError}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={!isFormValid}
        >
          {editExpense ? 'Update Hisab' : 'Save Hisab'}
        </button>
      </form>
    </div>
  );
};
