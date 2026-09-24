import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg) => showToast(msg, 'error', 5000), [showToast]);
  const info = useCallback((msg) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100% - 3rem)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: {
              border: '#10b981',
              bg: 'rgba(16, 185, 129, 0.95)',
              icon: <CheckCircle2 size={20} color="#fff" />
            },
            error: {
              border: '#ef4444',
              bg: 'rgba(239, 68, 68, 0.95)',
              icon: <AlertCircle size={20} color="#fff" />
            },
            warning: {
              border: '#f59e0b',
              bg: 'rgba(245, 158, 11, 0.95)',
              icon: <AlertTriangle size={20} color="#fff" />
            },
            info: {
              border: '#3b82f6',
              bg: 'rgba(59, 130, 246, 0.95)',
              icon: <Info size={20} color="#fff" />
            }
          };

          const currentStyle = typeStyles[toast.type] || typeStyles.info;

          return (
            <div
              key={toast.id}
              style={{
                background: currentStyle.bg,
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                pointerEvents: 'auto',
                animation: 'scaleIn 0.2s ease-out'
              }}
            >
              <div style={{ flexShrink: 0 }}>{currentStyle.icon}</div>
              <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
