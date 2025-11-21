import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Badge, Spinner } from '../../components/ui';
import { billingService } from '../../services/billingService';
import type { Invoice } from '../../utils/billingTypes';

const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
  const pageSize = 10;
  const totalPages = Math.ceil(totalInvoices / pageSize);

  useEffect(() => {
    loadInvoices();
  }, [currentPage]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const result = await billingService.getInvoices(currentPage, pageSize);
      setInvoices(result.invoices);
      setTotalInvoices(result.total);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      setIsDownloading(invoiceId);
      const result = await billingService.downloadInvoice(invoiceId);
      
      if (result.success && result.downloadUrl) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setIsDownloading(null);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">
            View and download your billing history
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
            <p className="text-sm text-gray-500">{totalInvoices} total invoices</p>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No invoices found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice ID: {invoice.id}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {invoice.period}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">
                            {formatNumber(invoice.totalCalls)} calls
                          </p>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {invoice.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={isDownloading === invoice.id}
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              disabled={!!isDownloading}
                            >
                              {isDownloading === invoice.id ? 'Downloading...' : 'Download'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * pageSize + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalInvoices)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{totalInvoices}</span>{' '}
                      invoices
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="text-gray-500">...</span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === totalPages
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Invoices;