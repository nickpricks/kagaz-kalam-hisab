/**
 * @file DevInspector.tsx
 * @description Inspects internal state when devMode is active.
 */

import React from 'react';

interface DevInspectorProps {
  data: any;
  label?: string;
}

/**
 * Component to display raw JSON state for debugging.
 * @param props - Component props.
 */
export const DevInspector: React.FC<DevInspectorProps> = (props: DevInspectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="dev-inspector">
      <div className="dev-inspector-header" onClick={() => setIsOpen(!isOpen)}>
        <span>🛠️ DevMode: {props.label || 'State Inspector'}</span>
        <button>{isOpen ? 'Hide' : 'Show'}</button>
      </div>
      {
        isOpen && (
          <pre className="dev-json-block">
            {
              JSON.stringify(props.data, null, 2)
            }
          </pre>
        )
      }
    </div>
  );
};
