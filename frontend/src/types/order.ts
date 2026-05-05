// — API types —
export type ApiProductType = 'L1' | 'G1';
export type ApiOrderStatus = 'PENDING' | 'IN_PRODUCTION' | 'COMPLETED';

export interface ApiOrder {
  id: string;
  customer_name: string;
  product_type: ApiProductType;
  quantity: number;
  status: ApiOrderStatus;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
  material_ready_at?: string;
  start_at?: string;
  eta?: string;
  fulfillment_status?: 'ON_TIME' | 'DELAYED' | 'UNABLE_TO_FULFILL';
}

export type CreateOrderApiDto = {
  customer_name: string;
  product_type: ApiProductType;
  quantity: number;
  notes?: string;
};

// — Frontend types —
export type OrderProduct = '1L Bottle' | '1G Bottle';
export type OrderStatus = 'Pending' | 'In Production' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  po: string;
  customer: string;
  product: string;
  productType: OrderProduct;
  qty: number;
  orderDate: string;
  expectedStart: string | null;
  eta: string | null;
  status: OrderStatus;
  notes: string | null;
}

export type OrderFormState = {
  customer: string;
  product: OrderProduct;
  qty: string;
  notes: string;
};

export type OrderFormErrors = {
  customer?: string;
  qty?: string;
};

export const ORDER_PRODUCTS: OrderProduct[] = ['1L Bottle', '1G Bottle'];

export const PRODUCT_MAP: Record<OrderProduct, string> = {
  '1L Bottle': '1L Standard Bottle',
  '1G Bottle': '1G Cooler Jug',
};

export const API_PRODUCT_TYPE: Record<OrderProduct, ApiProductType> = {
  '1L Bottle': 'L1',
  '1G Bottle': 'G1',
};

// — Mapper —
const PRODUCT_TYPE_MAP: Record<ApiProductType, OrderProduct> = {
  L1: '1L Bottle',
  G1: '1G Bottle',
};

const ORDER_STATUS_MAP: Record<ApiOrderStatus, OrderStatus> = {
  PENDING: 'Pending',
  IN_PRODUCTION: 'In Production',
  COMPLETED: 'Completed',
};

export const mapApiOrder = (api: ApiOrder): Order => {
  const productType = PRODUCT_TYPE_MAP[api.product_type];
  return {
    id: api.id,
    po: `PO-${api.id.slice(0, 8).toUpperCase()}`,
    customer: api.customer_name,
    product: PRODUCT_MAP[productType],
    productType,
    qty: api.quantity,
    orderDate: api.created_at.slice(0, 10),
    expectedStart:
      api.status === 'IN_PRODUCTION'
        ? 'Started'
        : (api.start_at?.slice(0, 10) ?? null),
    eta: api.eta?.slice(0, 10) ?? null,
    status: ORDER_STATUS_MAP[api.status],
    notes: api.notes,
  };
};
