import { ArrowLeft, Send } from 'lucide-react';

export function ChatScreen() {
  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-slate-200 bg-white px-3 py-3">
        <ArrowLeft size={14} className="text-slate-500" />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
          დბ
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-slate-900">დავით ბერიძე</p>
          <p className="text-[8px] text-emerald-600">ონლაინ</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden bg-slate-50 px-3 py-3">
        <div className="flex justify-start">
          <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            <p className="text-[9px] text-slate-700">გამარჯობა! რა სჭირდება შეკეთებას?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-blue-600 px-3 py-2">
            <p className="text-[9px] text-white">სამზარეულოში ონკანი მდინარეობს</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            <p className="text-[9px] text-slate-700">კარგი, ხვალ 11:00-სთვის შემიძლია მოვიდე</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-blue-200 bg-blue-50 px-3 py-2">
            <p className="text-[8px] font-semibold text-blue-700">შეთავაზებული ფასი</p>
            <p className="text-[11px] font-bold text-blue-900">45 ₾</p>
            <div className="mt-1.5 flex gap-1.5">
              <span className="rounded-md bg-blue-600 px-2 py-1 text-[7px] font-semibold text-white">დათანხმება</span>
              <span className="rounded-md bg-white px-2 py-1 text-[7px] font-semibold text-slate-500 ring-1 ring-slate-200">
                უარყოფა
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
        <div className="flex-1 rounded-full bg-slate-100 px-3 py-2">
          <span className="text-[9px] text-slate-400">დაწერე შეტყობინება...</span>
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <Send size={11} />
        </span>
      </div>
    </>
  );
}
