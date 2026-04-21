import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const colors = { success: '#22c55e', error: '#ef4444', info: '#8b5cf6', warning: '#f59e0b' };

  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-custom" style={{ borderLeftColor: colors[type], borderLeftWidth: 3 }}>
      <span style={{ marginRight: 8 }}>{icons[type]}</span>
      {message}
    </div>
  );
}
