import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Company info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-gray-900 font-semibold">CompliAI</span>
            </div>
            <span className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CompliAI by RoboticsAITechLab. All rights reserved.
            </span>
          </div>

          {/* Center - Quick links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/privacy" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="/support" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Support
            </a>
          </div>

          {/* Right side - Version and status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500 text-sm">All Systems Operational</span>
            </div>
            <span className="text-gray-400 text-xs">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;