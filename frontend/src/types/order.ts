export type OrderProduct = '1L Bottle' | '1G Bottle';
export type OrderStatus = 'Pending' | 'In Production' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  po: string;                  // server-generated
  customer: string;
  product: string;             // full display name e.g. '1L Standard Bottle'
  productType: OrderProduct;   // short form used in form e.g. '1L Bottle'
  qty: number;
  orderDate: string;
  expectedStart: string | null;
  eta: string | null;
  status: OrderStatus;
  notes: string | null;
}

export type CreateOrderDto = Omit<Order, 'id' | 'po'>;

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
