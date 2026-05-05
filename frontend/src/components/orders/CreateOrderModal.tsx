import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { useOrderForm } from '@/hooks/useOrderForm';
import { useToast } from '@/contexts/ToastContext';

type CreateOrderModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateOrderModal = ({ open, onClose }: CreateOrderModalProps) => {
  const { pushToast } = useToast();
  const { form, errors, apiError, handleChange, handleSubmit, reset, isPending } =
    useOrderForm(() => {
      pushToast('Purchase order created');
      onClose();
    });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Purchase Order"
      subtitle="Fill in the details below"
      width={480}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {apiError && (
          <p role="alert" className="text-[13px] text-danger">
            {apiError}
          </p>
        )}

        <Field label="Customer Name" htmlFor="customer" required error={errors.customer}>
          <Input
            id="customer"
            name="customer"
            placeholder="e.g. AquaPure Beverages"
            value={form.customer}
            onChange={handleChange}
            autoFocus
          />
        </Field>

        <Field label="Product" htmlFor="product" required>
          <Input as="select" id="product" name="product" value={form.product} onChange={handleChange}>
            <option value="1L Bottle">1L Bottle</option>
            <option value="1G Bottle">1G Bottle</option>
          </Input>
        </Field>

        <Field label="Quantity (Units)" htmlFor="qty" required error={errors.qty}>
          <Input
            id="qty"
            name="qty"
            type="number"
            min="1"
            placeholder="e.g. 50000"
            value={form.qty}
            onChange={handleChange}
          />
        </Field>

        <Field label="Notes" htmlFor="notes">
          <Input
            as="textarea"
            id="notes"
            name="notes"
            rows={3}
            placeholder="Any special requirements..."
            value={form.notes}
            onChange={handleChange}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 pt-1.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-surface border border-base text-ink hover:bg-[var(--color-bg)] hover:border-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-primary text-white hover:bg-[var(--color-primary-600)] shadow-[0_1px_2px_rgba(37,99,235,0.25)] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create PO'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
