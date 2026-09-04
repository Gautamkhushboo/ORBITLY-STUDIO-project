import { Project, Service, ProcessStep, Testimonial, BlogPost } from '@/types';

export const services: Service[] = [
  {
    number: '01',
    title: 'Product Strategy',
    description: 'We help founders and product leaders crystallize product-market fit, map customer journeys, and prioritize core functionality before a single pixel is placed.',
    deliverables: ['Opportunity Mapping', 'Feature Architecture', 'User Archetypes', 'Roadmap Prioritization']
  },
  {
    number: '02',
    title: 'UX / UI Design',
    description: 'Deeply thoughtful, human-centered interfaces that eliminate friction in complex workflows, creating apps and platforms users genuinely enjoy every day.',
    deliverables: ['Information Architecture', 'Wireframing & Prototyping', 'High-Fidelity Interface Design', 'Micro-interactions']
  },
  {
    number: '03',
    title: 'Design Systems',
    description: 'Multi-platform component libraries, tokens, and comprehensive documentation that give engineering teams unmatched speed and ensure visual consistency at scale.',
    deliverables: ['Token Architecture', 'Accessible React/Web Components', 'Governance Guidelines', 'Multi-Brand Foundations']
  },
  {
    number: '04',
    title: 'Web Experiences',
    description: 'Bespoke marketing sites and digital editorial flagship platforms built to convert, express your brand ethos, and deliver blazing fast load times.',
    deliverables: ['Editorial Creative Direction', 'Interactive Storytelling', 'Responsive Frameworks', 'SEO & Core Web Vitals']
  },
  {
    number: '05',
    title: 'Brand Identity',
    description: 'Distinctive visual identities engineered specifically for modern screens—including typographic hierarchies, dynamic iconography, and interactive brand expressions.',
    deliverables: ['Visual Strategy', 'Logotypes & Wordmarks', 'Dynamic Motion Guidelines', 'Digital Style Guides']
  },
  {
    number: '06',
    title: 'Product Development',
    description: 'Full-stack engineering partner for modern web applications. We bridge the gap between Figma precision and rock-solid production TypeScript architectures.',
    deliverables: ['Full-stack TypeScript', 'Next.js Web Applications', 'API Architecture & Security', 'CI/CD & Cloud Infrastructure']
  }
];

