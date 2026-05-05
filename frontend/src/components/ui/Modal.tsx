import { useEffect, useRef } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, subtitle, width = 480, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Sync open state with the native dialog element
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      className="rounded-lg shadow-pop border border-base p-6 backdrop:bg-black/40"
      style={{ width, maxWidth: 'calc(100vw - 2rem)' }}
      onClose={onClose}
    >
      <header className="mb-5">
        <h2 id="modal-title" className="text-[18px] font-bold tracking-tight text-ink m-0 mb-1">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted m-0">{subtitle}</p>}
      </header>
      {children}
    </dialog>
  );
}
