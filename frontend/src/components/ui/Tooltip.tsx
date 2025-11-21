import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  disabled = false,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-t-4 border-x-transparent border-x-4',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-b-4 border-x-transparent border-x-4',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-l-4 border-y-transparent border-y-4',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-r-4 border-y-transparent border-y-4',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="group cursor-help">
        {children}
        
        {/* Tooltip */}
        <div className={`
          absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 
          transition-all duration-200 pointer-events-none
          ${positionClasses[position]}
        `}>
          <div className="bg-gray-900 text-white text-sm rounded py-2 px-3 whitespace-nowrap max-w-xs">
            {content}
            
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;