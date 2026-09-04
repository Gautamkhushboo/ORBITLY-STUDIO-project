import { Project, BlogPost } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

// Map backend project schema fields to the frontend Project type
export function mapBackendProject(raw: Record<string, unknown>): Project {
  return {
    id: String(raw._id || raw.id || ''),
    title: String(raw.title || ''),
    slug: String(raw.slug || ''),
    shortDescription: String(raw.shortDescription || raw.description || ''),
    description: String(raw.description || ''),
    category: String(raw.category || 'General'),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    year: typeof raw.year === 'number' ? raw.year : 2026,
    image: String(
      raw.heroImage ||
        raw.thumbnail ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ),
    featured: Boolean(raw.featured),
    metrics: typeof raw.outcome === 'string' && raw.outcome ? String(raw.outcome) : undefined,
    client: typeof raw.client === 'string' && raw.client ? String(raw.client) : undefined,
    challenge: typeof raw.challenge === 'string' ? String(raw.challenge) : undefined,
    approach: typeof raw.approach === 'string' ? String(raw.approach) : undefined,
    solution: typeof raw.solution === 'string' ? String(raw.solution) : undefined,
    outcome: typeof raw.outcome === 'string' ? String(raw.outcome) : undefined,
    services: Array.isArray(raw.services) ? raw.services.map(String) : [],
    images: Array.isArray(raw.images) ? raw.images.map(String) : [],
  };
}

// Map backend blog post schema fields to the frontend BlogPost type
export function mapBackendBlogPost(raw: Record<string, unknown>): BlogPost {
  const publishedAt = raw.publishedAt || raw.createdAt;
  let formattedDate = 'Recently';
  if (publishedAt) {
    try {
      const d = new Date(String(publishedAt));
      formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      formattedDate = 'Recently';
    }
  }

  return {
    id: String(raw._id || raw.id || ''),
    title: String(raw.title || ''),
    slug: String(raw.slug || ''),
    excerpt: String(raw.excerpt || ''),
    content: typeof raw.content === 'string' ? String(raw.content) : '',
    featuredImage:
      typeof raw.featuredImage === 'string' && raw.featuredImage
        ? String(raw.featuredImage)
        : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    category: String(raw.category || 'Engineering'),
    author: typeof raw.author === 'string' ? String(raw.author) : 'Orbitly Studio',
    date: formattedDate,
    readTime: typeof raw.readTime === 'number' ? `${raw.readTime} min read` : '5 min read',
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    featured: Boolean(raw.featured),
  };
}

/**
 * Fetch all published projects from GET /api/projects
 */
export async function getProjects(): Promise<{
  data: Project[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Ensure Next.js handles server/client cache appropriately
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        data: [],
        error: `HTTP ${res.status}: Unable to load projects`,
      };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>[]>;
    if (!json.success || !Array.isArray(json.data)) {
      return {
        data: [],
        error: 'Malformed response structure',
      };
    }

    return {
      data: json.data.map(mapBackendProject),
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: [],
      error: 'Network connection error',
    };
  }
}

/**
 * Fetch a single published project by slug from GET /api/projects/:slug
 */
export async function getProjectBySlug(slug: string): Promise<{
  data: Project | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { data: null, error: 'Project not found' };
    }

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}` };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>>;
    if (!json.success || !json.data) {
      return { data: null, error: 'Invalid response' };
    }

    return {
      data: mapBackendProject(json.data),
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: null,
      error: 'Network connection error',
    };
  }
}

/**
 * Fetch all published blog posts from GET /api/blog
 */
export async function getBlogPosts(): Promise<{
  data: BlogPost[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        data: [],
        error: `HTTP ${res.status}: Unable to load articles`,
      };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>[]>;
    if (!json.success || !Array.isArray(json.data)) {
      return {
        data: [],
        error: 'Malformed response structure',
      };
    }

    return {
      data: json.data.map(mapBackendBlogPost),
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: [],
      error: 'Network connection error',
    };
  }
}

/**
 * Fetch a single published blog post by slug from GET /api/blog/:slug
 */
export async function getBlogPostBySlug(slug: string): Promise<{
  data: BlogPost | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { data: null, error: 'Article not found' };
    }

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}` };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>>;
    if (!json.success || !json.data) {
      return { data: null, error: 'Invalid response' };
    }

    return {
      data: mapBackendBlogPost(json.data),
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: null,
      error: 'Network connection error',
    };
  }
}
