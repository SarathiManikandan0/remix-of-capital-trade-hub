export type SubscriptionTier = 'student' | 'beginner' | 'elite';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tier: SubscriptionTier;
  subscriptionStatus: 'active' | 'expired' | 'pending';
  subscriptionExpiry: string;
  avatar?: string;
}

export interface Signal {
  id: string;
  asset: string;
  pair: string;
  type: 'buy' | 'sell';
  entry: number;
  stopLoss: number;
  takeProfit: number[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'closed' | 'pending';
  createdAt: string;
  tier: SubscriptionTier;
  market: 'crypto' | 'forex' | 'stocks';
  result?: 'profit' | 'loss' | 'breakeven';
}

export interface Ticket {
  id: string;
  subject: string;
  type: 'support' | 'payment' | 'subscription';
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  createdAt: string;
  attachments?: string[];
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'crypto' | 'bank';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  plan: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'signal' | 'subscription' | 'support' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  tier: SubscriptionTier;
  duration: string;
  lessons: number;
  image?: string;
}

export interface MarketAnalysis {
  id: string;
  title: string;
  asset: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  content: string;
  tier: SubscriptionTier;
  views: number;
  engagement: number;
  createdAt: string;
  image?: string;
}

export interface Plan {
  id: SubscriptionTier;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: string;
}
