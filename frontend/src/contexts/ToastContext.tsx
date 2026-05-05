import { createContext, useContext, useState } from 'react';
import { Toast } from '../components/ui/Toast';

type ToastContextValue = {
  pushToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const pushToast = (msg: string) => setMessage(msg);
  const clearToast = () => setMessage(null);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <Toast message={message} onClose={clearToast} />
    </ToastContext.Provider>
  );
};
