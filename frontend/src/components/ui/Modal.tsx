import { useEffect } from 'react';
import { Icon } from './Icon';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number;
  children: React.ReactNode;
};

export const Modal = ({ open, onClose, title, subtitle, width = 480, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-surface rounded-lg shadow-pop max-w-[92vw] max-h-[92vh] overflow-hidden flex flex-col animate-pop-in"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-[22px] pb-3">
          <div>
            <div id="modal-title" className="text-[17px] font-bold text-ink tracking-[-0.01em]">
              {title}
            </div>
            {subtitle && <div className="text-[13px] text-muted mt-0.5">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 grid place-items-center rounded-md text-muted hover:bg-[var(--color-bg)] hover:text-ink transition-colors"
          >
            <Icon.Close width="18" height="18" />
          </button>
        </div>
        <div className="px-6 pb-[22px] pt-1.5 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
