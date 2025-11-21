// Billing and subscription types for CompliAI
export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: {
    apiCalls: number;
    overageRate: number; // per call
    support: string;
    analytics: boolean;
    customIntegrations: boolean;
  };
  recommended?: boolean;
  popular?: boolean;
  isEnterprise?: boolean;
}

export interface CurrentSubscription {
  planId: string;
  plan: BillingPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  cancelAtPeriodEnd?: boolean;
}

export interface UsageSummary {
  currentPeriod: {
    start: string;
    end: string;
  };
  totalCalls: number;
  includedCalls: number;
  overageCalls: number;
  utilizationPercentage: number;
  estimatedCost: number;
  estimatedOverageCost: number;
}

export interface UsageBreakdown {
  endpoint: string;
  displayName: string;
  calls: number;
  cost: number;
  percentage: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  totalCalls: number;
  subtotal: number;
  overageAmount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'failed' | 'processing';
  dueDate: string;
  paidDate?: string;
  downloadUrl?: string;
}

export interface BillingSummary {
  subscription: CurrentSubscription;
  usage: UsageSummary;
  usageBreakdown: UsageBreakdown[];
  recentInvoices: Invoice[];
  nextBillingDate: string;
  paymentMethod?: {
    type: 'card' | 'bank';
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
}

export interface PlanChangeRequest {
  targetPlanId: string;
  effectiveDate: 'immediately' | 'next_billing_cycle';
  prorationPreference: 'prorate' | 'credit';
}

export interface BillingAlert {
  id: string;
  type: 'usage_warning' | 'overage' | 'payment_failed' | 'plan_limit';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actionRequired: boolean;
  dismissible: boolean;
  createdAt: string;
}