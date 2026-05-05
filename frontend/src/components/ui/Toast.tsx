import { useEffect } from 'react';

type ToastProps = {
  message: string | null;
  onClose: () => void;
};

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-[18px] py-[11px] rounded-full text-[13px] font-medium flex items-center gap-2 shadow-pop z-[60] animate-toast-in">
      <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
      {message}
    </div>
  );
};
