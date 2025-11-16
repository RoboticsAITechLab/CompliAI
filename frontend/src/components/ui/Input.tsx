import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:ring-2 focus:ring-offset-0';
  const variantClasses = {
    default: 'bg-white focus:border-blue-500 focus:ring-blue-500',
    filled: 'bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500'
  };
  
  const errorClasses = error 
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : variantClasses[variant];
    
  const sizeClasses = leftIcon || rightIcon ? 'pl-10 pr-10' : 'px-3';
  const heightClasses = 'py-2 text-sm';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${sizeClasses} ${heightClasses} ${className}`.trim();
  const containerWidth = fullWidth ? 'w-full' : '';
  
  return (
    <div className={containerWidth}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;