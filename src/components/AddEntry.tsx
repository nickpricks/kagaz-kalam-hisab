/**
 * @file AddEntry.tsx
 * @description View for adding a new expense.
 */

import React from 'react';
import { CATEGORIES, getSubCategories } from '../data/categories';
import { addExpense } from '../data/store';

interface AddEntryProps {
  onExpenseAdded: () => void;
}

/**
 * View component for adding a new expense.
 * @param props - Component props.
 */
export const AddEntry: React.FC<AddEntryProps> = (props: AddEntryProps) => {
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = React.useState('');
  const [subCat, setSubCat] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [note, setNote] = React.useState('');
  const [activeAmountPreset, setActiveAmountPreset] = React.useState<number | null>(null);

  const amountPresets = [10, 20, 50, 100, 200, 500];

  /**
   * Handles form submission.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || parseFloat(amount) <= 0) return;

    addExpense({
      date,
      category,
      subCat,
      amount: parseFloat(amount),
      note,
    });

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
          <h2 className="text-[1.75rem] font-medium tracking-tight text-on-surface">Add Entry</h2>
          <p className="text-on-surface-variant text-[0.75rem] font-medium uppercase tracking-[0.05em] mt-1">New Transaction</p>
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
          <div className="grid grid-cols-3 gap-3">
            {
              Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`py-3 px-2 rounded-[0.5rem] text-[0.75rem] font-medium uppercase tracking-[0.05em] transition-all duration-300 border
                    ${category === cat.id 
                      ? 'bg-primary-container/20 text-primary-container border-primary-container/40 shadow-[0_0_20px_rgba(255,193,7,0.4)] scale-[0.98]' 
                      : 'bg-[#131313]/50 text-on-surface-variant border-outline-variant/15 hover:border-outline-variant/30 hover:text-on-surface active:scale-95 active:shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                    }`}
                  onClick={() => {
                    setCategory(cat.id);
                    setSubCat(''); 
                  }}
                >
                  {cat.label}
                </button>
              ))
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
                          : 'bg-[#131313]/50 text-on-surface-variant border-outline-variant/15 hover:border-outline-variant/30 hover:text-on-surface'
                        }`}
                      onClick={() => setSubCat(sc)}
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
            Amount (₹) <span className="text-primary-container italic">*</span>
          </label>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-[3.5rem] font-semibold tracking-tight text-on-surface text-right border-none focus:ring-0 placeholder:text-on-surface/10 selection:bg-primary-container/30"
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
                        ? 'bg-primary-container/40 text-primary-container border-primary-container/50 shadow-[0_0_20px_rgba(255,193,7,0.6)] scale-[0.95]'
                        : 'bg-surface-container-high/40 text-on-surface-variant border-outline-variant/15 hover:border-primary-container/30 hover:text-primary-container active:scale-95'
                      }`}
                    onClick={() => handleAddAmount(p)}
                  >
                    +{p}
                  </button>
                ))
              }
            </div>
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

        <button 
          type="submit" 
          className="btn-primary w-full mt-4" 
          disabled={!isFormValid}
        >
          Save Hisab
        </button>
      </form>
    </div>
  );
};

export default AddEntry;
