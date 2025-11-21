import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Badge, Spinner } from '../../components/ui';
import { billingService } from '../../services/billingService';
import type { BillingSummary, BillingPlan, PlanChangeRequest } from '../../utils/billingTypes';

const BillingOverview: React.FC = () => {
  const navigate = useNavigate();
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [availablePlans, setAvailablePlans] = useState<BillingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setIsLoading(true);
      const [summary, plans] = await Promise.all([
        billingService.getBillingSummary(),
        billingService.getAvailablePlans(),
      ]);
      
      setBillingSummary(summary);
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    if (!billingSummary || planId === billingSummary.subscription.planId) return;

    setIsChangingPlan(true);
    setSelectedPlan(planId);

    try {
      const targetPlan = availablePlans.find(p => p.id === planId);
      
      if (targetPlan?.isEnterprise) {
        // Handle enterprise plan differently
        window.open('mailto:sales@compliai.com?subject=Enterprise Plan Inquiry', '_blank');
        return;
      }

      const request: PlanChangeRequest = {
        targetPlanId: planId,
        effectiveDate: 'next_billing_cycle',
        prorationPreference: 'prorate',
      };

      const result = await billingService.changePlan(request);
      
      if (result.success) {
        // Reload billing data to reflect changes
        await loadBillingData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Plan change failed:', error);
      alert('Failed to change plan. Please try again.');
    } finally {
      setIsChangingPlan(false);
      setSelectedPlan(null);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const result = await billingService.downloadInvoice(invoiceId);
      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!billingSummary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load billing information.</p>
        <Button onClick={loadBillingData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const { subscription, usage, usageBreakdown, recentInvoices } = billingSummary;
  const progressWidth = Math.min(usage.utilizationPercentage, 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage your subscription, usage, and billing history</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/billing/plans')}
            >
              Compare Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/billing/invoices')}
            >
              View All Invoices
            </Button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Next billing date</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan & Usage Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
              <Badge variant="primary">{subscription.plan.name}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(subscription.plan.price)}
                  <span className="text-base font-normal text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-600">
                  Includes {formatNumber(subscription.plan.features.apiCalls)} API calls
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Auto-renew</span>
                  <span className="text-gray-900 font-medium">
                    {subscription.autoRenew ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="success">{subscription.status}</Badge>
                </div>
              </div>

              {billingSummary.paymentMethod && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Payment method</p>
                  <p className="text-sm font-medium text-gray-900">
                    •••• •••• •••• {billingSummary.paymentMethod.last4}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Usage Summary */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Usage This Month</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm text-gray-600">API Calls</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(usage.totalCalls)} / {formatNumber(usage.includedCalls)}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      progressWidth > 90 ? 'bg-red-500' : progressWidth > 75 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ ['width' as keyof React.CSSProperties]: `${progressWidth}%` }}
                  />
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {usage.utilizationPercentage.toFixed(1)}% utilized
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(usage.estimatedCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overage</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(usage.estimatedOverageCost)}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
          <p className="text-sm text-gray-600">Choose the plan that fits your needs</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availablePlans.map((plan) => {
              const isCurrent = plan.id === subscription.planId;
              const isChanging = isChangingPlan && selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative border rounded-lg p-4 transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.recommended && (
                    <Badge variant="primary" className="absolute -top-2 left-4">
                      Recommended
                    </Badge>
                  )}
                  {plan.popular && !plan.recommended && (
                    <Badge variant="info" className="absolute -top-2 left-4">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                        {plan.price > 0 && (
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        {plan.features.apiCalls === -1
                          ? 'Unlimited API calls'
                          : `${formatNumber(plan.features.apiCalls)} API calls`}
                      </p>
                      {plan.features.overageRate > 0 && (
                        <p>
                          {formatCurrency(plan.features.overageRate)} per additional call
                        </p>
                      )}
                      <p>{plan.features.support} support</p>
                    </div>
                    
                    <div className="pt-2">
                      {isCurrent ? (
                        <Badge variant="success" className="w-full justify-center py-2">
                          Current Plan
                        </Badge>
                      ) : (
                        <Button
                          variant={plan.isEnterprise ? "outline" : "primary"}
                          size="sm"
                          fullWidth
                          isLoading={isChanging}
                          onClick={() => handlePlanChange(plan.id)}
                          disabled={isChangingPlan}
                        >
                          {plan.isEnterprise ? 'Contact Sales' : 'Select Plan'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Usage Breakdown</h2>
          <p className="text-sm text-gray-600">API usage by endpoint this month</p>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usageBreakdown.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.displayName}
                        </p>
                        <p className="text-xs text-gray-500">{item.endpoint}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(item.calls)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ ['width' as keyof React.CSSProperties]: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{item.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
          <p className="text-sm text-gray-600">Your recent invoices and payments</p>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{invoice.period}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(invoice.totalCalls)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total)}
                        </p>
                        {invoice.overageAmount > 0 && (
                          <p className="text-xs text-gray-500">
                            +{formatCurrency(invoice.overageAmount)} overage
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BillingOverview;