export interface OrderItem {
  designId?: string;
  name: string;
  size: string;
  fit?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  stripeSessionId?: string;
  designId?: string | null;
  customerEmail?: string;
  amountTotal: number;
  currency: string;
  status: 'pending' | 'paid' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  locale: string;
  shippingCountry: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
}
