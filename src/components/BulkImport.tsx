import React from 'react';
import { useLocation } from 'react-router-dom';
import { importExpensesFromJSON } from '../data/store';
import { validateImportData } from '../utils/validation';

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
   * Handles the import process.
   */
  const handleImport = () => {
    if (!jsonInput.trim()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      const validation = validateImportData(parsed);

      if (!validation.isValid) {
        setStatus({ message: `Validation failed: ${validation.error}`, isError: true });
        return;
      }

      const result = importExpensesFromJSON(jsonInput);
      if (result.success) {
        setStatus({ message: `Successfully imported ${result.count} expenses!`, isError: false });
        setJsonInput('');
        props.onImportSuccess();
      } else {
        setStatus({ message: `Import failed: ${result.error}`, isError: true });
      }
    } catch (e) {
      setStatus({ message: 'Invalid JSON format. Please check your data.', isError: true });
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
          <div className="bg-[#131313]/80 rounded-[0.5rem] p-4 border border-outline-variant/15 overflow-x-auto text-[0.75rem] font-mono text-primary/80">
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
            {status.isError ? '⚠️ ' : '✅ '} {status.message}
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

export default BulkImport;
