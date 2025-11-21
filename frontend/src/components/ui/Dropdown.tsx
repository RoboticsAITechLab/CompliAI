import React, { useState, useRef, useEffect } from 'react';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  className = '',
  disabled = false,
  closeOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={handleTriggerClick} className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          {/* Content */}
          <div
            className={`absolute z-20 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-max ${alignmentClasses[align]}`}
            onClick={handleContentClick}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// Dropdown Item Component
export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'danger';
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
    danger: 'text-red-700 hover:bg-red-50 hover:text-red-900',
  };

  return (
    <button
      type="button"
      className={`
        block w-full px-4 py-2 text-left text-sm transition-colors
        ${disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : variantClasses[variant]
        }
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Dropdown Separator
export const DropdownSeparator: React.FC = () => (
  <div className="border-t border-gray-100 my-1" />
);

export default Dropdown;