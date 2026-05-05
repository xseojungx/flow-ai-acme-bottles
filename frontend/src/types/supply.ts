// — API types —
export type ApiMaterialType = 'PET' | 'PTA' | 'EG';

export type ApiSupplySummary = {
  received:  Record<ApiMaterialType, number>;
  consumed:  Record<ApiMaterialType, number>;
  available: Record<ApiMaterialType, number>;
};
export type ApiSupplyStatus = 'ORDERED' | 'RECEIVED';

export interface ApiSupply {
  id: string;
  material_type: ApiMaterialType;
  quantity: number;
  supplier_name: string | null;
  tracking_number: string | null;
  expected_arrival_at: string;
  created_at: string;
  status: ApiSupplyStatus;
}

export type CreateSupplyApiDto = {
  material_type: ApiMaterialType;
  quantity: number;
  supplier_name?: string;
  tracking_number?: string;
  expected_arrival_at: string;
};

// — Frontend types —
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

export type SupplyFormState = {
  material: SupplyMaterial;
  qty: string;
  supplier: string;
  tracking: string;
  eta: string;
};

export type SupplyFormErrors = {
  qty?: string;
  eta?: string;
};

export const MATERIALS: SupplyMaterial[] = ['PET Resin', 'PTA', 'EG'];

export const MATERIAL_ICON_CLASS: Record<SupplyMaterial, string> = {
  'PET Resin': 'bg-blue-100 text-blue-700',
  PTA: 'bg-violet-100 text-violet-700',
  EG: 'bg-green-100 text-green-700',
};

export const API_MATERIAL_TYPE: Record<SupplyMaterial, ApiMaterialType> = {
  'PET Resin': 'PET',
  PTA: 'PTA',
  EG: 'EG',
};

// — Mapper —
const MATERIAL_TYPE_MAP: Record<ApiMaterialType, SupplyMaterial> = {
  PET: 'PET Resin',
  PTA: 'PTA',
  EG: 'EG',
};

const SUPPLY_STATUS_MAP: Record<ApiSupplyStatus, SupplyStatus> = {
  ORDERED: 'Ordered',
  RECEIVED: 'Received',
};

export const mapApiSupply = (api: ApiSupply): Supply => ({
  id: api.id,
  material: MATERIAL_TYPE_MAP[api.material_type],
  qty: api.quantity / 1000,
  supplier: api.supplier_name ?? '—',
  tracking: api.tracking_number ?? '—',
  orderDate: api.created_at.slice(0, 10),
  eta: api.expected_arrival_at.slice(0, 10),
  status: SUPPLY_STATUS_MAP[api.status],
});
