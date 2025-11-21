/**
 * Formatting Utilities for Enterprise Compliance SaaS
 * Production-grade formatting functions for user-facing data
 */

/**
 * Masks email address for privacy display
 * Shows first 2 chars, asterisks, and domain
 * @param email Email address to mask
 * @returns Masked email string
 */
export const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  const emailRegex = /^([^@]{1,2})[^@]*(@.+)$/;
  const match = email.match(emailRegex);
  
  if (!match) {
    return email; // Return original if format is invalid
  }
  
  const [, prefix, domain] = match;
  const maskedPrefix = prefix.padEnd(Math.min(email.indexOf('@'), 8), '*');
  
  return `${maskedPrefix}${domain}`;
};

/**
 * Formats error message for user-friendly display
 * @param error Error object or string
 * @param fallbackMessage Default message if error is unclear
 * @returns User-friendly error message
 */
export const formatErrorMessage = (
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred. Please try again.'
): string => {
  if (!error) {
    return fallbackMessage;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    
    // Check for common error properties
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
    
    if (typeof errorObj.details === 'string') {
      return errorObj.details;
    }
  }
  
  return fallbackMessage;
};

/**
 * Formats file size in human-readable format
 * @param bytes File size in bytes
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats date for user display
 * @param date Date string or Date object
 * @param format Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Formats relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Formats phone number for display
 * @param phone Raw phone number string
 * @param format Format type ('us', 'international')
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (
  phone: string,
  format: 'us' | 'international' = 'us'
): string => {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (format === 'us' && digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  if (format === 'us' && digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  // International format
  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Formats currency for display
 * @param amount Numeric amount
 * @param currency Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  if (typeof amount !== 'number') return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Formats percentage for display
 * @param value Numeric value (0-1 for percentages, or raw number)
 * @param decimals Number of decimal places
 * @param isDecimal Whether input is already decimal (0-1) vs whole number
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  isDecimal: boolean = false
): string => {
  if (typeof value !== 'number') return '';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Truncates text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitalizes first letter of each word
 * @param text Text to capitalize
 * @returns Title-cased text
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats API response status for user display
 * @param status HTTP status code or response status
 * @returns User-friendly status message
 */
export const formatApiStatus = (status: number | string): string => {
  if (typeof status === 'number') {
    switch (Math.floor(status / 100)) {
      case 2:
        return 'Success';
      case 4:
        return 'Client Error';
      case 5:
        return 'Server Error';
      default:
        return 'Unknown Status';
    }
  }
  
  return String(status).replace(/_/g, ' ').toLowerCase();
};