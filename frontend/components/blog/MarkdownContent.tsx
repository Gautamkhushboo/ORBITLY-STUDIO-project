import React from 'react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  // Split by double newline or block patterns
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-xl sm:text-2xl font-medium tracking-tight text-white pt-6 pb-2"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white pt-8 pb-3"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={idx}
              className="text-3xl sm:text-4xl font-medium tracking-tight text-white pt-10 pb-4"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-emerald-400 pl-6 py-2 my-6 text-zinc-300 italic font-serif text-lg sm:text-xl"
            >
              {trimmed.slice(2)}
            </blockquote>
          );
        }

        // Bullet lists
        if (trimmed.split('\n').every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map((l) => l.replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 pl-2 text-zinc-300">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed text-zinc-300">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
