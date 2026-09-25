import { marked } from 'marked';

export async function MarkdownContent({ content }: { content: string }) {
  const html = await marked.parse(content);

  return (
    <div
      className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-a:font-semibold prose-a:text-blue-600 prose-li:marker:text-blue-500 prose-strong:text-slate-900"
      // Content is admin-authored (site_pages.content, RLS-gated to
      // role='admin' writers only) — trusted, not user-submitted.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
