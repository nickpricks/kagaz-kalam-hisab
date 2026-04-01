/**
 * @file DevInspector.tsx
 * @description Inspects internal state when devMode is active.
 */

import React from 'react';

interface DevInspectorProps {
  data: unknown;
  label?: string;
}

/**
 * Component to display raw JSON state for debugging.
 * @param props - Component props.
 */
export const DevInspector: React.FC<DevInspectorProps> = (props: DevInspectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-container">🛠️ {props.label || 'State Inspector'}</span>
        <button className="btn-ghost px-2 py-1 text-[10px]">{isOpen ? 'Hide' : 'Show'}</button>
      </div>
      {
        isOpen && (
          <pre className="bg-background/80 rounded-[0.5rem] p-4 border border-outline-variant/15 overflow-x-auto text-[0.75rem] font-mono text-primary/80 max-h-[400px] overflow-y-auto">
            {
              JSON.stringify(props.data, null, 2)
            }
          </pre>
        )
      }
    </div>
  );
};
