// Mock data for dashboard and other components
// This will be replaced with actual API calls later

export interface ComplianceMetric {
  label: string;
  count: number;
  percentage: number;
  variant: 'success' | 'warning' | 'danger';
}

export interface DomainCompliance {
  domain: string;
  percentage: number;
  compliant: number;
  total: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'policy' | 'control' | 'evidence' | 'assessment';
  message: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

export interface Policy {
  id: string;
  name: string;
  fileName: string;
  standard: string;
  uploadDate: string;
  lastModified: string;
  status: 'analyzed' | 'pending' | 'processing' | 'failed';
  size: string;
  version: string;
  complianceScore?: number;
  controlsMapped?: number;
  totalControls?: number;
}

export const dashboardMetrics: ComplianceMetric[] = [
  {
    label: 'Compliant',
    count: 32,
    percentage: 64,
    variant: 'success'
  },
  {
    label: 'Partial',
    count: 15,
    percentage: 30,
    variant: 'warning'
  },
  {
    label: 'Missing',
    count: 41,
    percentage: 82,
    variant: 'danger'
  }
];

export const domainCompliance: DomainCompliance[] = [
  {
    domain: 'Security',
    percentage: 72,
    compliant: 18,
    total: 25,
    color: '#3B82F6'
  },
  {
    domain: 'Privacy',
    percentage: 40,
    compliant: 8,
    total: 20,
    color: '#8B5CF6'
  },
  {
    domain: 'Logging',
    percentage: 60,
    compliant: 12,
    total: 20,
    color: '#10B981'
  },
  {
    domain: 'Access Control',
    percentage: 85,
    compliant: 17,
    total: 20,
    color: '#F59E0B'
  }
];

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'policy',
    message: 'Policy "SecurityPolicy_v3" analyzed',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    type: 'control',
    message: 'CC2.1 marked compliant',
    timestamp: '5 minutes ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'evidence',
    message: 'Evidence added for CC1.3',
    timestamp: '12 minutes ago',
    status: 'info'
  },
  {
    id: '4',
    type: 'assessment',
    message: 'SOC2 assessment started',
    timestamp: '1 hour ago',
    status: 'info'
  },
  {
    id: '5',
    type: 'control',
    message: 'CC3.2 requires additional evidence',
    timestamp: '2 hours ago',
    status: 'warning'
  },
  {
    id: '6',
    type: 'policy',
    message: 'DataRetentionPolicy_v2 uploaded',
    timestamp: '3 hours ago',
    status: 'success'
  }
];

export const policies: Policy[] = [
  {
    id: '1',
    name: 'Security Policy',
    fileName: 'SecurityPolicy_v3.pdf',
    standard: 'SOC2',
    uploadDate: '2024-11-15',
    lastModified: '2024-11-15T10:30:00Z',
    status: 'analyzed',
    size: '2.4 MB',
    version: 'v3.0',
    complianceScore: 85,
    controlsMapped: 18,
    totalControls: 25
  },
  {
    id: '2',
    name: 'Data Protection Policy',
    fileName: 'DataPolicy_v1.pdf',
    standard: 'ISO27001',
    uploadDate: '2024-11-14',
    lastModified: '2024-11-14T14:20:00Z',
    status: 'analyzed',
    size: '1.8 MB',
    version: 'v1.0',
    complianceScore: 92,
    controlsMapped: 15,
    totalControls: 18
  },
  {
    id: '3',
    name: 'Access Control Policy',
    fileName: 'AccessPolicy_v2.pdf',
    standard: 'SOC2',
    uploadDate: '2024-11-13',
    lastModified: '2024-11-13T09:45:00Z',
    status: 'analyzed',
    size: '1.2 MB',
    version: 'v2.0',
    complianceScore: 78,
    controlsMapped: 12,
    totalControls: 20
  },
  {
    id: '4',
    name: 'Incident Response Plan',
    fileName: 'IncidentResponse_v1.pdf',
    standard: 'SOC2',
    uploadDate: '2024-11-12',
    lastModified: '2024-11-12T16:15:00Z',
    status: 'processing',
    size: '3.1 MB',
    version: 'v1.0'
  },
  {
    id: '5',
    name: 'Business Continuity Plan',
    fileName: 'BusinessContinuity_v2.pdf',
    standard: 'ISO27001',
    uploadDate: '2024-11-11',
    lastModified: '2024-11-11T11:30:00Z',
    status: 'pending',
    size: '2.7 MB',
    version: 'v2.0'
  },
  {
    id: '6',
    name: 'Privacy Policy',
    fileName: 'PrivacyPolicy_v4.pdf',
    standard: 'GDPR',
    uploadDate: '2024-11-10',
    lastModified: '2024-11-10T13:45:00Z',
    status: 'failed',
    size: '1.5 MB',
    version: 'v4.0'
  }
];

