// backend/src/validators/blog.validator.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(2, 'Slug must be at least 2 characters')
    .max(200, 'Slug cannot exceed 200 characters')
    .regex(slugRegex, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  excerpt: z
    .string({ required_error: 'Excerpt is required' })
    .min(5, 'Excerpt must be at least 5 characters')
    .max(500, 'Excerpt cannot exceed 500 characters'),
  content: z
    .string({ required_error: 'Content is required' })
    .min(10, 'Content must be at least 10 characters'),
  category: z
    .string({ required_error: 'Category is required' })
    .min(2, 'Category must be at least 2 characters'),
  author: z.string().optional().default('Orbitly Studio'),
  featuredImage: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  publishedAt: z.string().or(z.date()).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const validateCreateBlog = (req: Request, res: Response, next: NextFunction) => {
  const result = createBlogSchema.safeParse(req.body);
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

export const validateUpdateBlog = (req: Request, res: Response, next: NextFunction) => {
  const result = updateBlogSchema.safeParse(req.body);
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
