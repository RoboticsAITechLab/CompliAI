import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input, Badge, Spinner } from '../../components/ui';
import { policyService } from '../../services/policyService';
import type { Policy } from '../../utils/mockData';

const PolicyList: React.FC = () => {
  const [policyList, setPolicyList] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStandard, setFilterStandard] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPolicyId, setLoadingPolicyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Load policies from service
  useEffect(() => {
    loadPolicies();
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

  const loadPolicies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters = {
        search: searchTerm || undefined,
        standard: filterStandard !== 'all' ? filterStandard : undefined
      };
      const policies = await policyService.getPolicies(filters);
      setPolicyList(policies);
    } catch (err: any) {
      setError(err.message || 'Failed to load policies');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload policies when filters change (debounced)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!isLoading) {
        loadPolicies();
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterStandard]);

  // Filter policies using useMemo to avoid cascading renders
  const filteredPolicies = useMemo(() => {
    let filtered = policyList;
    
    if (searchTerm) {
      filtered = filtered.filter(policy => 
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStandard !== 'all') {
      filtered = filtered.filter(policy => policy.standard === filterStandard);
    }
    
    return filtered;
  }, [policyList, searchTerm, filterStandard]);

  const getStatusBadgeVariant = (status: Policy['status']) => {
    switch (status) {
      case 'analyzed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const handleViewPolicy = async (policyId: string) => {
    try {
      setLoadingPolicyId(policyId);
      const policy = await policyService.getPolicyById(policyId);
      // For now, navigate to a policy detail page (placeholder)
      navigate(`/policies/${policyId}`, { state: { policy } });
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to load policy details',
        type: 'error'
      });
    } finally {
      setLoadingPolicyId(null);
    }
  };

  const handleAnalyzePolicy = async (policyId: string) => {
    try {
      setLoadingPolicyId(policyId);
      const result = await policyService.analyzePolicy(policyId);
      setNotification({
        message: result.message,
        type: 'success'
      });
      // Update the policy status in the list
      setPolicyList(prev => prev.map(policy => 
        policy.id === policyId 
          ? { ...policy, status: 'processing' }
          : policy
      ));
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to start policy analysis',
        type: 'error'
      });
    } finally {
      setLoadingPolicyId(null);
    }
  };

  const handleRefreshPolicies = () => {
    loadPolicies();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get unique standards for filter dropdown
  const standards = ['all', ...new Set(policyList.map((p: Policy) => p.standard))] as string[];

  if (isLoading && policyList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" text="Loading policies..." centered />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Error State */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Policies</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefreshPolicies}
              isLoading={isLoading}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and analyze your compliance policies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefreshPolicies}
            isLoading={isLoading}
            disabled={isLoading}
            className="transform transition-transform hover:scale-105"
          >
            🔄 Refresh
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/policies/upload')}
            className="transform transition-transform hover:scale-105"
          >
            📤 Upload New Policy
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search policies by name or filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<span className="text-gray-400">🔍</span>}
              />
            </div>
            <div className="sm:w-48">
              <label htmlFor="standard-filter" className="sr-only">Filter by standard</label>
              <select
                id="standard-filter"
                value={filterStandard}
                onChange={(e) => setFilterStandard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {standards.map(standard => (
                  <option key={standard} value={standard}>
                    {standard === 'all' ? 'All Standards' : standard}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Policy Documents</h2>
            <Badge variant="info" size="sm">{filteredPolicies.length} policies</Badge>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                        <div className="text-sm text-gray-500">
                          {policy.fileName} • {policy.size}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" size="sm">{policy.standard}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(policy.uploadDate)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(policy.status)} size="sm">
                        {policy.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {policy.complianceScore ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div
                              className={`bg-blue-600 h-2 rounded-full transition-all duration-300 w-[${policy.complianceScore}%]`}
                              data-percentage={policy.complianceScore}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {policy.complianceScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPolicy(policy.id)}
                          isLoading={loadingPolicyId === policy.id && loadingPolicyId !== null}
                          disabled={loadingPolicyId !== null}
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAnalyzePolicy(policy.id)}
                          isLoading={loadingPolicyId === policy.id && loadingPolicyId !== null}
                          disabled={policy.status === 'processing' || loadingPolicyId !== null}
                        >
                          {policy.status === 'processing' ? 'Processing...' : 'Analyze'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPolicies.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No policies found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStandard !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Upload your first policy to get started with compliance analysis.'
                  }
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/policies/upload')}
                >
                  Upload Policy
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PolicyList;