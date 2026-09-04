export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  tags: string[];
  year: number;
  image: string;
  featured: boolean;
  metrics?: string;
  client?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  outcome?: string;
  services?: string[];
  images?: string[];
}

export interface Service {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  category: string;
  author?: string;
  date: string;
  readTime: string;
  tags?: string[];
  featured?: boolean;
}
