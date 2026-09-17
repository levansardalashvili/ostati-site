import { Bell, Search, Star, Wrench, Zap } from 'lucide-react';
import { PhoneTabBar } from '../PhoneTabBar';

const PROVIDERS = [
  { initials: 'დბ', color: 'bg-blue-600', name: 'დავით ბერიძე', rating: '4.9', specialty: 'სანტექნიკოსი' },
  { initials: 'ნქ', color: 'bg-emerald-600', name: 'ნინო ქავთარაძე', rating: '4.8', specialty: 'ელექტრიკოსი' },
  { initials: 'გმ', color: 'bg-purple-600', name: 'გიორგი მაისურაძე', rating: '5.0', specialty: 'მღებავი' },
];

export function HomeScreen() {
  return (
    <>
      <div className="flex-1 overflow-hidden px-4 pb-2">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
            გგ
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">გამარჯობა,</p>
            <p className="truncate text-xs font-bold text-slate-900">გიორგი 👋</p>
          </div>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <Bell size={12} className="text-slate-500" />
          </span>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-200">
          <Search size={13} className="text-slate-400" />
          <span className="text-[10px] text-slate-400">მოძებნე ოსტატი...</span>
        </div>

        {/* Service tiles */}
        <p className="mt-4 text-[10px] font-semibold text-slate-500">სერვისები</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Wrench size={13} />
            </span>
            <span className="text-[9px] font-medium text-slate-700">სანტექნიკა</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Zap size={13} />
            </span>
            <span className="text-[9px] font-medium text-slate-700">ელექტროობა</span>
          </div>
        </div>

        {/* Top providers */}
        <p className="mt-4 text-[10px] font-semibold text-slate-500">ტოპ ოსტატები შენს არეალში</p>
        <div className="mt-2 space-y-2">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${p.color}`}
                >
                  {p.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-slate-900">{p.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={8} className="fill-amber-400 text-amber-400" />
                    <span className="text-[8px] text-slate-500">
                      {p.rating} · {p.specialty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PhoneTabBar />
    </>
  );
}
