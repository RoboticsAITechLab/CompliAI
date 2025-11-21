import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Badge, Spinner } from '../../components/ui';
import { billingService } from '../../services/billingService';
import type { BillingPlan } from '../../utils/billingTypes';

const PlanComparison: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlansData();
  }, []);

  const loadPlansData = async () => {
    try {
      setIsLoading(true);
      const [availablePlans, currentSubscription] = await Promise.all([
        billingService.getAvailablePlans(),
        billingService.getCurrentSubscription(),
      ]);
      
      setPlans(availablePlans);
      setCurrentPlanId(currentSubscription.planId);
    } catch (error) {
      console.error('Failed to load plans data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSales = () => {
    window.open('mailto:sales@compliai.com?subject=Enterprise Plan Inquiry', '_blank');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate('/billing')}
            className="mb-4"
          >
            ← Back to Billing
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Compare Plans</h1>
          <p className="text-gray-600 mt-1">Choose the perfect plan for your needs</p>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          
          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.recommended 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : isCurrent
                  ? 'border-2 border-green-500'
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    Recommended
                  </Badge>
                </div>
              )}
              {plan.popular && !plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="info" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="success" className="px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price > 0 ? formatCurrency(plan.price) : 'Free'}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 text-lg">/month</span>
                    )}
                  </div>
                  {plan.isEnterprise && (
                    <p className="text-sm text-gray-600">Custom pricing available</p>
                  )}
                </div>
              </CardHeader>
              
              <CardBody>
                <div className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">API Calls</span>
                      <span className="text-sm font-medium text-gray-900">
                        {plan.features.apiCalls === -1 
                          ? 'Unlimited' 
                          : `${formatNumber(plan.features.apiCalls)}/month`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Overage Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {plan.features.overageRate > 0 
                          ? `${formatCurrency(plan.features.overageRate)}/call`
                          : 'No overage'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Support</span>
                      <span className="text-sm font-medium text-gray-900">
                        {plan.features.support}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Analytics</span>
                      <span className="text-sm font-medium text-gray-900">
                        {plan.features.analytics ? 'Included' : 'Not included'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Custom Integrations</span>
                      <span className="text-sm font-medium text-gray-900">
                        {plan.features.customIntegrations ? 'Included' : 'Not included'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrent ? (
                      <Badge variant="success" className="w-full justify-center py-3 text-sm">
                        Current Plan
                      </Badge>
                    ) : (
                      <Button
                        variant={plan.recommended ? "primary" : "outline"}
                        fullWidth
                        size="md"
                        onClick={() => plan.isEnterprise ? handleContactSales() : navigate('/billing')}
                        className="py-3"
                      >
                        {plan.isEnterprise ? 'Contact Sales' : 'Select Plan'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to overage charges?</h3>
              <p className="text-gray-600 text-sm">
                Overage charges are billed at the end of your billing cycle based on usage above your plan limit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                All new accounts start with our Free plan. Upgrade anytime to access more features and higher limits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Enterprise features?</h3>
              <p className="text-gray-600 text-sm">
                Contact our sales team for custom Enterprise plans with unlimited usage and dedicated support.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PlanComparison;