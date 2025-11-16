import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { reports } from '../../utils/mockData';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.framework.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'generating': return 'warning';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compliance': return 'primary';
      case 'audit': return 'info';
      case 'risk': return 'warning';
      case 'performance': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Generate and manage compliance reports</p>
        </div>
        <Button>
          Generate New Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'generating').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                {reports.filter(r => new Date(r.generatedDate).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Filter by report type"
            >
              <option value="">All Types</option>
              <option value="compliance">Compliance</option>
              <option value="audit">Audit</option>
              <option value="risk">Risk</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant={getTypeColor(report.type) as 'primary' | 'info' | 'warning' | 'success' | 'default'} size="sm">
                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                </Badge>
                <Badge variant={getStatusColor(report.status) as 'success' | 'warning' | 'danger' | 'default'} size="sm">
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">{report.name}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">{report.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Framework:</span>
                <span className="text-slate-900 font-medium">{report.framework}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Generated:</span>
                <span className="text-slate-900">{new Date(report.generatedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Size:</span>
                <span className="text-slate-900">{report.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Format:</span>
                <span className="text-slate-900">{report.format}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Generated By:</span>
                <span className="text-slate-900">{report.generatedBy}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {report.status === 'completed' ? (
                <>
                  <Button variant="primary" size="sm" fullWidth>
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                </>
              ) : report.status === 'generating' ? (
                <Button variant="outline" size="sm" fullWidth isLoading>
                  Generating...
                </Button>
              ) : (
                <Button variant="outline" size="sm" fullWidth disabled>
                  Failed to Generate
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your search criteria or generate a new report.</p>
          <Button>Generate New Report</Button>
        </Card>
      )}
    </div>
  );
}