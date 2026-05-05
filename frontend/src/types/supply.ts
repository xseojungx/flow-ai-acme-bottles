export type SupplyMaterial = 'PET Resin' | 'PTA' | 'EG';
export type SupplyStatus = 'Ordered' | 'Received';

export interface Supply {
  id: string;
  material: SupplyMaterial;
  qty: number;
  supplier: string;
  tracking: string;
  orderDate: string;
  eta: string | null;
  status: SupplyStatus;
}

export type CreateSupplyDto = Omit<Supply, 'id'>;

export type SupplyFormState = {
  material: SupplyMaterial;
  qty: string;
  supplier: string;
  tracking: string;
  eta: string;
};

export type SupplyFormErrors = {
  qty?: string;
};

export const MATERIALS: SupplyMaterial[] = ['PET Resin', 'PTA', 'EG'];

export const MATERIAL_ICON_CLASS: Record<SupplyMaterial, string> = {
  'PET Resin': 'bg-blue-100 text-blue-700',
  PTA: 'bg-violet-100 text-violet-700',
  EG: 'bg-green-100 text-green-700',
};
