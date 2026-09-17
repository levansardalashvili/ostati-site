// გაზიარებული ტელეფონის ჩარჩო (border/notch/home-indicator) — შიგთავსი
// (რომელი ეკრანიც უნდა იყოს) `children`-ით მოდის, ჩარჩო ყოველთვის ერთია.
export function PhoneFrame({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-[280px] select-none sm:w-[340px] md:w-[380px] ${className}`}>
      <div className="rounded-[3rem] border-[12px] border-slate-900 bg-slate-900 shadow-2xl">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.2rem] bg-slate-50">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-900/20" />
          <div className="flex h-full flex-col pt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
