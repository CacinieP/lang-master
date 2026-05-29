import { useUIStore } from '@/store/uiStore';
import './Toast.css';

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => dismissToast(toast.id)}>
          <span className="toast-icon">{toast.type === 'error' ? '!' : toast.type === 'warning' ? '?' : '?'}</span>
          <span className="toast-text">{toast.text}</span>
          <button className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">&times;</button>
        </div>
      ))}
    </div>
  );
}
