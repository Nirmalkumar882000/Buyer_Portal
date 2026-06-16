import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: 'linear-gradient(135deg, #0d3d38 0%, #1b4d4f 100%)',
    border: '#57c7c0',
    icon: '#57c7c0',
    text: '#e2f2f1',
  },
  error: {
    bg: 'linear-gradient(135deg, #3d0d0d 0%, #7f1d1d 100%)',
    border: '#f87171',
    icon: '#f87171',
    text: '#fee2e2',
  },
  info: {
    bg: 'linear-gradient(135deg, #0d1f3d 0%, #1e3a5f 100%)',
    border: '#60a5fa',
    icon: '#60a5fa',
    text: '#dbeafe',
  },
  warning: {
    bg: 'linear-gradient(135deg, #3d2e00 0%, #78350f 100%)',
    border: '#fbbf24',
    icon: '#fbbf24',
    text: '#fef3c7',
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const c = COLORS[toast.type];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}40`,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}20`,
        minWidth: '280px',
        maxWidth: '380px',
        animation: 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer bar at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
          animation: 'toastShimmer 2s linear infinite',
        }}
      />

      {/* Icon circle */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: `${c.border}20`,
          border: `1.5px solid ${c.border}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.icon,
          fontSize: '13px',
          fontWeight: 900,
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <p
        style={{
          flex: 1,
          fontSize: '12.5px',
          fontWeight: 600,
          color: c.text,
          lineHeight: 1.5,
          margin: 0,
          paddingTop: '4px',
          fontFamily: 'inherit',
        }}
      >
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: `${c.text}80`,
          cursor: 'pointer',
          fontSize: '15px',
          lineHeight: 1,
          padding: '0 2px',
          marginTop: '1px',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = c.text)}
        onMouseLeave={(e) => (e.currentTarget.style.color = `${c.text}80`)}
      >
        ×
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      timers.current[id] = setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Keyframes */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastShimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
      `}</style>

      {/* Toast Stack Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
