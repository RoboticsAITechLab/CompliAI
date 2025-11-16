import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input, Badge, Spinner } from '../../components/ui';
import { policies } from '../../utils/mockData';
import type { Policy } from '../../utils/mockData';

const PolicyList: React.FC = () => {
  const [policyList, setPolicyList] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStandard, setFilterStandard] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate data loading
  useEffect(() => {
    const loadPolicies = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setPolicyList(policies);
      setIsLoading(false);
    };
    
    loadPolicies();
  }, []);

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

  const handleViewPolicy = (policyId: string) => {
    // TODO: Navigate to policy detail view
    console.log('View policy:', policyId);
  };

  const handleAnalyzePolicy = (policyId: string) => {
    // TODO: Start policy analysis
    console.log('Analyze policy:', policyId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const standards = ['all', ...new Set(policies.map(p => p.standard))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" text="Loading policies..." centered />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and analyze your compliance policies
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/policies/upload')}
          className="transform transition-transform hover:scale-105"
        >
          📤 Upload New Policy
        </Button>
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
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              data-percentage={policy.complianceScore}
                              style={{ width: `${policy.complianceScore}%` }}
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
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAnalyzePolicy(policy.id)}
                          disabled={policy.status === 'processing'}
                        >
                          Analyze
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