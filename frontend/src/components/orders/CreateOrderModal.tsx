import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { useOrderForm } from '../../hooks/useOrderForm';
import type { CreateOrderDto } from '../../types/order';

type CreateOrderModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreateOrderDto) => void;
};

export const CreateOrderModal = ({ open, onClose, onCreate }: CreateOrderModalProps) => {
  const { form, errors, handleChange, handleSubmit, reset } = useOrderForm((dto) => {
    onCreate(dto);
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
            className="px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-surface border border-base text-ink hover:bg-[var(--color-bg)] hover:border-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-md text-[13.5px] font-semibold bg-primary text-white hover:bg-[var(--color-primary-600)] shadow-[0_1px_2px_rgba(37,99,235,0.25)] transition-colors"
          >
            Create PO
          </button>
        </div>
      </form>
    </Modal>
  );
};
