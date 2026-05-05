import { useState } from 'react';
import type { CreateSupplyDto, SupplyFormErrors, SupplyFormState } from '../types/supply';

const INITIAL_STATE: SupplyFormState = {
  material: 'PET Resin',
  qty: '',
  supplier: '',
  tracking: '',
  eta: '',
};

export function useSupplyForm(onSuccess: (dto: CreateSupplyDto) => void) {
  const [form, setForm] = useState<SupplyFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<SupplyFormErrors>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function reset() {
    setForm(INITIAL_STATE);
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: SupplyFormErrors = {};
    if (!form.qty || Number(form.qty) <= 0) errs.qty = 'Enter a positive number';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    onSuccess({
      material: form.material,
      qty: Number(form.qty),
      supplier: form.supplier.trim() || '—',
      tracking: form.tracking.trim() || '—',
      orderDate: new Date().toISOString().slice(0, 10),
      eta: form.eta || null,
      status: 'Ordered',
    });
    reset();
  }

  return { form, errors, handleChange, handleSubmit, reset };
}
