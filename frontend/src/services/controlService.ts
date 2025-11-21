// import { apiClient } from './apiClient'; // TODO: Use when backend is ready
import { controls } from '../utils/mockData';
import type { Control } from '../utils/mockData';

export interface ControlUpdateData {
  title?: string;
  description?: string;
  status?: string;
  implementationNotes?: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface EvidenceUploadData {
  controlId: string;
  files: File[];
  description?: string;
  evidenceType: 'document' | 'screenshot' | 'configuration' | 'other';
}

export interface ControlFilter {
  framework?: string;
  status?: string;
  assignee?: string;
  search?: string;
  dueDate?: {
    start: string;
    end: string;
  };
}

export interface ControlAssessment {
  id: string;
  controlId: string;
  assessmentDate: string;
  assessor: string;
  score: number;
  findings: string[];
  recommendations: string[];
  status: 'passed' | 'failed' | 'needs_improvement';
}

class ControlService {
  // private readonly baseURL = '/api/v1/controls'; // TODO: Use when backend is ready

  /**
   * Get all controls with optional filtering
   */
  async getControls(filters?: ControlFilter): Promise<Control[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}`, { params: filters });
      // return response.data.data;
      
      let filteredControls = [...controls];
      
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredControls = filteredControls.filter(control => 
            control.title.toLowerCase().includes(searchLower) ||
            control.description.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.framework) {
          filteredControls = filteredControls.filter(control => 
            control.framework === filters.framework
          );
        }
        
        if (filters.status) {
          filteredControls = filteredControls.filter(control => 
            control.status === filters.status
          );
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return filteredControls;
    } catch (error) {
      console.error('Failed to fetch controls:', error);
      throw new Error('Failed to load controls');
    }
  }

  /**
   * Get a single control by ID
   */
  async getControlById(id: string): Promise<Control> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${id}`);
      // return response.data.data;
      
      const control = controls.find(c => c.id === id);
      if (!control) {
        throw new Error('Control not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return control;
    } catch (error) {
      console.error('Failed to fetch control:', error);
      throw new Error('Failed to load control details');
    }
  }

  /**
   * Update a control
   */
  async updateControl(id: string, data: ControlUpdateData): Promise<{ control: Control; message: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.put(`${this.baseURL}/${id}`, data);
      // return response.data;
      
      const control = controls.find(c => c.id === id);
      if (!control) {
        throw new Error('Control not found');
      }
      
      const updatedControl: Control = {
        ...control,
        ...data,
        status: (data.status as Control['status']) || control.status, // Type assertion for status
        lastModified: new Date().toISOString()
      } as Control;
      
      // Simulate update delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        control: updatedControl,
        message: 'Control updated successfully'
      };
    } catch (error) {
      console.error('Failed to update control:', error);
      throw new Error('Failed to update control');
    }
  }

  /**
   * Upload evidence for a control
   */
  async uploadEvidence(data: EvidenceUploadData): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // data.files.forEach(file => formData.append('files', file));
      // formData.append('controlId', data.controlId);
      // formData.append('description', data.description || '');
      // formData.append('evidenceType', data.evidenceType);
      // const response = await apiClient.post(`${this.baseURL}/${data.controlId}/evidence`, formData);
      // return response.data;
      
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        message: `Successfully uploaded ${data.files.length} evidence file(s) for control`
      };
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      throw new Error('Failed to upload evidence files');
    }
  }

  /**
   * Get evidence for a control
   */
  async getControlEvidence(controlId: string): Promise<Array<{
    id: string;
    fileName: string;
    uploadDate: string;
    type: string;
    size: string;
  }>> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${controlId}/evidence`);
      // return response.data.data;
      
      console.log('Getting evidence for control:', controlId); // Use controlId to avoid TS error
      
      // Return mock evidence data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 'ev1',
          fileName: 'security-policy-v2.pdf',
          uploadDate: '2024-01-15',
          type: 'document',
          size: '2.4 MB'
        },
        {
          id: 'ev2', 
          fileName: 'firewall-config.png',
          uploadDate: '2024-01-10',
          type: 'screenshot',
          size: '1.2 MB'
        }
      ];
    } catch (error) {
      console.error('Failed to get control evidence:', error);
      throw new Error('Failed to load evidence');
    }
  }

  /**
   * Create new control assessment
   */
  async createAssessment(controlId: string, assessment: Omit<ControlAssessment, 'id' | 'controlId'>): Promise<{ assessment: ControlAssessment; message: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post(`${this.baseURL}/${controlId}/assessments`, assessment);
      // return response.data;
      
      const newAssessment: ControlAssessment = {
        id: `assessment-${Date.now()}`,
        controlId,
        ...assessment
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        assessment: newAssessment,
        message: 'Control assessment completed successfully'
      };
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw new Error('Failed to create control assessment');
    }
  }

  /**
   * Get control assessments history
   */
  async getControlAssessments(controlId: string): Promise<ControlAssessment[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/${controlId}/assessments`);
      // return response.data.data;
      
      // Return mock assessment history
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 'assess1',
          controlId,
          assessmentDate: '2024-01-15',
          assessor: 'John Doe',
          score: 95,
          findings: ['All security controls properly implemented'],
          recommendations: ['Consider automated monitoring'],
          status: 'passed'
        }
      ];
    } catch (error) {
      console.error('Failed to get assessments:', error);
      throw new Error('Failed to load assessment history');
    }
  }

  /**
   * Get control statistics
   */
  async getControlStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byFramework: Record<string, number>;
    averageCompliance: number;
  }> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get(`${this.baseURL}/stats`);
      // return response.data.data;
      
      // Calculate stats from mock data
      const total = controls.length;
      const byStatus = controls.reduce((acc, control) => {
        acc[control.status] = (acc[control.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const byFramework = controls.reduce((acc, control) => {
        acc[control.framework] = (acc[control.framework] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const averageCompliance = Math.round(
        controls.reduce((sum, control) => sum + control.complianceScore, 0) / total
      );
      
      await new Promise(resolve => setTimeout(resolve, 250));
      
      return {
        total,
        byStatus,
        byFramework,
        averageCompliance
      };
    } catch (error) {
      console.error('Failed to get control stats:', error);
      throw new Error('Failed to load control statistics');
    }
  }
}

export const controlService = new ControlService();