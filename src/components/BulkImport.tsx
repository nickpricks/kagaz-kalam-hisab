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
    <div className="view-bulk-import">
      <h2>Bulk Import</h2>
      <div className="card">
        <p className="help-text">
          Paste your JSON data below. The format should be an array of objects:
          <code>[{"{ \"date\": \"2024-03-15\", \"category\": \"food\", \"amount\": 150 }"}]</code>
        </p>

        <textarea
          className="import-textarea"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='[{"date": "2024-03-15", "category": "food", "amount": 150}]'
          rows={10}
        />

        {
          status &&
          <div className={`status-message ${status.isError ? 'error' : 'success'}`}>
            {status.message}
          </div>

        }

        <button
          className="primary"
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
