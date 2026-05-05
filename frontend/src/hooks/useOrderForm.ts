import { useState } from 'react';
import {
  PRODUCT_MAP,
  type CreateOrderDto,
  type OrderFormErrors,
  type OrderFormState,
} from '../types/order';

const INITIAL_STATE: OrderFormState = {
  customer: '',
  product: '1L Bottle',
  qty: '',
  notes: '',
};

export const useOrderForm = (onSuccess: (dto: CreateOrderDto) => void) => {
  const [form, setForm] = useState<OrderFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<OrderFormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: OrderFormErrors = {};
    if (!form.customer.trim()) errs.customer = 'Required';
    if (!form.qty || Number(form.qty) <= 0) errs.qty = 'Enter a positive number';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    onSuccess({
      customer: form.customer.trim(),
      product: PRODUCT_MAP[form.product],
      productType: form.product,
      qty: Number(form.qty),
      orderDate: new Date().toISOString().slice(0, 10),
      expectedStart: null,
      eta: null,
      status: 'Pending',
      notes: form.notes.trim() || null,
    });
    reset();
  };

  return { form, errors, handleChange, handleSubmit, reset };
};
