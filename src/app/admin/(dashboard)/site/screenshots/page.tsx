import { createClient } from '@/lib/supabase-admin/server';
import { screenshotUrl } from '@/lib/supabase';
import { ScreenshotsEditor } from './ScreenshotsEditor';

export default async function ScreenshotsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_screenshots').select('id, path, alt').order('sort_order', { ascending: true });
  const shots = (data ?? []).map((s) => ({ id: s.id, alt: s.alt, url: screenshotUrl(s.path) }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">აპის ეკრანები</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        საიტზე ტელეფონის მაკეტებში ჩანს აპის რეალური ეკრანები. პირველი ორი ჩანს მთავარის ზედა ნაწილში, დანარჩენი — ქვემოთ გალერეაში.
        ფოტოს პროპორცია მობილურის ეკრანისა უნდა იყოს (ვერტიკალური screenshot).
      </p>
      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <ScreenshotsEditor shots={shots} />
      )}
    </div>
  );
}
