export const API_DOMAINS = {
  PURCHASE_ORDERS: "/purchase-orders",
  PURCHASE_ORDER_STATUS: "/purchase-orders/:id/status",
  SUPPLY_ORDERS: "/supply-orders",
} as const;

export const QUERY_KEYS = {
  PURCHASE_ORDERS: "purchase-orders",
  SUPPLY_ORDERS: "supply-orders",
} as const;
