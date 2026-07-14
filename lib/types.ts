export interface OrderItem {
  pages?: number;
  designId?: string;
  name: string;
  size: string;
  fit?: string;
  color?: string;
  quantity: number;
  price: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  orderId?: string | null;
  locale: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  stripeSessionId?: string;
  designId?: string | null;
  customerEmail?: string;
  amountTotal: number;
  currency: string;
  status: 'pending' | 'paid' | 'on_hold' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  locale: string;
  shippingCountry: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
}
