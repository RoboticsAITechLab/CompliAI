import React, { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import Button from '../ui/Button';

interface VerifyEmailFormProps {
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  onVerify,
  isLoading,
  disabled = false
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  /**
   * Handle input change for individual code digits
   */
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.slice(-1);
    
    // Only allow numbers
    if (digit && !/^[0-9]$/.test(digit)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  /**
   * Handle backspace and navigation
   */
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      
      if (newCode[index]) {
        // Clear current input
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // Move to previous input and clear it
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event for full code
   */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length > 0) {
      const newCode = [...code];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
        }
      });
      setCode(newCode);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-submit if all 6 digits are pasted
      if (digits.length === 6) {
        handleSubmit(newCode.join(''));
      }
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!/^[0-9]{6}$/.test(codeToVerify)) {
      setError('Verification code must contain only numbers.');
      return;
    }

    setError('');
    
    try {
      await onVerify(codeToVerify);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.');
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  /**
   * Handle manual submit button click
   */
  const handleButtonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  /**
   * Clear all inputs
   */
  const handleClear = () => {
    setCode(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <form onSubmit={handleButtonSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Enter Verification Code:
        </label>
        
        {/* 6-digit code input */}
        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={disabled || isLoading}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Verification code digit ${index + 1}`}
            />
          ))}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center mb-3">{error}</p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={disabled || code.join('').length !== 6}
          fullWidth
        >
          VERIFY EMAIL
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          disabled={disabled || isLoading}
          fullWidth
        >
          CLEAR CODE
        </Button>
      </div>
    </form>
  );
};

export default VerifyEmailForm;