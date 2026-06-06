/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  adminId?: string;
  createdAt: string;
}

export type FoodCategory = 'chicken' | 'rolls' | 'burgers' | 'shawarma' | 'bread';

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'delivered' | 'cancelled';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface AdminAnalytics {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  activeCustomers: number;
}
