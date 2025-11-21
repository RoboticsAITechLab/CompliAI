import React from 'react';
import { Card, CardHeader, CardBody } from '../ui';
import type { DomainCompliance } from '../../utils/mockData';

interface ComplianceChartsProps {
  data: DomainCompliance[];
  className?: string;
}

const ComplianceCharts: React.FC<ComplianceChartsProps> = ({ data, className = '' }) => {

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Compliance by Domain</h3>
        <p className="text-sm text-gray-600">Current compliance status across security domains</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {data.map((domain) => (
            <div key={domain.domain} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {domain.domain}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {domain.compliant}/{domain.total}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {domain.percentage}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${domain.percentage}%`,
                      backgroundColor: domain.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            {data.map((domain) => (
              <div key={domain.domain} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full bg-blue-500"
                  style={{ backgroundColor: domain.color }}
                />
                <span className="text-xs text-gray-600">{domain.domain}</span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ComplianceCharts;