import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

// Toast context (simple, no 3rd party libs)
let toastCallback = null;

export const toast = {
  success: (msg) => toastCallback?.({ msg, type: 'success' }),
  error: (msg) => toastCallback?.({ msg, type: 'error' }),
  info: (msg) => toastCallback?.({ msg, type: 'info' }),
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = ({ msg, type }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    return () => { toastCallback = null; };
  }, []);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-red-400 shrink-0" />,
    info: <Info size={18} className="text-blue-400 shrink-0" />,
  };

  const styles = {
    success: 'bg-dark-800 border-emerald-500/50 text-emerald-300',
    error: 'bg-dark-800 border-red-500/50 text-red-300',
    info: 'bg-dark-800 border-blue-500/50 text-blue-300',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl shadow-black/50 animate-fade-in min-w-[280px] max-w-sm ${styles[t.type]}`}
        >
          {icons[t.type]}
          <span className="text-sm font-medium">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
