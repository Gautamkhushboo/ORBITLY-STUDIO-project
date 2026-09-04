// frontend/lib/contentUtils.ts
import sanitizeHtml from 'sanitize-html';

/**
 * Checks if a string contains HTML tags
 */
export function isHtml(content: string): boolean {
  if (!content) return false;
  return /<\/?(p|h[1-6]|ul|ol|li|blockquote|strong|em|u|a|hr|br|div|span)[^>]*>/i.test(content);
}

/**
 * Converts inline markdown tokens (**bold**, *italic*, [link](url)) to HTML
 */
function parseInlineMarkdown(text: string): string {
  let parsed = text;

  // Escape HTML entities to prevent raw injection before formatting
  parsed = parsed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text* or _text_
  parsed = parsed.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  parsed = parsed.replace(/_(.*?)_/g, '<em>$1</em>');

  // Links [text](url) - strictly enforce safe URLs
  parsed = parsed.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return parsed;
}

/**
 * Converts legacy Markdown strings to semantic HTML for TipTap or public rendering
 */
export function markdownToHtml(content: string): string {
  if (!content || !content.trim()) return '<p></p>';

  // If it already contains HTML tags, return as-is
  if (isHtml(content)) {
    return content;
  }

  const blocks = content.split(/\n\s*\n/);
  const htmlBlocks: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith('### ')) {
      htmlBlocks.push(`<h3>${parseInlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      htmlBlocks.push(`<h2>${parseInlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      htmlBlocks.push(`<h1>${parseInlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join(' ');
      htmlBlocks.push(`<blockquote><p>${parseInlineMarkdown(quoteText)}</p></blockquote>`);
      continue;
    }

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(trimmed)) {
      htmlBlocks.push('<hr />');
      continue;
    }

    const lines = trimmed.split('\n');

    // Bullet List
    if (lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
      const items = lines.map((l) => `<li>${parseInlineMarkdown(l.replace(/^[-*]\s+/, ''))}</li>`).join('');
      htmlBlocks.push(`<ul>${items}</ul>`);
      continue;
    }

    // Ordered List
    if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
      const items = lines.map((l) => `<li>${parseInlineMarkdown(l.replace(/^\d+\.\s+/, ''))}</li>`).join('');
      htmlBlocks.push(`<ol>${items}</ol>`);
      continue;
    }

    // Standard Paragraph
    const paraText = lines.map((l) => parseInlineMarkdown(l.trim())).join(' ');
    htmlBlocks.push(`<p>${paraText}</p>`);
  }

  return htmlBlocks.join('');
}

/**
 * Sanitizes rich text HTML strictly against XSS attacks, disallowed tags,
 * and dangerous protocols like javascript:
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'b',
      'i',
      'strong',
      'em',
      'u',
      'strike',
      's',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'code',
      'pre',
      'br',
      'span',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      span: ['class'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (_tagName, attribs) => {
        const href = attribs.href || '';
        // Block javascript: or vbscript: or data: links
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('/')) {
          return { tagName: 'span', attribs: { class: 'broken-link text-zinc-500' } };
        }
        const safeAttribs: Record<string, string> = {
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
        };
        if (attribs.class) {
          safeAttribs.class = attribs.class;
        }
        return {
          tagName: 'a',
          attribs: safeAttribs,
        };
      },
    },
  });
}
