// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { ExpenseList } from '../components/ExpenseList';
import type { Expense } from '../data/types';
import { toLocalDateString } from '../helpers/dateUtils';

// Mock store functions to avoid localStorage dependency
vi.mock('../data/store', () => ({
  deleteExpense: vi.fn(),
  insertExpense: vi.fn(),
}));

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: crypto.randomUUID(),
    date: toLocalDateString(new Date()),
    category: 'food',
    subCat: '',
    amount: 100,
    note: '',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function renderList(expenses: Expense[], onDeleted = vi.fn()) {
  return render(
    <MemoryRouter>
      <ExpenseList expenses={expenses} onExpenseDeleted={onDeleted} />
    </MemoryRouter>,
  );
}

describe('ExpenseList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders expenses grouped by date', () => {
    // Both dates must be within current month (default filter)
    const now = new Date();
    const earlier = new Date(now.getFullYear(), now.getMonth(), 1);
    const expenses = [
      makeExpense({ note: 'Morning chai', amount: 20 }),
      makeExpense({ note: 'Lunch thali', amount: 150, date: toLocalDateString(earlier) }),
    ];
    renderList(expenses);

    expect(screen.getByText('Morning chai')).toBeInTheDocument();
    expect(screen.getByText('Lunch thali')).toBeInTheDocument();
  });

  it('shows empty state when no expenses match', () => {
    renderList([]);
    expect(screen.getByText('No matching hisab found.')).toBeInTheDocument();
  });

  it('filters by "today" and shows only today\'s entries', () => {
    const today = toLocalDateString(new Date());
    // Use a date within current month but not today
    const earlier = new Date();
    earlier.setDate(1);
    const notToday = toLocalDateString(earlier);
    const expenses = [
      makeExpense({ note: 'Today entry', date: today }),
      makeExpense({ note: 'Earlier entry', date: notToday }),
    ];
    renderList(expenses);

    // Both visible initially (current month default)
    expect(screen.getByText('Today entry')).toBeInTheDocument();
    expect(screen.getByText('Earlier entry')).toBeInTheDocument();

    // Switch to "today" filter
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'today' } });

    expect(screen.getByText('Today entry')).toBeInTheDocument();
    expect(screen.queryByText('Earlier entry')).not.toBeInTheDocument();
  });

  it('filters by category', () => {
    const expenses = [
      makeExpense({ note: 'Food item', category: 'food' }),
      makeExpense({ note: 'Transport item', category: 'travel' }),
    ];
    renderList(expenses);

    // Click category bubble to filter
    fireEvent.click(screen.getByRole('button', { name: /Food/ }));

    expect(screen.getByText('Food item')).toBeInTheDocument();
    expect(screen.queryByText('Transport item')).not.toBeInTheDocument();
  });

  it('filters by search term in notes', () => {
    const expenses = [
      makeExpense({ note: 'Samosa at station' }),
      makeExpense({ note: 'Uber to office' }),
    ];
    renderList(expenses);

    const searchInput = screen.getByPlaceholderText('Search notes or categories...');
    fireEvent.change(searchInput, { target: { value: 'samosa' } });

    expect(screen.getByText('Samosa at station')).toBeInTheDocument();
    expect(screen.queryByText('Uber to office')).not.toBeInTheDocument();
  });

  it('displays grand total for filtered expenses', () => {
    const expenses = [
      makeExpense({ amount: 100 }),
      makeExpense({ amount: 250.50 }),
    ];
    renderList(expenses);

    // Grand total should be 350.50
    expect(screen.getByText('350.50')).toBeInTheDocument();
  });
});
