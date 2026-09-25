import { marked } from 'marked';

export async function MarkdownContent({ content }: { content: string }) {
  // h2-ებს რიგითი id (#s1, #s2...) — გრძელ გვერდებზე შინაარსის ბმულებისთვის ([1. სათაური](#s1))
  let n = 0;
  const html = (await marked.parse(content)).replace(/<h2>/g, () => `<h2 id="s${++n}">`);

  return (
    <div
      className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:scroll-mt-24 prose-h2:text-2xl prose-h3:mt-8 prose-a:font-semibold prose-a:text-blue-600 prose-li:marker:text-blue-500 prose-strong:text-slate-900 prose-blockquote:rounded-r-xl prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50/70 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-th:bg-slate-50 prose-th:px-3 prose-td:px-3 [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none"
      // Content is admin-authored (site_pages.content, RLS-gated to
      // role='admin' writers only) — trusted, not user-submitted.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
