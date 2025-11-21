/**
 * Security Utilities for Enterprise Compliance SaaS
 * Production-grade security functions for token handling and validation
 */

/**
 * Extracts and validates token from URL parameter
 * @param tokenParam Token parameter from URL
 * @returns Cleaned token string or null if invalid
 */
export const tokenFromURL = (tokenParam: string | null): string | null => {
  if (!tokenParam || typeof tokenParam !== 'string') {
    return null;
  }
  
  // Clean and validate token format
  const cleanToken = tokenParam.trim();
  
  // Basic token format validation (adjust based on your token format)
  // This example assumes JWT-like tokens or UUID-like tokens
  if (cleanToken.length < 10) {
    return null;
  }
  
  // Remove any potential URL encoding artifacts
  const decodedToken = decodeURIComponent(cleanToken);
  
  return decodedToken;
};

/**
 * Validates token format and basic structure
 * @param token Token string to validate
 * @returns boolean indicating if token appears valid
 */
export const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  const cleanToken = token.trim();
  
  // Basic token validation rules
  if (cleanToken.length < 10 || cleanToken.length > 2048) {
    return false;
  }
  
  // Check for basic token structure (alphanumeric + common token characters)
  const tokenRegex = /^[A-Za-z0-9._-]+$/;
  if (!tokenRegex.test(cleanToken)) {
    return false;
  }
  
  return true;
};

/**
 * Securely generates a random string for client-side use
 * @param length Length of the random string
 * @returns Random string
 */
export const generateSecureRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Use crypto.getRandomValues for secure randomness
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for environments without crypto API
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
};

/**
 * Creates a secure hash of a string (client-side)
 * Note: This is for client-side validation only, not for password hashing
 * @param input Input string to hash
 * @returns Promise with hash string
 */
export const createClientHash = async (input: string): Promise<string> => {
  if (!input) return '';
  
  // Use SubtleCrypto if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.warn('SubtleCrypto not available, using fallback hash');
    }
  }
  
  // Simple fallback hash (not cryptographically secure)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Validates JWT token structure (basic client-side validation)
 * Note: This does NOT verify signature - only structure
 * @param token JWT token string
 * @returns boolean indicating if token has valid JWT structure
 */
export const isValidJWTStructure = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  const parts = token.split('.');
  
  // JWT should have exactly 3 parts
  if (parts.length !== 3) {
    return false;
  }
  
  // Each part should be base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => base64UrlRegex.test(part));
};

/**
 * Decodes JWT payload (client-side only)
 * Note: This does NOT verify signature - use only for reading claims
 * @param token JWT token string
 * @returns Decoded payload object or null
 */
export const decodeJWTPayload = (token: string): Record<string, unknown> | null => {
  if (!isValidJWTStructure(token)) {
    return null;
  }
  
  try {
    const parts = token.split('.');
    const payload = parts[1];
    
    // Add padding if needed for base64url decoding
    const paddedPayload = payload + '=='.substring(0, (4 - payload.length % 4) % 4);
    
    // Convert base64url to base64
    const base64 = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and parse
    const decodedString = atob(base64);
    return JSON.parse(decodedString);
  } catch (error) {
    console.warn('Failed to decode JWT payload:', error);
    return null;
  }
};

/**
 * Checks if JWT token is expired (client-side)
 * @param token JWT token string
 * @returns boolean indicating if token is expired
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = decodeJWTPayload(token);
  
  if (!payload || typeof payload.exp !== 'number') {
    return true; // Assume expired if can't decode or no exp claim
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Sanitizes data for localStorage storage
 * @param data Data to sanitize
 * @returns Sanitized data safe for storage
 */
export const sanitizeForStorage = (data: unknown): string => {
  if (data === null || data === undefined) {
    return '';
  }
  
  try {
    const stringified = JSON.stringify(data);
    
    // Remove any potential script injection attempts
    return stringified
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  } catch (error) {
    console.warn('Failed to sanitize data for storage:', error);
    return '';
  }
};

/**
 * Validates Content Security Policy compliance for URLs
 * @param url URL to validate
 * @param allowedDomains Array of allowed domains
 * @returns boolean indicating if URL is safe
 */
export const isCSPCompliantURL = (url: string, allowedDomains: string[]): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check against allowed domains
    return allowedDomains.some(allowedDomain => {
      const normalizedDomain = allowedDomain.toLowerCase();
      return domain === normalizedDomain || domain.endsWith(`.${normalizedDomain}`);
    });
  } catch (error) {
    return false; // Invalid URL
  }
};

/**
 * Rate limiting helper for client-side operations
 * @param key Unique key for the operation
 * @param windowMs Time window in milliseconds
 * @param maxAttempts Maximum attempts in the window
 * @returns boolean indicating if operation is allowed
 */
export const isRateLimited = (
  key: string,
  windowMs: number = 60000,
  maxAttempts: number = 5
): boolean => {
  if (typeof window === 'undefined') return false;
  
  const storageKey = `rate_limit_${key}`;
  const now = Date.now();
  
  try {
    const stored = localStorage.getItem(storageKey);
    const attempts = stored ? JSON.parse(stored) : [];
    
    // Filter out old attempts outside the window
    const recentAttempts = attempts.filter((timestamp: number) => 
      now - timestamp < windowMs
    );
    
    // Check if we've exceeded the limit
    if (recentAttempts.length >= maxAttempts) {
      return true; // Rate limited
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(recentAttempts));
    
    return false; // Not rate limited
  } catch (error) {
    console.warn('Rate limiting check failed:', error);
    return false; // Allow operation if check fails
  }
};