import { Marked } from 'marked';

// Markdown → HTML, უსაფრთხო რეჟიმში. ტექსტს წერს ადმინი (RLS), მაგრამ ადმინის ანგარიშის გატეხვის შემთხვევაში
// გვერდზე ბოროტი კოდის ჩასმა (XSS) ყველა ვიზიტორზე არ უნდა გავრცელდეს:
//  - ნედლი HTML (<script>, <iframe>, onerror=...) მთლიანად იჭრება
//  - ბმული მხოლოდ http(s)/mailto/tel/შიდა (/, #); javascript:/data: ბმული უბრალო ტექსტად რჩება
//  - სურათი მხოლოდ http(s) ან შიდა მისამართიდან
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
const SAFE_IMG = /^(https?:\/\/|\/)/i;

const md = new Marked({
  renderer: {
    html: () => '',
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (!SAFE_LINK.test(href.trim())) return text;
      return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}>${text}</a>`;
    },
    image({ href, title, text }) {
      if (!SAFE_IMG.test(href.trim())) return esc(text);
      return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''}>`;
    },
  },
});

export function renderMarkdown(content: string): string {
  return md.parse(content, { async: false }) as string;
}
