export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
}

export interface Product {
  id: string;
  category_id?: number;
  category?: Category;
  name: string;
  slug: string;
  description?: string;
  short_desc?: string;
  price: number;
  sale_price?: number;
  thumbnail?: string;
  images: string[];
  product_type: 'account' | 'key' | 'ebook' | 'other';
  delivery_type: 'auto' | 'manual';
  stock_count: number;
  sold_count: number;
  is_active: boolean;
  is_featured: boolean;
  avg_rating?: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_code: string;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_method?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  item_data?: string;
}
