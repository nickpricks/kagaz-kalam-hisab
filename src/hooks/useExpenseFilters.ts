/**
 * @file useExpenseFilters.ts
 * @description Custom hook for filtering, grouping, and summarizing expenses.
 */

import React from 'react';
import type { Expense } from '../data/types';
import { CATEGORIES } from '../data/categories';
import { toLocalDateString } from '../helpers/dateUtils';

interface CustomDateRange {
  start: string;
  end: string;
}

interface UseExpenseFiltersResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  customDateRange: CustomDateRange;
  setCustomDateRange: React.Dispatch<React.SetStateAction<CustomDateRange>>;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  filteredExpenses: Expense[];
  groupedExpenses: Record<string, Expense[]>;
  sortedDates: string[];
  grandTotal: number;
}

/**
 * Hook that manages filter state and derives grouped/sorted expense data.
 * All date comparisons use YYYY-MM-DD strings to avoid UTC/local timezone mismatch.
 */
export function useExpenseFilters(expenses: Expense[]): UseExpenseFiltersResult {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [customDateRange, setCustomDateRange] = React.useState<CustomDateRange>({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  const filteredExpenses = React.useMemo(() => {
    const now = new Date();
    const todayStr = toLocalDateString(now);

    return expenses.filter((e) => {
      const matchesSearch = e.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (CATEGORIES[e.category]?.label || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

      let matchesDate = true;

      if (dateFilter === 'today') {
        matchesDate = e.date === todayStr;
      } else if (dateFilter === 'current_week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        matchesDate = e.date >= toLocalDateString(startOfWeek);
      } else if (dateFilter === 'current_month') {
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        matchesDate = e.date >= monthStart && e.date <= todayStr;
      } else if (dateFilter === 'last_12_months') {
        const twelveAgo = new Date(now);
        twelveAgo.setMonth(now.getMonth() - 12);
        matchesDate = e.date >= toLocalDateString(twelveAgo);
      } else if (dateFilter === 'current_fy') {
        // Indian Financial Year: April 1 (month index 3) to March 31
        const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        const fyStart = `${fyStartYear}-04-01`;
        const fyEnd = `${fyStartYear + 1}-03-31`;
        matchesDate = e.date >= fyStart && e.date <= fyEnd;
      } else if (dateFilter === 'last_fy') {
        const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() - 1 : now.getFullYear() - 2;
        const fyStart = `${fyStartYear}-04-01`;
        const fyEnd = `${fyStartYear + 1}-03-31`;
        matchesDate = e.date >= fyStart && e.date <= fyEnd;
      } else if (dateFilter === 'custom') {
        const from = customDateRange.start || '0000-00-00';
        const to = customDateRange.end || '9999-99-99';
        matchesDate = e.date >= from && e.date <= to;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, searchTerm, categoryFilter, dateFilter, customDateRange]);

  const { groupedExpenses, sortedDates, grandTotal } = React.useMemo(() => {
    const grouped = filteredExpenses.reduce((groups: Record<string, Expense[]>, expense) => {
      const date = expense.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
      return groups;
    }, {});

    return {
      groupedExpenses: grouped,
      sortedDates: Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
      grandTotal: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  }, [filteredExpenses]);

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    categoryFilter,
    setCategoryFilter,
    filteredExpenses,
    groupedExpenses,
    sortedDates,
    grandTotal,
  };
}
