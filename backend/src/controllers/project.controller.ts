// backend/src/controllers/project.controller.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Project } from '../models';
import { getDatabaseStatus } from '../config';

// In-memory fallback storage for development when MongoDB is not connected
let memoryProjects: any[] = [
  {
    _id: new Types.ObjectId().toString(),
    title: 'Orbitly Studio Brand Identity',
    slug: 'orbitly-brand-identity',
    shortDescription: 'Comprehensive branding and digital identity for high-growth tech ventures.',
    description: 'We designed a minimal, craft-driven design system with typography and custom design tokens.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    category: 'Branding',
    tags: ['Branding', 'Design System', 'Identity'],
    year: 2026,
    challenge: 'Create a distinctive brand identity in a crowded digital product space.',
    approach: 'Editorial minimalism paired with confident typography.',
    solution: 'A cohesive visual language, website architecture, and component library.',
    outcome: 'Increased investor engagement and unified brand perception.',
    services: ['Brand Strategy', 'Visual Identity', 'Design Guidelines'],
    images: [],
    featured: true,
    published: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    _id: new Types.ObjectId().toString(),
    title: 'Fintech Mobile Experience',
    slug: 'fintech-mobile-experience',
    shortDescription: 'Frictionless wealth-tech mobile app design with intuitive charts.',
    description: 'A cutting-edge financial experience crafted for the next generation of investors.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    category: 'Product Design',
    tags: ['Fintech', 'Mobile', 'UI/UX'],
    year: 2026,
    challenge: 'Complex asset workflows simplified into 3-tap transactions.',
    approach: 'User research and interactive micro-prototypes.',
    solution: 'High-contrast editorial UI with instant execution patterns.',
    outcome: '40% increase in daily active users.',
    services: ['UI/UX Design', 'Design Systems', 'Prototyping'],
    images: [],
    featured: false,
    published: true,
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    _id: new Types.ObjectId().toString(),
    title: 'Confidential Stealth Project (Draft)',
    slug: 'confidential-stealth-draft',
    shortDescription: 'Upcoming confidential stealth product design currently in development.',
    description: 'Internal case study in progress. Confidential details pending public release.',
    thumbnail: '',
    heroImage: '',
    category: 'AI Products',
    tags: ['AI', 'Stealth', 'Draft'],
    year: 2026,
    challenge: 'Classified.',
    approach: 'Rapid ideation and hardware interface alignment.',
    solution: 'In development.',
    outcome: 'In progress.',
    services: ['Product Strategy'],
    images: [],
    featured: false,
    published: false,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
  }
];

/**
 * Helper to validate MongoDB ObjectId
 */
const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id;
};

/**
 * Public GET: List published projects
 * GET /api/projects
 */
export const getPublicProjects = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    if (getDatabaseStatus() === 'connected') {
      const query = { published: true };
      const total = await Project.countDocuments(query);
      const data = await Project.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // In-memory fallback
    const publishedProjects = memoryProjects
      .filter((p) => p.published === true)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    const total = publishedProjects.length;
    const data = publishedProjects.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error('getPublicProjects error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching projects',
    });
  }
};

/**
 * Public GET: Retrieve a published project by slug
 * GET /api/projects/:slug
 */
export const getPublicProjectBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (getDatabaseStatus() === 'connected') {
      const project = await Project.findOne({ slug: slug.toLowerCase().trim(), published: true });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: project,
      });
    }

    // In-memory fallback
    const project = memoryProjects.find(
      (p) => p.slug === slug.toLowerCase().trim() && p.published === true
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('getPublicProjectBySlug error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching project',
    });
  }
};

/**
 * Admin GET: List all projects (published + draft)
 * GET /api/admin/projects
 */
export const getAdminProjects = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    if (getDatabaseStatus() === 'connected') {
      const total = await Project.countDocuments();
      const data = await Project.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // In-memory fallback
    const total = memoryProjects.length;
    const data = memoryProjects.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error('getAdminProjects error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching admin projects',
    });
  }
};

/**
 * Admin POST: Create project
 * POST /api/projects
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const slug = req.body.slug.toLowerCase().trim();

    if (getDatabaseStatus() === 'connected') {
      const existing = await Project.findOne({ slug });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A project with this slug already exists',
        });
      }

      const newProject = new Project({
        ...req.body,
        slug,
      });

      await newProject.save();

      return res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: newProject,
      });
    }

    // In-memory fallback
    const existing = memoryProjects.find((p) => p.slug === slug);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A project with this slug already exists',
      });
    }

    const newProject = {
      _id: new Types.ObjectId().toString(),
      ...req.body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryProjects.unshift(newProject);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A project with this slug already exists',
      });
    }
    console.error('createProject error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error creating project',
    });
  }
};

/**
 * Admin PUT: Update project
 * PUT /api/projects/:id
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format',
      });
    }

    if (req.body.slug) {
      const slug = req.body.slug.toLowerCase().trim();
      req.body.slug = slug;

      if (getDatabaseStatus() === 'connected') {
        const duplicate = await Project.findOne({ slug, _id: { $ne: id } });
        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: 'A project with this slug already exists',
          });
        }
      } else {
        const duplicate = memoryProjects.find((p) => p.slug === slug && p._id !== id);
        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: 'A project with this slug already exists',
          });
        }
      }
    }

    if (getDatabaseStatus() === 'connected') {
      const updated = await Project.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updated,
      });
    }

    // In-memory fallback
    const index = memoryProjects.findIndex((p) => p._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    memoryProjects[index] = {
      ...memoryProjects[index],
      ...req.body,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: memoryProjects[index],
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A project with this slug already exists',
      });
    }
    console.error('updateProject error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error updating project',
    });
  }
};

/**
 * Admin DELETE: Delete project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format',
      });
    }

    if (getDatabaseStatus() === 'connected') {
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    }

    // In-memory fallback
    const index = memoryProjects.findIndex((p) => p._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    memoryProjects.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('deleteProject error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error deleting project',
    });
  }
};
