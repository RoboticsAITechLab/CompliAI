// import { apiClient } from './apiClient'; // TODO: Use when backend is ready
import { policies } from '../utils/mockData';
import type { Policy } from '../utils/mockData';

export interface PolicyUploadData {
  title: string;
  description: string;
  category: string;
  complianceFramework: string;
  effectiveDate: string;
  reviewCycle: string;
  file: File;
}

export interface PolicyAnalysisResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  complianceScore?: number;
  controlsMapped?: number;
  recommendations?: string[];
  gaps?: string[];
}

export interface PolicySearchFilters {
  search?: string;
  standard?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

class PolicyService {
  // private readonly baseURL = '/api/v1/policies'; // TODO: Use when backend is ready

  /**
   * Get all policies with optional filtering
   */
  async getPolicies(filters?: PolicySearchFilters): Promise<Policy[]> {
    try {
      // For now, return mock data with simulated filtering
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get(`${this.baseURL}`, { params: filters });
      // return response.data.data;
      
      let filteredPolicies = [...policies];
      
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPolicies = filteredPolicies.filter(policy => 
            policy.name.toLowerCase().includes(searchLower) ||
            policy.fileName.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.standard && filters.standard !== 'all') {
          filteredPolicies = filteredPolicies.filter(policy => 
            policy.standard === filters.standard
          );
        }
        
        if (filters.status) {
          filteredPolicies = filteredPolicies.filter(policy => 
            policy.status === filters.status
          );
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return filteredPolicies;
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      throw new Error('Failed to load policies');
    }
  }

  /**
   * Get a single policy by ID
   */
  async getPolicyById(id: string): Promise<Policy> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${id}`);
      // return response.data.data;
      
      const policy = policies.find(p => p.id === id);
      if (!policy) {
        throw new Error('Policy not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return policy;
    } catch (error) {
      console.error('Failed to fetch policy:', error);
      throw new Error('Failed to load policy details');
    }
  }

  /**
   * Upload a new policy
   */
  async uploadPolicy(data: PolicyUploadData): Promise<{ policy: Policy; message: string }> {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      // const response = await apiClient.post(`${this.baseURL}/upload`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      // return response.data;
      
      // Simulate upload with mock data
      const newPolicy: Policy = {
        id: `policy-${Date.now()}`,
        name: data.title,
        fileName: data.file.name,
        standard: data.complianceFramework || 'General',
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'processing',
        size: `${Math.round(data.file.size / 1024)} KB`,
        version: '1.0',
        complianceScore: undefined,
        controlsMapped: 0,
        totalControls: 0
      };
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        policy: newPolicy,
        message: 'Policy uploaded successfully and analysis has started.'
      };
    } catch (error) {
      console.error('Failed to upload policy:', error);
      throw new Error('Failed to upload policy. Please try again.');
    }
  }

  /**
   * Start analysis of a policy
   */
  async analyzePolicy(policyId: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post(`${this.baseURL}/${policyId}/analyze`);
      // return response.data;
      
      console.log('Analyzing policy:', policyId); // Use policyId to avoid TS error
      
      // Simulate analysis start
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        message: 'Policy analysis started. You will be notified when it\'s complete.'
      };
    } catch (error) {
      console.error('Failed to start policy analysis:', error);
      throw new Error('Failed to start policy analysis');
    }
  }

  /**
   * Get analysis results for a policy
   */
  async getPolicyAnalysis(policyId: string): Promise<PolicyAnalysisResult> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${policyId}/analysis`);
      // return response.data.data;
      
      // Simulate analysis result
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        id: policyId,
        status: 'completed',
        complianceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        controlsMapped: Math.floor(Math.random() * 20) + 10,
        recommendations: [
          'Consider adding more specific data retention policies',
          'Include incident response procedures',
          'Define clear access control requirements'
        ],
        gaps: [
          'Missing encryption requirements for data at rest',
          'No specific mention of third-party vendor management'
        ]
      };
    } catch (error) {
      console.error('Failed to get policy analysis:', error);
      throw new Error('Failed to load analysis results');
    }
  }

  /**
   * Delete a policy
   */
  async deletePolicy(policyId: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.delete(`${this.baseURL}/${policyId}`);
      // return response.data;
      
      console.log('Deleting policy:', policyId); // Use policyId to avoid TS error
      
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        message: 'Policy deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete policy:', error);
      throw new Error('Failed to delete policy');
    }
  }

  /**
   * Download a policy file
   */
  async downloadPolicy(policyId: string): Promise<{ downloadUrl: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${policyId}/download`);
      // return response.data;
      
      // For now, return a mock download URL
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        downloadUrl: `#policy-${policyId}` // Placeholder URL
      };
    } catch (error) {
      console.error('Failed to get download URL:', error);
      throw new Error('Failed to prepare policy download');
    }
  }
}

export const policyService = new PolicyService();