import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { useSupplyForm } from '../../hooks/useSupplyForm';
import type { CreateSupplyDto } from '../../types/supply';

type CreateSupplyModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: CreateSupplyDto) => void;
};

export function CreateSupplyModal({ open, onClose, onCreate }: CreateSupplyModalProps) {
  const { form, errors, handleChange, handleSubmit, reset } = useSupplyForm((dto) => {
    onCreate(dto);
    onClose();
  });

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Supply Order"
      subtitle="Fill in the order details"
      width={520}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <Field label="Material" htmlFor="material" required>
            <Input as="select" id="material" name="material" value={form.material} onChange={handleChange}>
              <option>PET Resin</option>
              <option>PTA</option>
              <option>EG</option>
            </Input>
          </Field>
          <Field label="Quantity (kg)" htmlFor="qty" required error={errors.qty}>
            <Input
              id="qty"
              name="qty"
              type="number"
              min="1"
              placeholder="e.g. 5000"
              value={form.qty}
              onChange={handleChange}
              autoFocus
            />
          </Field>
        </div>

        <Field label="Supplier Name" htmlFor="supplier">
          <Input
            id="supplier"
            name="supplier"
            placeholder="e.g. Global Resin Co."
            value={form.supplier}
            onChange={handleChange}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <Field label="Tracking Number" htmlFor="tracking">
            <Input
              id="tracking"
              name="tracking"
              placeholder="e.g. TRK-00123"
              value={form.tracking}
              onChange={handleChange}
            />
          </Field>
          <Field label="ETA" htmlFor="eta">
            <Input
              id="eta"
              name="eta"
              type="date"
              value={form.eta}
              onChange={handleChange}
            />
          </Field>
        </div>

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
            Place Order
          </button>
        </div>
      </form>
    </Modal>
  );
}
