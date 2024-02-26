import { z } from 'zod';
import { handleZodErrors } from '../utils/index.js';

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password can not be longer than 12 characters')
    .regex(/[a-z]/, 'Password must contain at least one lower case character')
    .regex(/[A-Z]/, 'Password must contain at least one upper case character')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      'Password must contain at least one special character',
    ),
});

const loginSchema = passwordSchema.extend({
  email: z.string().email('Email must be a valid email address'),
});

const registerSchema = loginSchema.extend({
  group_id: z.string().min(1, 'Group id can not be empty'),
});

export const validatePassword = (data) => {
  try {
    passwordSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodErrors(error);
  }
};

export const validateLogin = (data) => {
  try {
    loginSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodErrors(error);
  }
};

export const validateRegistration = (data) => {
  try {
    registerSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodErrors(error);
  }
};
