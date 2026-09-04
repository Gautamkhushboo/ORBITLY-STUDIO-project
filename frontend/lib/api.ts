import { Project, BlogPost } from '@/types';
export type { Project, BlogPost };

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
    published: Boolean(raw.published),
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
    published: Boolean(raw.published),
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

// ----------------------------------------------------------------------
// ADMIN AUTHENTICATION & TOKEN HANDLING
// ----------------------------------------------------------------------

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TOKEN_KEY = 'orbitly_admin_token';
const USER_KEY = 'orbitly_admin_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Admin Login: POST /api/auth/login
 */
export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
  status?: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 429) {
      return {
        success: false,
        status: 429,
        error: 'Too many login attempts. Please wait 15 minutes before trying again.',
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || 'Invalid email or password.',
      };
    }

    if (json.token && json.user) {
      setStoredAuth(json.token, json.user);
      return {
        success: true,
        token: json.token,
        user: json.user,
      };
    }

    return {
      success: false,
      error: 'Malformed server response',
    };
  } catch {
    return {
      success: false,
      error: 'Network connection error. Please ensure the backend is running.',
    };
  }
}

/**
 * Verify current authenticated admin: GET /api/auth/me
 */
export async function getCurrentAdmin(): Promise<{
  data: AdminUser | null;
  error: string | null;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { data: null, error: 'No token available', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (res.status === 401) {
      clearStoredAuth();
      return { data: null, error: 'Session expired', status: 401 };
    }

    if (res.status === 403) {
      return { data: null, error: 'Admin access required', status: 403 };
    }

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}`, status: res.status };
    }

    const json = await res.json();
    return { data: json.user || json.data, error: null, status: 200 };
  } catch {
    return { data: null, error: 'Network error', status: 500 };
  }
}

// ----------------------------------------------------------------------
// ADMIN PROJECT CRUD
// ----------------------------------------------------------------------

/**
 * List all projects (published + draft): GET /api/admin/projects
 */
export async function getAdminProjects(): Promise<{
  data: Project[];
  error: string | null;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { data: [], error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/projects?limit=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (res.status === 401) {
      clearStoredAuth();
      return { data: [], error: 'Unauthorized', status: 401 };
    }
    if (res.status === 403) {
      return { data: [], error: 'Forbidden', status: 403 };
    }
    if (!res.ok) {
      return { data: [], error: `HTTP ${res.status}`, status: res.status };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>[]>;
    return {
      data: (json.data || []).map(mapBackendProject),
      error: null,
      status: 200,
    };
  } catch {
    return { data: [], error: 'Network connection error', status: 500 };
  }
}

/**
 * Create Project: POST /api/projects
 */
export async function createAdminProject(payload: Partial<Project>): Promise<{
  success: boolean;
  data?: Project;
  error?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 409) {
      return {
        success: false,
        status: 409,
        error: json.message || 'A project with this slug already exists.',
      };
    }

    if (res.status === 400) {
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(json.errors)) {
        json.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
      }
      return {
        success: false,
        status: 400,
        error: json.message || 'Validation failed. Please check the fields.',
        fieldErrors,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: mapBackendProject(json.data),
      status: 201,
    };
  } catch {
    return {
      success: false,
      error: 'Network error communicating with server.',
      status: 500,
    };
  }
}

/**
 * Update Project: PUT /api/projects/:id
 */
export async function updateAdminProject(
  id: string,
  payload: Partial<Project>
): Promise<{
  success: boolean;
  data?: Project;
  error?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 409) {
      return {
        success: false,
        status: 409,
        error: json.message || 'A project with this slug already exists.',
      };
    }

    if (res.status === 400) {
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(json.errors)) {
        json.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
      }
      return {
        success: false,
        status: 400,
        error: json.message || 'Validation failed. Please check the fields.',
        fieldErrors,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: mapBackendProject(json.data),
      status: 200,
    };
  } catch {
    return {
      success: false,
      error: 'Network error communicating with server.',
      status: 500,
    };
  }
}

/**
 * Delete Project: DELETE /api/projects/:id
 */
export async function deleteAdminProject(id: string): Promise<{
  success: boolean;
  error?: string;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Delete failed with status ${res.status}`,
      };
    }

    return { success: true, status: res.status };
  } catch {
    return { success: false, error: 'Network error', status: 500 };
  }
}

// ----------------------------------------------------------------------
// ADMIN BLOG CRUD
// ----------------------------------------------------------------------

/**
 * List all blog posts (published + draft): GET /api/admin/blog
 */
export async function getAdminBlogPosts(): Promise<{
  data: BlogPost[];
  error: string | null;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { data: [], error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/blog?limit=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (res.status === 401) {
      clearStoredAuth();
      return { data: [], error: 'Unauthorized', status: 401 };
    }
    if (res.status === 403) {
      return { data: [], error: 'Forbidden', status: 403 };
    }
    if (!res.ok) {
      return { data: [], error: `HTTP ${res.status}`, status: res.status };
    }

    const json = (await res.json()) as ApiResponse<Record<string, unknown>[]>;
    return {
      data: (json.data || []).map(mapBackendBlogPost),
      error: null,
      status: 200,
    };
  } catch {
    return { data: [], error: 'Network connection error', status: 500 };
  }
}

/**
 * Create Blog Post: POST /api/blog
 */
export async function createAdminBlogPost(payload: Partial<BlogPost>): Promise<{
  success: boolean;
  data?: BlogPost;
  error?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 409) {
      return {
        success: false,
        status: 409,
        error: json.message || 'A blog post with this slug already exists.',
      };
    }

    if (res.status === 400) {
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(json.errors)) {
        json.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
      }
      return {
        success: false,
        status: 400,
        error: json.message || 'Validation failed. Please check the fields.',
        fieldErrors,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: mapBackendBlogPost(json.data),
      status: 201,
    };
  } catch {
    return {
      success: false,
      error: 'Network error communicating with server.',
      status: 500,
    };
  }
}

/**
 * Update Blog Post: PUT /api/blog/:id
 */
export async function updateAdminBlogPost(
  id: string,
  payload: Partial<BlogPost>
): Promise<{
  success: boolean;
  data?: BlogPost;
  error?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 409) {
      return {
        success: false,
        status: 409,
        error: json.message || 'A blog post with this slug already exists.',
      };
    }

    if (res.status === 400) {
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(json.errors)) {
        json.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
      }
      return {
        success: false,
        status: 400,
        error: json.message || 'Validation failed. Please check the fields.',
        fieldErrors,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: mapBackendBlogPost(json.data),
      status: 200,
    };
  } catch {
    return {
      success: false,
      error: 'Network error communicating with server.',
      status: 500,
    };
  }
}

/**
 * Delete Blog Post: DELETE /api/blog/:id
 */
export async function deleteAdminBlogPost(id: string): Promise<{
  success: boolean;
  error?: string;
  status?: number;
}> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Authentication required', status: 401 };
  }

  try {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: json.message || `Delete failed with status ${res.status}`,
      };
    }

    return { success: true, status: res.status };
  } catch {
    return { success: false, error: 'Network error', status: 500 };
  }
}

