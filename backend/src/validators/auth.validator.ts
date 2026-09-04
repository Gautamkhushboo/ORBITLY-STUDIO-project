// backend/src/validators/auth.validator.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty'),
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  req.body = result.data;
  return next();
};
