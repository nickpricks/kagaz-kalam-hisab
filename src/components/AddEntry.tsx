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
    setAmount((current + val).toString());
  };

  const selectedCategorySubCats = category ? getSubCategories(category) : [];
  const isFormValid = category && amount && parseFloat(amount) > 0;

  return (
    <div className="view-add-entry">
      <div className="view-header">
        <h2>Add New Expense</h2>
        <button className="reset-btn" onClick={handleReset} title="Reset Form">
          🔄 Reset
        </button>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category <span className="req">*</span></label>
          <div className="category-grid">
            {
              Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${category === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setCategory(cat.id);
                    setSubCat(''); // Reset sub-cat on cat change
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
            <div className="form-group animate-fade-in">
              <label>Sub-Category</label>
              <div className="category-grid">
                {
                  selectedCategorySubCats.map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      className={`category-chip sub ${subCat === sc ? 'active' : ''}`}
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

        <div className="form-group">
          <label>Amount (₹) <span className="req">*</span></label>
          <div className="amount-input-wrapper">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              step="any"
              min="0.01"
            />
            <div className="preset-grid">
              {
                amountPresets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleAddAmount(p)}
                  >
                    +{p}
                  </button>
                ))
              }
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            rows={2}
          />
        </div>

        <button type="submit" className="primary" disabled={!isFormValid}>
          Save Hisab
        </button>
      </form>
    </div>
  );
};

export default AddEntry;
