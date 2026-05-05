import { useState } from 'react';
import { usePostSupply } from '@/services/supplies/mutation/usePostSupply';
import { API_MATERIAL_TYPE } from '@/types/supply';
import type { SupplyFormErrors, SupplyFormState } from '@/types/supply';

const INITIAL_STATE: SupplyFormState = {
  material: 'PET Resin',
  qty: '',
  supplier: '',
  tracking: '',
  eta: '',
};

export const useSupplyForm = (onSuccess: () => void) => {
  const [form, setForm] = useState<SupplyFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<SupplyFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = usePostSupply();

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

    const errs: SupplyFormErrors = {};
    if (!form.qty || Number(form.qty) <= 0) errs.qty = 'Enter a positive number';
    if (!form.eta) errs.eta = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    mutate(
      {
        material_type: API_MATERIAL_TYPE[form.material],
        quantity: Number(form.qty) * 1000,
        supplier_name: form.supplier.trim() || undefined,
        tracking_number: form.tracking.trim() || undefined,
        expected_arrival_at: `${form.eta}T00:00:00.000Z`,
      },
      {
        onSuccess: () => { onSuccess(); reset(); },
        onError: () => setApiError('Failed to place supply order. Please try again.'),
      },
    );
  };

  return { form, errors, apiError, handleChange, handleSubmit, reset, isPending };
};