// Controls interface and data
export interface Control {
  id: string;
  title: string;
  description: string;
  framework: string;
  category: string;
  owner: string;
  status: 'Implemented' | 'In Progress' | 'Not Started' | 'Under Review';
  complianceScore: number;
  lastReview: string;
  nextReview: string;
  evidenceCount: number;
}

export const controls: Control[] = [
  {
    id: 'C001',
    title: 'Access Control Management',
    description: 'Implement user access controls and authentication mechanisms',
    framework: 'ISO 27001',
    category: 'Access Control',
    owner: 'John Smith',
    status: 'Implemented',
    complianceScore: 95,
    lastReview: '2024-10-15',
    nextReview: '2025-01-15',
    evidenceCount: 5
  },
  {
    id: 'C002',
    title: 'Data Encryption Standards',
    description: 'Ensure all sensitive data is encrypted at rest and in transit',
    framework: 'SOC 2',
    category: 'Data Protection',
    owner: 'Sarah Johnson',
    status: 'Implemented',
    complianceScore: 92,
    lastReview: '2024-10-20',
    nextReview: '2025-01-20',
    evidenceCount: 3
  },
  {
    id: 'C003',
    title: 'Incident Response Procedures',
    description: 'Establish procedures for security incident response and management',
    framework: 'NIST',
    category: 'Incident Management',
    owner: 'Mike Davis',
    status: 'In Progress',
    complianceScore: 78,
    lastReview: '2024-09-30',
    nextReview: '2024-12-30',
    evidenceCount: 2
  },
  {
    id: 'C004',
    title: 'Backup and Recovery',
    description: 'Implement regular backup procedures and disaster recovery plans',
    framework: 'ISO 27001',
    category: 'Business Continuity',
    owner: 'Lisa Chen',
    status: 'Under Review',
    complianceScore: 85,
    lastReview: '2024-11-01',
    nextReview: '2025-02-01',
    evidenceCount: 4
  },
  {
    id: 'C005',
    title: 'Network Security Monitoring',
    description: 'Monitor network traffic for security threats and anomalies',
    framework: 'PCI DSS',
    category: 'Network Security',
    owner: 'Tom Wilson',
    status: 'Not Started',
    complianceScore: 45,
    lastReview: '2024-08-15',
    nextReview: '2024-11-15',
    evidenceCount: 0
  }
];

// Reports interface and data
export interface Report {
  id: string;
  name: string;
  type: 'compliance' | 'audit' | 'risk' | 'performance';
  framework: string;
  generatedDate: string;
  generatedBy: string;
  status: 'completed' | 'generating' | 'failed';
  format: 'PDF' | 'Excel' | 'Word';
  size: string;
  description: string;
}

export const reports: Report[] = [
  {
    id: 'R001',
    name: 'SOC 2 Compliance Report',
    type: 'compliance',
    framework: 'SOC 2',
    generatedDate: '2024-11-15',
    generatedBy: 'System Admin',
    status: 'completed',
    format: 'PDF',
    size: '2.3 MB',
    description: 'Comprehensive SOC 2 compliance assessment report'
  },
  {
    id: 'R002',
    name: 'ISO 27001 Audit Report',
    type: 'audit',
    framework: 'ISO 27001',
    generatedDate: '2024-11-10',
    generatedBy: 'John Smith',
    status: 'completed',
    format: 'PDF',
    size: '1.8 MB',
    description: 'Annual ISO 27001 internal audit findings and recommendations'
  },
  {
    id: 'R003',
    name: 'Risk Assessment Matrix',
    type: 'risk',
    framework: 'NIST',
    generatedDate: '2024-11-12',
    generatedBy: 'Sarah Johnson',
    status: 'generating',
    format: 'Excel',
    size: '1.2 MB',
    description: 'Current organizational risk assessment and mitigation strategies'
  },
  {
    id: 'R004',
    name: 'GDPR Compliance Dashboard',
    type: 'performance',
    framework: 'GDPR',
    generatedDate: '2024-11-08',
    generatedBy: 'Mike Davis',
    status: 'completed',
    format: 'Excel',
    size: '856 KB',
    description: 'Monthly GDPR compliance metrics and KPI dashboard'
  },
  {
    id: 'R005',
    name: 'PCI DSS Assessment',
    type: 'compliance',
    framework: 'PCI DSS',
    generatedDate: '2024-11-05',
    generatedBy: 'Lisa Chen',
    status: 'failed',
    format: 'Word',
    size: '0 KB',
    description: 'PCI DSS compliance assessment and gap analysis'
  }
];
