import { marked } from 'marked';

export async function MarkdownContent({ content }: { content: string }) {
  const html = await marked.parse(content);

  return (
    <div
      className="prose prose-slate max-w-none prose-a:text-blue-600"
      // Content is admin-authored (site_pages.content, RLS-gated to
      // role='admin' writers only) — trusted, not user-submitted.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
