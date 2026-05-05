import { useState } from 'react';
import { usePostOrder } from '@/services/orders/mutation/usePostOrder';
import { API_PRODUCT_TYPE } from '@/types/order';
import type { OrderFormErrors, OrderFormState } from '@/types/order';

const INITIAL_STATE: OrderFormState = {
  customer: '',
  product: '1L Bottle',
  qty: '',
  notes: '',
};

export const useOrderForm = (onSuccess: () => void) => {
  const [form, setForm] = useState<OrderFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = usePostOrder();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    setApiError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const errs: OrderFormErrors = {};
    if (!form.customer.trim()) errs.customer = 'Required';
    if (!form.qty || Number(form.qty) <= 0) errs.qty = 'Enter a positive number';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    mutate(
      {
        customer_name: form.customer.trim(),
        product_type: API_PRODUCT_TYPE[form.product],
        quantity: Number(form.qty),
        notes: form.notes.trim() || undefined,
      },
      {
        onSuccess: () => { onSuccess(); reset(); },
        onError: () => setApiError('Failed to create order. Please try again.'),
      },
    );
  };

  return { form, errors, apiError, handleChange, handleSubmit, reset, isPending };
};
