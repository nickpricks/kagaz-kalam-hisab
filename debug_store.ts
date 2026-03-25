import { addExpense, getExpenses, deleteExpense, getAllExpensesRaw } from './src/data/store';

// Mock localStorage
const storage: Record<string, string> = {};
global.window = {
  localStorage: {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { for (const key in storage) delete storage[key]; },
  }
} as any;
global.crypto = { randomUUID: () => 'test-uuid' } as any;

console.log('--- Initial Expenses ---');
console.log(getExpenses());

console.log('--- Adding Expense ---');
const exp = addExpense({ date: '2024-03-16', category: 'food', amount: 100, note: 'test', subCat: '' });
console.log('Added:', exp);
console.log('Store after add:', getExpenses());

console.log('--- Deleting Expense ---');
deleteExpense('test-uuid');
console.log('Store after delete:', getExpenses());
console.log('Raw store after delete:', getAllExpensesRaw());
