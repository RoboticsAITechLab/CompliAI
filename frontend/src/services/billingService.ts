import type {
  BillingPlan,
  BillingSummary,
  CurrentSubscription,
  UsageSummary,
  UsageBreakdown,
  Invoice,
  PlanChangeRequest,
  BillingAlert,
} from '../utils/billingTypes';

class BillingService {
  private readonly baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  // Mock data for development - replace with real API calls
  private mockPlans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      billingCycle: 'monthly',
      features: {
        apiCalls: 1000,
        overageRate: 0,
        support: 'Community',
        analytics: false,
        customIntegrations: false,
      },
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      currency: 'USD',
      billingCycle: 'monthly',
      features: {
        apiCalls: 10000,
        overageRate: 0.005,
        support: 'Email',
        analytics: true,
        customIntegrations: false,
      },
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: {
        apiCalls: 50000,
        overageRate: 0.005,
        support: 'Priority',
        analytics: true,
        customIntegrations: true,
      },
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0,
      currency: 'USD',
      billingCycle: 'monthly',
      features: {
        apiCalls: -1, // Unlimited
        overageRate: 0,
        support: 'Dedicated',
        analytics: true,
        customIntegrations: true,
      },
      isEnterprise: true,
    },
  ];

  private mockCurrentSubscription: CurrentSubscription = {
    planId: 'pro',
    plan: this.mockPlans.find(p => p.id === 'pro')!,
    status: 'active',
    currentPeriodStart: '2024-12-01T00:00:00Z',
    currentPeriodEnd: '2025-01-01T00:00:00Z',
    autoRenew: true,
  };

  private mockUsageSummary: UsageSummary = {
    currentPeriod: {
      start: '2024-12-01T00:00:00Z',
      end: '2025-01-01T00:00:00Z',
    },
    totalCalls: 18322,
    includedCalls: 50000,
    overageCalls: 0,
    utilizationPercentage: 36.6,
    estimatedCost: 99.0,
    estimatedOverageCost: 0.0,
  };

  private mockUsageBreakdown: UsageBreakdown[] = [
    {
      endpoint: '/api/v1/policies/analyze',
      displayName: 'Policy Analysis',
      calls: 8450,
      cost: 42.25,
      percentage: 46.1,
    },
    {
      endpoint: '/api/v1/controls/check',
      displayName: 'Control Checks',
      calls: 6892,
      cost: 34.46,
      percentage: 37.6,
    },
    {
      endpoint: '/api/v1/reports/generate',
      displayName: 'Report Generation',
      calls: 2980,
      cost: 14.90,
      percentage: 16.3,
    },
  ];

  private mockInvoices: Invoice[] = [
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2024-12-001',
      period: 'December 2024',
      periodStart: '2024-12-01T00:00:00Z',
      periodEnd: '2024-12-31T23:59:59Z',
      totalCalls: 45230,
      subtotal: 99.0,
      overageAmount: 0.0,
      tax: 8.91,
      total: 107.91,
      status: 'paid',
      dueDate: '2024-12-15T00:00:00Z',
      paidDate: '2024-12-14T10:30:00Z',
      downloadUrl: '/api/v1/billing/invoices/inv_001/download',
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2024-11-002',
      period: 'November 2024',
      periodStart: '2024-11-01T00:00:00Z',
      periodEnd: '2024-11-30T23:59:59Z',
      totalCalls: 38940,
      subtotal: 99.0,
      overageAmount: 0.0,
      tax: 8.91,
      total: 107.91,
      status: 'paid',
      dueDate: '2024-11-15T00:00:00Z',
      paidDate: '2024-11-13T09:45:00Z',
      downloadUrl: '/api/v1/billing/invoices/inv_002/download',
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2024-10-003',
      period: 'October 2024',
      periodStart: '2024-10-01T00:00:00Z',
      periodEnd: '2024-10-31T23:59:59Z',
      totalCalls: 52108,
      subtotal: 99.0,
      overageAmount: 10.54,
      tax: 9.86,
      total: 119.40,
      status: 'paid',
      dueDate: '2024-10-15T00:00:00Z',
      paidDate: '2024-10-14T14:20:00Z',
      downloadUrl: '/api/v1/billing/invoices/inv_003/download',
    },
  ];

  /**
   * Get complete billing summary
   */
  async getBillingSummary(): Promise<BillingSummary> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      subscription: this.mockCurrentSubscription,
      usage: this.mockUsageSummary,
      usageBreakdown: this.mockUsageBreakdown,
      recentInvoices: this.mockInvoices,
      nextBillingDate: this.mockCurrentSubscription.currentPeriodEnd,
      paymentMethod: {
        type: 'card',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2027,
      },
    };
  }

  /**
   * Get all available plans
   */
  async getAvailablePlans(): Promise<BillingPlan[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockPlans;
  }

  /**
   * Get current subscription details
   */
  async getCurrentSubscription(): Promise<CurrentSubscription> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockCurrentSubscription;
  }

  /**
   * Get usage summary for current period
   */
  async getUsageSummary(): Promise<UsageSummary> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockUsageSummary;
  }

  /**
   * Get detailed usage breakdown
   */
  async getUsageBreakdown(): Promise<UsageBreakdown[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockUsageBreakdown;
  }

  /**
   * Get billing invoices
   */
  async getInvoices(page = 1, limit = 10): Promise<{ invoices: Invoice[]; total: number }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      invoices: this.mockInvoices.slice(startIndex, endIndex),
      total: this.mockInvoices.length,
    };
  }

  /**
   * Get billing alerts
   */
  async getBillingAlerts(): Promise<BillingAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return mock alerts based on current usage
    const alerts: BillingAlert[] = [];
    
    if (this.mockUsageSummary.utilizationPercentage > 80) {
      alerts.push({
        id: 'usage_warning_001',
        type: 'usage_warning',
        severity: 'warning',
        title: 'High API Usage',
        message: `You've used ${this.mockUsageSummary.utilizationPercentage.toFixed(1)}% of your monthly API quota.`,
        actionRequired: false,
        dismissible: true,
        createdAt: new Date().toISOString(),
      });
    }
    
    return alerts;
  }

  /**
   * Request plan change
   */
  async changePlan(request: PlanChangeRequest): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate plan change logic
    const targetPlan = this.mockPlans.find(p => p.id === request.targetPlanId);
    
    if (!targetPlan) {
      return {
        success: false,
        message: 'Invalid plan selected',
      };
    }

    if (targetPlan.isEnterprise) {
      return {
        success: false,
        message: 'Please contact sales for Enterprise plan upgrade',
      };
    }

    return {
      success: true,
      message: `Successfully scheduled plan change to ${targetPlan.name}`,
    };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(cancelAtPeriodEnd = true): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current billing period'
        : 'Subscription cancelled immediately',
    };
  }

  /**
   * Download invoice
   */
  async downloadInvoice(invoiceId: string): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
      return {
        success: false,
        message: 'Invoice not found',
      };
    }

    return {
      success: true,
      downloadUrl: `${this.baseUrl}${invoice.downloadUrl}`,
      message: 'Invoice download started',
    };
  }
}

// Export singleton instance
export const billingService = new BillingService();
export default billingService;