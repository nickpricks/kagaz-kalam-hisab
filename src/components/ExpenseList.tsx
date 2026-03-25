/**
 * @file ExpenseList.tsx
 * @description View for listing and filtering expenses.
 */

import React from 'react';
import type { Expense } from '../data/types';
import { CATEGORIES } from '../data/categories';
import { deleteExpense } from '../data/store';
import { CONFIG } from '../constants/Config';

import { useNavigate } from 'react-router-dom';
import { isDevMode } from '../helpers/navigation';
import { AppRoutes } from '../constants/AppRoutes';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

/**
 * View component for listing expenses.
 * @param props - Component props.
 */
export const ExpenseList: React.FC<ExpenseListProps> = (props: ExpenseListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all'); // all, today, 7days, 30days
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const devMode = isDevMode();

  /**
   * Handles deletion of an expense.
   * @param id - The ID of the expense to delete.
   */
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hisab?')) {
      deleteExpense(id);
      props.onExpenseDeleted();
    }
  };

  /**
   * Filters expenses based on current criteria.
   */
  const filteredExpenses = props.expenses.filter((e) => {
    // Search filter
    const matchesSearch = e.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (CATEGORIES[e.category]?.label || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    // Date filter
    let matchesDate = true;
    const expenseDate = new Date(e.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      matchesDate = e.date === todayStr;
    } else if (dateFilter === '7days') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = expenseDate >= sevenDaysAgo;
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesDate = expenseDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  /**
   * Groups filtered expenses by date.
   */
  const groupedExpenses = filteredExpenses.reduce((groups: Record<string, Expense[]>, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  /**
   * Calculates total for a group of expenses.
   */
  const calculateTotal = (expenses: Expense[]) => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const grandTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="view-expense-list">
      <div className="view-header">
        <h2>Your Expenses</h2>
        <div className="list-summary">
          Total: <strong>{CONFIG.CURRENCY_SYMBOL}{grandTotal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="filter-panel card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {
              Object.values(CATEGORIES).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
            }
          </select>
        </div>
      </div>

      {
        sortedDates.length === 0 &&
        <div className="card empty-state">
          <p>No matching expenses found.</p>
        </div>
      }

      {
        sortedDates.map((date) => (
          <div key={date} className="date-group">
            <div className="date-header">
              <span className="date-label">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="date-total">{CONFIG.CURRENCY_SYMBOL}{calculateTotal(groupedExpenses[date]).toFixed(2)}</span>
            </div>

            <div className="expense-items">
              {
                groupedExpenses[date].map((expense) => (
                  <div key={expense.id} className="expense-item card">
                    <div className="expense-main">
                      <div className="expense-info">
                        <span className="expense-category">
                          {
                            CATEGORIES[expense.category]?.label || expense.category
                          }
                          {
                            expense.subCat && <span className="expense-subcat"> › {expense.subCat}</span>
                          }
                        </span>
                        {
                          expense.note && <p className="expense-note">{expense.note}</p>
                        }
                      </div>
                      <div className="expense-amount-wrapper">
                        <span className="expense-amount">{CONFIG.CURRENCY_SYMBOL}{expense.amount.toFixed(2)}</span>
                        {
                          devMode &&
                          <button
                            className="edit-btn"
                            onClick={() => navigate(AppRoutes.IMPORT, { state: { editExpense: expense } })}
                            title="Edit in Import (DevMode)"
                          >
                            📝
                          </button>
                        }
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(expense.id)}
                          title="Delete"
                        >
                          🗑️
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
  );
};

export default ExpenseList;
