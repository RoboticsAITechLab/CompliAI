import React, { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';

interface OtpInputProps {
  value?: string;
  onChange: (code: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  error
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Derive code from value prop
  const code = React.useMemo(() => {
    if (value) {
      const digits = value.split('').slice(0, length);
      while (digits.length < length) {
        digits.push('');
      }
      return digits;
    }
    return new Array(length).fill('');
  }, [value, length]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  /**
   * Handle input change for individual code digits
   */
  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow single digit
    const digit = inputValue.slice(-1);
    
    // Only allow numbers
    if (digit && !/^[0-9]$/.test(digit)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = digit;
    onChange(newCode.join(''));

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace/delete key
   */
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newCode = [...code];
      
      if (newCode[index]) {
        // Clear current digit
        newCode[index] = '';
      } else if (index > 0) {
        // Move to previous digit and clear it
        newCode[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
      }
      
      onChange(newCode.join(''));
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const newCode = [...code];
      newCode[index] = '';
      onChange(newCode.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event
   */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits.length > 0) {
      const newCode = new Array(length).fill('');
      for (let i = 0; i < digits.length && i < length; i++) {
        newCode[i] = digits[i];
      }
      
      onChange(newCode.join(''));
      
      // Focus next empty input or last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Enter Verification Code
        </h3>
      </div>
      
      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
        ))}
      </div>
      
      {error && (
        <div className="text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="text-center text-xs text-gray-500">
        Auto-focus, backspace, paste full code support
      </div>
    </div>
  );
};

export default OtpInput;