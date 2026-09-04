import React from 'react';
import { markdownToHtml, sanitizeBlogContent } from '@/lib/contentUtils';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  // Convert legacy markdown if needed, and sanitize strictly against XSS
  const html = markdownToHtml(content);
  const safeHtml = sanitizeBlogContent(html);

  return (
    <div
      className="prose prose-invert max-w-none text-zinc-300 text-base sm:text-lg leading-relaxed
        [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:text-white [&_h1]:pt-10 [&_h1]:pb-4
        [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-white [&_h2]:pt-8 [&_h2]:pb-3
        [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-white [&_h3]:pt-6 [&_h3]:pb-2
        [&_p]:leading-relaxed [&_p]:text-zinc-300 [&_p]:mb-6
        [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-400 [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:text-zinc-300 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:sm:text-xl
        [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:pl-2 [&_ul]:text-zinc-300 [&_ul]:mb-6
        [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:pl-2 [&_ol]:text-zinc-300 [&_ol]:mb-6
        [&_li]:leading-relaxed
        [&_strong]:text-white [&_strong]:font-semibold
        [&_em]:text-zinc-200 [&_em]:italic
        [&_u]:underline [&_u]:underline-offset-2
        [&_a]:text-emerald-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-emerald-300 [&_a]:transition-colors
        [&_hr]:border-zinc-800 [&_hr]:my-10"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
