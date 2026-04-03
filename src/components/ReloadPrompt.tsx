import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Shows a toast when a new service worker is waiting to activate.
 * Matches the undo-toast pattern used in ExpenseList.
 */
export const ReloadPrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  const dismiss = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-5 py-3 flex items-center gap-4 animate-fade-in shadow-glow-primary-subtle">
      <span className="text-sm text-on-surface">
        {needRefresh ? 'New version available' : 'Ready to work offline'}
      </span>
      {needRefresh && (
        <button
          className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container hover:text-primary transition-colors"
          onClick={() => updateServiceWorker()}
        >
          Reload
        </button>
      )}
      <button
        className="text-sm text-on-surface/50 hover:text-on-surface transition-colors"
        onClick={dismiss}
      >
        ✕
      </button>
    </div>
  );
};
