import { FilePlus2, Home, MessageCircle, User } from 'lucide-react';

const TABS = [
  { icon: Home, label: 'მთავარი', active: true },
  { icon: FilePlus2, label: 'განცხადებები', active: false },
  { icon: MessageCircle, label: 'ჩატები', active: false },
  { icon: User, label: 'პროფილი', active: false },
];

export function PhoneTabBar() {
  return (
    <div className="mt-auto flex items-center justify-around border-t border-slate-200 bg-white px-2 pb-6 pt-2">
      {TABS.map((t) => (
        <div key={t.label} className="flex flex-col items-center gap-0.5">
          <t.icon size={16} className={t.active ? 'text-blue-600' : 'text-slate-400'} strokeWidth={t.active ? 2.4 : 1.8} />
          <span className={`text-[7px] font-medium ${t.active ? 'text-blue-600' : 'text-slate-400'}`}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
