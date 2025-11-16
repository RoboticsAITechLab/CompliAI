import React, { useState, useRef } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  lastModified: Date;
}

interface PolicyMetadata {
  title: string;
  description: string;
  category: string;
  complianceFramework: string;
  effectiveDate: string;
  reviewCycle: string;
}

function PolicyUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [metadata, setMetadata] = useState<PolicyMetadata>({
    title: '',
    description: '',
    category: '',
    complianceFramework: '',
    effectiveDate: '',
    reviewCycle: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const,
      lastModified: new Date(file.lastModified),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100);
            const status = newProgress === 100 ? 'complete' : 'uploading';
            return { ...file, progress: newProgress, status };
          }
          return file;
        })
      );
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId ? { ...file, progress: 100, status: 'complete' } : file
        )
      );
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMetadataChange = (field: keyof PolicyMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!metadata.title || !metadata.category || uploadedFiles.length === 0) {
      alert('Please fill in required fields and upload at least one file.');
      return;
    }

    // Simulate policy creation
    console.log('Creating policy with metadata:', metadata);
    console.log('Uploaded files:', uploadedFiles);
    
    // Reset form
    setMetadata({
      title: '',
      description: '',
      category: '',
      complianceFramework: '',
      effectiveDate: '',
      reviewCycle: '',
    });
    setUploadedFiles([]);
    
    alert('Policy uploaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Upload Policy</h1>
          <p className="text-slate-600 mt-1">Add new policy documents to your compliance framework</p>
        </div>
        <Button onClick={() => window.history.back()}>
          ← Back to Policies
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Policy Metadata */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Policy Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Policy Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                value={metadata.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMetadataChange('title', e.target.value)}
                placeholder="e.g., Data Privacy Policy"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={metadata.category}
                onChange={(e) => handleMetadataChange('category', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Data Privacy">Data Privacy</option>
                <option value="Security">Security</option>
                <option value="Financial">Financial</option>
                <option value="Operational">Operational</option>
                <option value="Legal">Legal</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div>
              <label htmlFor="framework" className="block text-sm font-medium text-slate-700 mb-1">
                Compliance Framework
              </label>
              <select
                id="framework"
                value={metadata.complianceFramework}
                onChange={(e) => handleMetadataChange('complianceFramework', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Framework</option>
                <option value="GDPR">GDPR</option>
                <option value="HIPAA">HIPAA</option>
                <option value="SOX">SOX</option>
                <option value="ISO 27001">ISO 27001</option>
                <option value="PCI DSS">PCI DSS</option>
                <option value="SOC 2">SOC 2</option>
              </select>
            </div>

            <div>
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-slate-700 mb-1">
                Effective Date
              </label>
              <Input
                id="effectiveDate"
                type="date"
                value={metadata.effectiveDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMetadataChange('effectiveDate', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="reviewCycle" className="block text-sm font-medium text-slate-700 mb-1">
                Review Cycle
              </label>
              <select
                id="reviewCycle"
                value={metadata.reviewCycle}
                onChange={(e) => handleMetadataChange('reviewCycle', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Review Cycle</option>
                <option value="Annual">Annual</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief description of the policy..."
              />
            </div>
          </div>
        </Card>

        {/* File Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Documents</h2>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 hover:border-slate-400'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-slate-500">
                Supports PDF, DOC, DOCX files up to 10MB each
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload policy documents"
          />

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Uploaded Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center flex-1 min-w-0">
                      <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                        
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="flex items-center">
                              <progress
                                value={file.progress}
                                max={100}
                                className="progress-bar flex-1 bg-slate-200 rounded-full h-2 mr-2"
                              />
                              <span className="text-xs text-slate-500">{Math.round(file.progress)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center ml-4">
                        {file.status === 'uploading' && <Spinner size="sm" />}
                        {file.status === 'complete' && (
                          <Badge variant="success">Complete</Badge>
                        )}
                        {file.status === 'error' && (
                          <Badge variant="danger">Error</Badge>
                        )}
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="ml-2 text-slate-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!metadata.title || !metadata.category || uploadedFiles.length === 0}
          >
            Create Policy
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PolicyUpload;