/**
 * Frontend validation utilities that match backend Zod schemas exactly
 * This ensures consistent validation between frontend and backend
 */

// Email validation - matches backend emailSchema
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  
  return null;
};

// Password validation - matches backend passwordSchema exactly
export const validatePassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (password.length > 128) {
    return 'Password must not exceed 128 characters';
  }
  
  // Exact regex from backend: at least one lowercase, uppercase, digit, and special char
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!complexityRegex.test(password)) {
    return 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character';
  }
  
  return null;
};

// Name validation - matches backend nameSchema
export const validateName = (name: string, fieldName: string = 'Name'): string | null => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  if (name.length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }
  
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} contains invalid characters`;
  }
  
  return null;
};

// Organization validation - matches backend orgSchema
export const validateOrg = (org: string): string | null => {
  if (!org || org.trim().length === 0) {
    return 'Organization is required';
  }
  
  if (org.length > 100) {
    return 'Organization name must not exceed 100 characters';
  }
  
  return null;
};

// Login validation
export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (email: string, password: string): LoginValidationErrors => {
  const errors: LoginValidationErrors = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  // For login, just check password is provided (not complexity)
  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

// Registration validation
export interface RegisterValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  organization?: string;
  [key: string]: string | undefined;
}

export const validateRegisterForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  organization: string
): RegisterValidationErrors => {
  const errors: RegisterValidationErrors = {};
  
  const firstNameError = validateName(firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateName(lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  const orgError = validateOrg(organization);
  if (orgError) errors.organization = orgError;
  
  return errors;
};

// Normalize data for API requests
export const normalizeAuthData = {
  email: (email: string): string => email.toLowerCase().trim(),
  name: (name: string): string => name.trim(),
  org: (org: string): string => org.trim(),
};

/**
 * Additional utility functions for new auth components
 */

// Simple email check (boolean return)
export const isEmail = (email: string): boolean => {
  return validateEmail(email) === null;
};

// Strong password validation (boolean return)
export const isStrongPassword = (password: string): boolean => {
  return validatePassword(password) === null;
};

// Password match validation
export const validatePasswordMatch = (password1: string, password2: string): boolean => {
  if (!password1 || !password2) {
    return false;
  }
  return password1 === password2;
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    // Remove null bytes and control characters
    .replace(/[\u0000-\u001f\u007f]/g, '')
    // Remove potentially dangerous HTML/Script characters
    .replace(/[<>"'&]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
};