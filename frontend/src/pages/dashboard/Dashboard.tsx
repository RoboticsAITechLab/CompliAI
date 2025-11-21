import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Badge, Spinner, Button } from '../../components/ui';
import ComplianceCharts from '../../components/charts/ComplianceCharts';
import { reportService } from '../../services/reportService';
import type { ActivityItem, ComplianceMetric, DomainCompliance } from '../../utils/mockData';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [domainData, setDomainData] = useState<DomainCompliance[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Load dashboard data from service
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const summary = await reportService.getDashboardSummary();
      
      setMetrics(summary.metrics);
      setActivities(summary.recentActivity);
      setDomainData(summary.domainCompliance);
    } catch {
      setNotification({
        message: 'Failed to load dashboard data. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      const result = await reportService.generateReport({
        type: 'summary',
        format: 'pdf',
        includeCharts: true
      });
      
      setNotification({
        message: result.message,
        type: 'success'
      });
      
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        navigate('/reports');
      }
    } catch {
      setNotification({
        message: 'Failed to generate report. Please try again.',
        type: 'error'
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      await loadDashboardData();
      setNotification({
        message: 'Dashboard data refreshed successfully',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Failed to refresh data. Please try again.',
        type: 'error'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload-policy':
        navigate('/policies/upload');
        break;
      case 'view-controls':
        navigate('/controls');
        break;
      case 'generate-report':
        handleGenerateReport();
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

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
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
            onClick={handleGenerateReport}
            isLoading={isGeneratingReport}
            disabled={isGeneratingReport || isRefreshing}
            className="transform transition-transform hover:scale-105"
          >
            📊 Generate Report
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleRefreshData}
            isLoading={isRefreshing}
            disabled={isRefreshing || isGeneratingReport}
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
          <ComplianceCharts data={domainData} />
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
          <div
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
            onClick={() => handleQuickAction('upload-policy')}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium text-gray-900">Upload Policy</div>
                <div className="text-xs text-gray-500 mt-1">Add new compliance document</div>
              </CardBody>
            </Card>
          </div>
          
          <div
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
            onClick={() => handleQuickAction('view-controls')}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-sm font-medium text-gray-900">View Controls</div>
                <div className="text-xs text-gray-500 mt-1">Manage SOC2 controls</div>
              </CardBody>
            </Card>
          </div>
          
          <div
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
            onClick={() => handleQuickAction('generate-report')}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900">Generate Report</div>
                <div className="text-xs text-gray-500 mt-1">Export compliance data</div>
              </CardBody>
            </Card>
          </div>
          
          <div
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
            onClick={() => handleQuickAction('settings')}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium text-gray-900">Settings</div>
                <div className="text-xs text-gray-500 mt-1">Configure workspace</div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;