// backend/src/validators/project.validator.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(2, 'Slug must be at least 2 characters')
    .max(200, 'Slug cannot exceed 200 characters')
    .regex(slugRegex, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  shortDescription: z
    .string({ required_error: 'Short description is required' })
    .min(5, 'Short description must be at least 5 characters')
    .max(500, 'Short description cannot exceed 500 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters'),
  category: z
    .string({ required_error: 'Category is required' })
    .min(2, 'Category must be at least 2 characters'),
  year: z
    .number({ required_error: 'Year is required' })
    .int('Year must be an integer')
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year cannot exceed 2100'),
  thumbnail: z.string().optional().default(''),
  heroImage: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  services: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  challenge: z.string().optional().default(''),
  approach: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  outcome: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const updateProjectSchema = createProjectSchema.partial();

export const validateCreateProject = (req: Request, res: Response, next: NextFunction) => {
  const result = createProjectSchema.safeParse(req.body);
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

export const validateUpdateProject = (req: Request, res: Response, next: NextFunction) => {
  const result = updateProjectSchema.safeParse(req.body);
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
