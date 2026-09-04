// backend/src/controllers/blog.controller.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { BlogPost } from '../models';
import { getDatabaseStatus } from '../config';

// In-memory fallback storage for development when MongoDB is not connected
let memoryBlogs: any[] = [
  {
    _id: new Types.ObjectId().toString(),
    title: 'Designing for Next-Gen Founders: The Craft of Digital Identity',
    slug: 'designing-for-next-gen-founders',
    excerpt: 'How boutique design agencies transform raw startup ideas into market-ready category leaders.',
    content: 'In the modern venture ecosystem, design is not merely decoration—it is the foundational interface between vision and capital...',
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
    category: 'Design Philosophy',
    author: 'Orbitly Studio',
    tags: ['Design', 'Startups', 'Product Strategy'],
    featured: true,
    published: true,
    publishedAt: new Date('2026-01-20'),
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    _id: new Types.ObjectId().toString(),
    title: 'Editorial Minimalism: Why Restraint Wins in UI/UX',
    slug: 'editorial-minimalism-ui-ux',
    excerpt: 'Exploring the psychology of generous whitespace and high-contrast typography.',
    content: 'When digital products eliminate gratuitous visual noise, clarity becomes the primary value proposition...',
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
    category: 'UI/UX',
    author: 'Orbitly Studio',
    tags: ['UI/UX', 'Typography', 'Minimalism'],
    featured: false,
    published: true,
    publishedAt: new Date('2026-02-10'),
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
  },
  {
    _id: new Types.ObjectId().toString(),
    title: 'Upcoming Trends in AI-Driven Workflows (Draft)',
    slug: 'upcoming-ai-workflows-draft',
    excerpt: 'Internal draft exploring how agentic workflows will redefine design engineering.',
    content: 'Work in progress. Unreleased draft analyzing predictive UI components...',
    featuredImage: '',
    category: 'Technology',
    author: 'Orbitly Studio',
    tags: ['AI', 'Draft', 'Engineering'],
    featured: false,
    published: false,
    publishedAt: null,
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  }
];

/**
 * Helper to validate MongoDB ObjectId
 */
const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id;
};

/**
 * Public GET: List published blog posts
 * GET /api/blog
 */
export const getPublicBlogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    if (getDatabaseStatus() === 'connected') {
      const query = { published: true };
      const total = await BlogPost.countDocuments(query);
      const data = await BlogPost.find(query)
        .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
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
    const publishedBlogs = memoryBlogs
      .filter((b) => b.published === true)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

    const total = publishedBlogs.length;
    const data = publishedBlogs.slice(skip, skip + limit);

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
    console.error('getPublicBlogs error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching blog posts',
    });
  }
};

/**
 * Public GET: Retrieve published blog post by slug
 * GET /api/blog/:slug
 */
export const getPublicBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (getDatabaseStatus() === 'connected') {
      const blog = await BlogPost.findOne({ slug: slug.toLowerCase().trim(), published: true });
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });
    }

    // In-memory fallback
    const blog = memoryBlogs.find(
      (b) => b.slug === slug.toLowerCase().trim() && b.published === true
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error('getPublicBlogBySlug error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching blog post',
    });
  }
};

/**
 * Admin GET: List all blog posts (published + draft)
 * GET /api/admin/blog
 */
export const getAdminBlogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    if (getDatabaseStatus() === 'connected') {
      const total = await BlogPost.countDocuments();
      const data = await BlogPost.find()
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
    const total = memoryBlogs.length;
    const data = memoryBlogs.slice(skip, skip + limit);

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
    console.error('getAdminBlogs error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching admin blog posts',
    });
  }
};

/**
 * Admin POST: Create blog post
 * POST /api/blog
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.body.slug.toLowerCase().trim();

    if (req.body.published && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    if (getDatabaseStatus() === 'connected') {
      const existing = await BlogPost.findOne({ slug });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A blog post with this slug already exists',
        });
      }

      const newBlog = new BlogPost({
        ...req.body,
        slug,
      });

      await newBlog.save();

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: newBlog,
      });
    }

    // In-memory fallback
    const existing = memoryBlogs.find((b) => b.slug === slug);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A blog post with this slug already exists',
      });
    }

    const newBlog = {
      _id: new Types.ObjectId().toString(),
      ...req.body,
      slug,
      publishedAt: req.body.published ? req.body.publishedAt || new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryBlogs.unshift(newBlog);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newBlog,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog post with this slug already exists',
      });
    }
    console.error('createBlog error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error creating blog post',
    });
  }
};

/**
 * Admin PUT: Update blog post
 * PUT /api/blog/:id
 */
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID format',
      });
    }

    if (req.body.slug) {
      const slug = req.body.slug.toLowerCase().trim();
      req.body.slug = slug;

      if (getDatabaseStatus() === 'connected') {
        const duplicate = await BlogPost.findOne({ slug, _id: { $ne: id } });
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: 'A blog post with this slug already exists',
          });
        }
      } else {
        const duplicate = memoryBlogs.find((b) => b.slug === slug && b._id !== id);
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: 'A blog post with this slug already exists',
          });
        }
      }
    }

    if (req.body.published && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    if (getDatabaseStatus() === 'connected') {
      const updated = await BlogPost.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: updated,
      });
    }

    // In-memory fallback
    const index = memoryBlogs.findIndex((b) => b._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    memoryBlogs[index] = {
      ...memoryBlogs[index],
      ...req.body,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: memoryBlogs[index],
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists',
      });
    }
    console.error('updateBlog error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error updating blog post',
    });
  }
};

/**
 * Admin DELETE: Delete blog post
 * DELETE /api/blog/:id
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID format',
      });
    }

    if (getDatabaseStatus() === 'connected') {
      const deleted = await BlogPost.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    }

    // In-memory fallback
    const index = memoryBlogs.findIndex((b) => b._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    memoryBlogs.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('deleteBlog error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error deleting blog post',
    });
  }
};
