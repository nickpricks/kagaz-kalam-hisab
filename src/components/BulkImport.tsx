/**
 * @file BulkImport.tsx
 * @description View for bulk importing expenses from JSON data.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { importExpenses } from '../data/store';
import { validateImportData } from '../utils/validation';
import { ImportMsg } from '../constants/Messages';
import type { Expense } from '../data/types';

const MAX_INPUT_SIZE = 1_000_000; // 1MB
const MAX_ENTRY_COUNT = 5000;

interface BulkImportProps {
  onImportSuccess: () => void;
}

/**
 * View component for bulk import.
 * @param props - Component props.
 */
export const BulkImport: React.FC<BulkImportProps> = (props: BulkImportProps) => {
  const location = useLocation();
  const [jsonInput, setJsonInput] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; isError: boolean } | null>(null);

  React.useEffect(() => {
    if (location.state && location.state.editExpense) {
      setJsonInput(JSON.stringify([location.state.editExpense], null, 2));
    }
  }, [location.state]);

  /**
   * Handles the import process: parse → validate → import.
   */
  const handleImport = () => {
    if (!jsonInput.trim()) return;

    if (jsonInput.length > MAX_INPUT_SIZE) {
      setStatus({ message: ImportMsg.INPUT_TOO_LARGE((jsonInput.length / 1_000_000).toFixed(1)), isError: true });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        setStatus({ message: ImportMsg.NOT_ARRAY, isError: true });
        return;
      }

      if (parsed.length > MAX_ENTRY_COUNT) {
        setStatus({ message: ImportMsg.TOO_MANY_ENTRIES(parsed.length, MAX_ENTRY_COUNT), isError: true });
        return;
      }

      const validation = validateImportData(parsed);
      if (!validation.isValid) {
        setStatus({ message: ImportMsg.VALIDATION_FAILED(validation.error!), isError: true });
        return;
      }

      // Build validated Expense objects from parsed data
      const now = new Date().toISOString();
      const entries: Expense[] = parsed.map((item: Record<string, unknown>) => ({
        id: (typeof item.id === 'string' && item.id) ? item.id : crypto.randomUUID(),
        date: item.date as string,
        category: item.category as string,
        subCat: (typeof item.subCat === 'string') ? item.subCat : '',
        amount: item.amount as number,
        note: (typeof item.note === 'string') ? item.note : '',
        isDeleted: false,
        createdAt: (typeof item.createdAt === 'string') ? item.createdAt : now,
        updatedAt: (typeof item.updatedAt === 'string') ? item.updatedAt : now,
      }));

      const result = importExpenses(entries);
      if (result.success) {
        const parts = [`Successfully imported ${result.count} expenses!`];
        if (result.skipped > 0) parts.push(`${result.skipped} duplicates skipped.`);
        setStatus({ message: parts.join(' '), isError: false });
        setJsonInput('');
        props.onImportSuccess();
      } else {
        setStatus({ message: ImportMsg.STORAGE_FAILED, isError: true });
      }
    } catch {
      setStatus({ message: ImportMsg.INVALID_JSON, isError: true });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-[1.75rem] font-medium tracking-tight text-on-surface">Bulk Import</h2>
        <p className="text-on-surface-variant text-[0.75rem] font-medium uppercase tracking-[0.05em]">Data Management</p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div className="space-y-3">
          <p className="text-[1rem] font-normal text-on-surface-variant leading-relaxed">
            Paste your JSON data below. The format should be an array of objects.
          </p>
          <div className="bg-background/80 rounded-[0.5rem] p-4 border border-outline-variant/15 overflow-x-auto text-[0.75rem] font-mono text-primary/80">
            <code>{'[{"date": "2024-03-15", "category": "food", "amount": 150}]'}</code>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">JSON Input</label>
          <textarea
            className="input-field min-h-[250px] font-mono text-xs p-4 leading-relaxed bg-background/30"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your JSON here...'
          />
        </div>

        {
          status &&
          <div className={`p-4 rounded-xl text-xs font-bold border transition-all animate-fade-in
            ${status.isError
              ? 'bg-red-500/10 border-red-500/30 text-red-500'
              : 'bg-green-500/10 border-green-500/30 text-green-500'
            }`}>
            {status.isError ? '\u26A0\uFE0F ' : '\u2705 '} {status.message}
          </div>
        }

        <button
          className="btn-primary w-full"
          onClick={handleImport}
          disabled={!jsonInput.trim()}
        >
          Import JSON
        </button>
      </div>
    </div>
  );
};
