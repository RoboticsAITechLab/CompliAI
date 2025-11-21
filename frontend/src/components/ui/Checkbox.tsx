import React, { type InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const checkboxClasses = `
    rounded border-gray-300 text-blue-600 shadow-sm
    focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed
    ${error ? 'border-red-300 text-red-600 focus:border-red-500 focus:ring-red-500' : ''}
    ${sizeClasses[size]}
    ${className}
  `;

  const containerClasses = variant === 'card' 
    ? 'relative flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
    : 'relative flex items-start';

  return (
    <div className={containerClasses}>
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          className={checkboxClasses}
          {...props}
        />
      </div>
      
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={props.id}
              className={`font-medium text-gray-900 ${labelSizeClasses[size]} ${props.disabled ? 'text-gray-400' : ''}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`text-gray-500 ${props.disabled ? 'text-gray-400' : ''}`}>
              {description}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm mt-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;