import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPostBySlug } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MarkdownContent from '@/components/blog/MarkdownContent';

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getBlogPostBySlug(slug);

  if (!res.data) {
    return {
      title: 'Article Not Found — Orbitly Studio',
      description: 'The requested article could not be located.',
    };
  }

  const post = res.data;
  return {
    title: `${post.title} — Orbitly Studio Notes`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Orbitly Studio Notes`,
      description: post.excerpt,
      images: [
        {
          url: post.featuredImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const res = await getBlogPostBySlug(slug);

  if (!res.data) {
    notFound();
  }

  const post = res.data;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 mb-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to studio writing</span>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-6 sm:px-8">
          <header className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{post.date}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{post.readTime}</span>
              {post.author && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">By {post.author}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.12]">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-normal pt-2">
              {post.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-[280px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 mb-14">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-16">
            <MarkdownContent content={post.content || post.excerpt} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 border-t border-zinc-900 flex flex-wrap items-center gap-2 mb-16">
              <span className="text-xs font-mono text-zinc-500 uppercase mr-2">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="pt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>All articles & notes</span>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all"
            >
              Discuss a project
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
