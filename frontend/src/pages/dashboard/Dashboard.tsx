import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Badge, Spinner, Button } from '../../components/ui';
import ComplianceCharts from '../../components/charts/ComplianceCharts';
import { dashboardMetrics, domainCompliance, recentActivity } from '../../utils/mockData';
import type { ActivityItem, ComplianceMetric } from '../../utils/mockData';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics(dashboardMetrics);
      setActivities(recentActivity);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
      policy: '📋',
      control: '🛡️',
      evidence: '📎',
      assessment: '📊'
    };
    return icons[type];
  };

  const getStatusBadgeVariant = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" text="Loading dashboard..." centered />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Compliance overview and recent activity
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="transform transition-transform hover:scale-105"
          >
            📊 Generate Report
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            className="transform transition-transform hover:scale-105"
          >
            🔄 Refresh Data
          </Button>
        </div>
      </div>

      {/* Compliance Overview Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Compliance Overview</h2>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.label} className="hover:shadow-lg transition-shadow duration-200">
              <CardBody className="text-center p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.count}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-3">
                  {metric.label}
                </div>
                <Badge 
                  variant={metric.variant}
                  className="text-xs px-3 py-1"
                >
                  {metric.percentage}% of total
                </Badge>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Chart */}
        <div className="lg:col-span-2">
          <ComplianceCharts data={domainCompliance} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Badge variant="info" size="sm">{activities.length}</Badge>
              </div>
              <p className="text-sm text-gray-600">Latest compliance updates</p>
            </CardHeader>
            <CardBody className="p-0">
              <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-5">
                          {activity.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {activity.timestamp}
                          </p>
                          {activity.status && (
                            <Badge 
                              variant={getStatusBadgeVariant(activity.status)}
                              size="sm"
                            >
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All Button */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Button variant="outline" size="sm" fullWidth>
                  View All Activity
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
            <CardBody className="text-center p-6">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-gray-900">Upload Policy</div>
              <div className="text-xs text-gray-500 mt-1">Add new compliance document</div>
            </CardBody>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
            <CardBody className="text-center p-6">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-sm font-medium text-gray-900">View Controls</div>
              <div className="text-xs text-gray-500 mt-1">Manage SOC2 controls</div>
            </CardBody>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
            <CardBody className="text-center p-6">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Generate Report</div>
              <div className="text-xs text-gray-500 mt-1">Export compliance data</div>
            </CardBody>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1">
            <CardBody className="text-center p-6">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-gray-900">Settings</div>
              <div className="text-xs text-gray-500 mt-1">Configure workspace</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;