export const projects: Project[] = [
  {
    id: 'proj-01',
    title: 'Aura Intelligence Platform',
    slug: 'aura-intelligence-platform',
    shortDescription: 'Enterprise AI orchestration workspace enabling cross-functional engineering teams to automate multi-agent workflows.',
    description: 'A comprehensive ground-up UX overhaul for a Silicon Valley enterprise intelligence system. We distilled high-dimensional telemetry data into an intuitive split-pane canvas workspace that reduced cognitive strain and lowered onboarding time by 62%.',
    category: 'AI & Enterprise Platform',
    tags: ['Design System', 'SaaS UX', 'Enterprise AI'],
    year: 2026,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    metrics: '+62% onboarding speed',
    client: 'Aura Labs'
  },
  {
    id: 'proj-02',
    title: 'Apex Institutional Terminal',
    slug: 'apex-institutional-terminal',
    shortDescription: 'Next-generation high-frequency liquidity interface and portfolio analytics engine.',
    description: 'A dark-mode first, dense financial interface built for institutional capital allocators. Features real-time order-book visualizations, keyboard-driven navigation, and sub-millisecond interaction feedback.',
    category: 'Fintech & Analytics',
    tags: ['Fintech', 'Data Viz', 'Desktop App'],
    year: 2026,
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
    featured: false,
    metrics: '$2.4B daily volume processed',
    client: 'Apex Financial'
  },
  {
    id: 'proj-03',
    title: 'Kinetic Health Monitor',
    slug: 'kinetic-health-monitor',
    shortDescription: 'Preventative biometric monitoring application translating clinical laboratory metrics into daily lifestyle habits.',
    description: 'Bridging healthcare precision with consumer lifestyle aesthetics. Clean typographic treatments, accessible contrast ratios, and reassuring micro-interactions that make health tracking effortless.',
    category: 'Digital Health',
    tags: ['Mobile Product', 'HealthTech', 'iOS / Android'],
    year: 2025,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    featured: false,
    metrics: '4.9★ App Store rating',
    client: 'Kinetic Health'
  },
  {
    id: 'proj-04',
    title: 'Vektor Spatial Architecture',
    slug: 'vektor-spatial-architecture',
    shortDescription: 'Collaborative spatial 3D canvas for architectural teams and urban planners.',
    description: 'A cloud-based real-time 3D collaboration suite designed to replace clunky legacy CAD viewers with a seamless web experience running WebGL and WebGPU acceleration.',
    category: 'Web3 & Spatial Computing',
    tags: ['WebGL', 'Collaboration', 'Product Design'],
    year: 2025,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    metrics: '340K active architects',
    client: 'Vektor Systems'
  },
  {
    id: 'proj-05',
    title: 'Mono Brand & Digital Flagship',
    slug: 'mono-brand-flagship',
    shortDescription: 'Minimalist editorial eCommerce experience celebrating precision industrial design.',
    description: 'An editorial-driven commerce flagship featuring architectural typography, serene negative space, and custom fluid transition physics crafted to highlight physical hardware craftsmanship.',
    category: 'Brand & Flagship Web',
    tags: ['Brand Identity', 'Creative Direction', 'E-Commerce'],
    year: 2025,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    featured: false,
    metrics: '+44% conversion rate',
    client: 'Mono Instruments'
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Uncover the core leverage points',
    description: 'We immerse ourselves in your business goals, user bottlenecks, and technical constraints. No assumptions—just disciplined inquiry to find what truly matters.'
  },
  {
    number: '02',
    title: 'Define',
    summary: 'Architect the foundation',
    description: 'We distill complex feature requests into an uncluttered product structure. We establish the product thesis, information hierarchy, and success metrics before design begins.'
  },
  {
    number: '03',
    title: 'Design',
    summary: 'Craft with relentless rigor',
    description: 'Rapid, iterative exploration followed by pixel-perfect execution. We design every screen, state, and subtle transition with attention to micro-typography, clarity, and rhythm.'
  },
  {
    number: '04',
    title: 'Deliver',
    summary: 'Empower engineering execution',
    description: 'We collaborate shoulder-to-shoulder with development, shipping battle-tested component systems, interactive specs, and production-ready code with zero handoff friction.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Orbitly Studio took our densest enterprise workflow and transformed it into something our customers praise on sales calls every week. Their understanding of product mechanics is unmatched.',
    author: 'Elena Rostova',
    role: 'Chief Product Officer',
    company: 'Aura Intelligence'
  },
  {
    id: 'test-2',
    quote: 'They operate with a level of craft and senior judgment you rarely find in agencies. No filler, no bloated process—just exceptional design that immediately accelerated our Series A traction.',
    author: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'Apex Financial Technologies'
  },
  {
    id: 'test-3',
    quote: 'Our engineering team loved their design system handoff. Every state was documented, tokens were clean, and we shipped our mobile redesign three weeks ahead of our aggressive deadline.',
    author: 'Devon Wright',
    role: 'VP of Engineering',
    company: 'Kinetic Health Labs'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Designing for clarity in complex products',
    slug: 'designing-for-clarity-in-complex-products',
    excerpt: 'How to reduce cognitive burden in data-dense interfaces without dumbing down critical power-user workflows.',
    category: 'Product Design',
    date: 'Sep 2026',
    readTime: '6 min read',
    featured: true
  },
  {
    id: 'post-2',
    title: 'Why good interfaces feel almost invisible',
    slug: 'why-good-interfaces-feel-almost-invisible',
    excerpt: 'The best software gets out of the user’s way. A study on spatial ergonomics, predictability, and micro-delight.',
    category: 'Design Philosophy',
    date: 'Aug 2026',
    readTime: '4 min read',
    featured: false
  },
  {
    id: 'post-3',
    title: 'Building design systems that actually scale',
    slug: 'building-design-systems-that-actually-scale',
    excerpt: 'Common pitfalls that cause corporate UI libraries to rot within six months, and how semantic tokens protect your velocity.',
    category: 'Engineering & Systems',
    date: 'Aug 2026',
    readTime: '8 min read',
    featured: false
  },
  {
    id: 'post-4',
    title: 'From prototype to product: what changes',
    slug: 'from-prototype-to-product-what-changes',
    excerpt: 'Navigating the brutal delta between an optimistic Figma demo and resilient production-grade software.',
    category: 'Product Strategy',
    date: 'Jul 2026',
    readTime: '5 min read',
    featured: false
  }
];
