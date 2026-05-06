export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  suspended?: boolean;
  preferredCurrency?: string;
  createdAt?: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
  source: 'manual' | 'connected';
  connectionType?: 'mtn' | 'bank';
}

export interface Category {
  _id: string;
  name: string;
  isDefault: boolean;
}

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  month: string;
}

export interface Goal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string | null;
}

export interface UserConnection {
  _id: string;
  type: 'mtn' | 'bank';
  status: string;
  bankId?: string;
  bankName?: string;
  accountNumber?: string;
  lastSyncedAt?: string | null;
  displayName?: string;
}

export interface Alert {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  provider: string;
  category: string;
  amount: number;
  currency: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  description?: string;
  website?: string;
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
