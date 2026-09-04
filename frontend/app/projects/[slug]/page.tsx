import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);

  if (!res.data) {
    return {
      title: 'Project Not Found — Orbitly Studio',
      description: 'The requested project case study could not be located.',
    };
  }

  const project = res.data;
  return {
    title: `${project.title} — Case Study — Orbitly Studio`,
    description: project.shortDescription || project.description,
    openGraph: {
      title: `${project.title} — Case Study — Orbitly Studio`,
      description: project.shortDescription || project.description,
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);

  if (!res.data) {
    notFound();
  }

  const project = res.data;

  const sections = [
    {
      num: '01',
      title: 'The Challenge',
      content: project.challenge,
    },
    {
      num: '02',
      title: 'Our Approach',
      content: project.approach,
    },
    {
      num: '03',
      title: 'The Solution',
      content: project.solution,
    },
    {
      num: '04',
      title: 'The Outcome',
      content: project.outcome,
    },
  ].filter((s) => Boolean(s.content));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to selected work</span>
          </Link>
        </div>

        {/* Project Hero */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 lg:mb-20">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 uppercase tracking-widest">
                {project.category}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{project.year}</span>
              {project.client && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{project.client}</span>
                </>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.08]">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-3xl">
              {project.shortDescription || project.description}
            </p>
          </div>

          {/* Project Meta Details Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 mt-10 border-t border-zinc-900 text-xs font-mono">
            <div>
              <p className="text-zinc-500 uppercase tracking-wider mb-1.5">Category</p>
              <p className="text-zinc-200">{project.category}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase tracking-wider mb-1.5">Timeline</p>
              <p className="text-zinc-200">{project.year}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase tracking-wider mb-1.5">Focus Areas</p>
              <p className="text-zinc-200">
                {project.tags.length > 0 ? project.tags.join(', ') : 'Product Design'}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase tracking-wider mb-1.5">Impact</p>
              <p className="text-emerald-400">
                {project.metrics || 'Measurable growth'}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-20 lg:mb-28">
          <div className="relative h-[360px] sm:h-[500px] lg:h-[650px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Case Study Content Narrative */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Sidebar: Overview & Services */}
            <div className="lg:col-span-4 space-y-8">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                    Project Overview
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.services && project.services.length > 0 && (
                  <div className="pt-6 border-t border-zinc-900">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                      Services Provided
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.services.map((srv) => (
                        <span
                          key={srv}
                          className="text-xs font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Narrative Case Study Breakdown */}
            <div className="lg:col-span-8 space-y-12 divide-y divide-zinc-900">
              {sections.map((sec) => (
                <div key={sec.num} className="pt-12 first:pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-emerald-400">
                      // {sec.num}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-base sm:text-lg text-zinc-300 leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Images Gallery (If available) */}
        {project.images && project.images.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-24">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-6">
              Gallery & Artifacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="relative h-72 sm:h-96 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950"
                >
                  <Image
                    src={imgUrl}
                    alt={`${project.title} artifact ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation CTA */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Return to all selected work</span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all"
          >
            Start a project with us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
