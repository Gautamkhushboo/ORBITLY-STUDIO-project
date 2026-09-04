'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
  placeholder = 'Write your article content here...',
}: RichTextEditorProps) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        validate: (href) => {
          return (
            href.startsWith('https://') ||
            href.startsWith('http://') ||
            href.startsWith('mailto:') ||
            href.startsWith('/')
          );
        },
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If editor only contains an empty paragraph, send empty string or html
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class:
          'tiptap focus:outline-none min-h-[320px] p-5 text-zinc-300 leading-relaxed text-sm sm:text-base font-sans selection:bg-emerald-500/30 selection:text-emerald-200',
      },
    },
  });

  // Sync external value updates (e.g. when post finishes loading in edit view)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value && value !== currentHtml && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkModalOpen(true);
  }, [editor]);

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let validUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('mailto:') && !validUrl.startsWith('/')) {
        validUrl = `https://${validUrl}`;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl('');
  };

  const handleRemoveLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
    setLinkModalOpen(false);
    setLinkUrl('');
  };

  if (!editor) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-8 text-center text-xs font-mono text-zinc-500 animate-pulse">
        Initializing Rich Text Editor...
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-950/80 transition-all duration-200 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-300">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          title="Heading 1"
          aria-label="Heading 1"
          className={`px-2.5 py-1 text-xs font-mono font-semibold rounded transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          title="Heading 2"
          aria-label="Heading 2"
          className={`px-2.5 py-1 text-xs font-mono font-semibold rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          title="Heading 3"
          aria-label="Heading 3"
          className={`px-2.5 py-1 text-xs font-mono font-semibold rounded transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={disabled}
          title="Paragraph / Normal Text"
          aria-label="Paragraph"
          className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
            editor.isActive('paragraph') && !editor.isActive('heading')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          P
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* Inline Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
          className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
          className={`px-2.5 py-1 text-xs italic font-serif rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
          className={`px-2.5 py-1 text-xs underline underline-offset-2 rounded transition-colors ${
            editor.isActive('underline')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          U
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          title="Bullet List"
          aria-label="Bullet List"
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          title="Ordered / Numbered List"
          aria-label="Ordered List"
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          1. List
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* Quotes & Separators */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          title="Blockquote"
          aria-label="Blockquote"
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          &ldquo; Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
          title="Horizontal Rule"
          aria-label="Horizontal Rule"
          className="px-2.5 py-1 text-xs font-mono text-zinc-400 hover:bg-zinc-800/80 hover:text-white rounded transition-colors"
        >
          ― Divider
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          disabled={disabled}
          title="Add / Edit Hyperlink"
          aria-label="Link"
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            editor.isActive('link')
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-zinc-800/80 hover:text-white text-zinc-400'
          }`}
        >
          🔗 Link
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-800 mx-1" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          className="px-2 py-1 text-xs font-mono text-zinc-400 hover:bg-zinc-800/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded transition-colors"
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          className="px-2 py-1 text-xs font-mono text-zinc-400 hover:bg-zinc-800/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded transition-colors"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="min-h-[320px] bg-zinc-950/60 [&_.tiptap]:outline-none [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-5 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:leading-relaxed [&_p]:text-zinc-300 [&_p]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400 [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:mb-4 [&_hr]:border-zinc-800 [&_hr]:my-6">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Word Count & Helper */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/40 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
        <span>Rich Text (HTML output)</span>
        <span>
          {editor.storage.characterCount
            ? `${editor.storage.characterCount.words()} words`
            : `${(editor.getText() || '').trim().split(/\s+/).filter(Boolean).length} words`}
        </span>
      </div>

      {/* Link Insertion Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-medium text-white">
              {editor.isActive('link') ? 'Edit Link' : 'Insert Link'}
            </h3>
            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  URL Destination
                </label>
                <input
                  type="text"
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                {editor.isActive('link') ? (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove Link
                  </button>
                ) : <span />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-mono font-medium text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                  >
                    Apply Link
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
