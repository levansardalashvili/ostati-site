import { PhoneFrame } from './PhoneFrame';
import { ChatScreen } from './phoneScreens/ChatScreen';
import { HomeScreen } from './phoneScreens/HomeScreen';
import type { SiteScreenshot } from '@/lib/supabase';

export function ScreenshotImage({ shot }: { shot: SiteScreenshot }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={shot.url} alt={shot.alt} className="absolute inset-0 h-full w-full object-cover object-top" />;
}

// ორი ტელეფონის კლასტერი: მთავარი ეკრანი წინ, მეორე უკან და ოდნავ დახრილი. ქვედა ნაწილი განზრახ მოჭრილია და
// ფერმკრთალდება (mask) — ტელეფონები "ამოდიან" ქვემოდან, გვერდზე ცარიელი ადგილი არ რჩება.
// shots — აპის რეალური ეკრანები (ადმინიდან); ცარიელზე დროებითი დემო ეკრანები ჩანს.
export function PhoneShowcase({ shots }: { shots: SiteScreenshot[] }) {
  const [front, back] = shots;
  return (
    <div
      className="relative mx-auto h-[460px] w-full max-w-[560px] overflow-hidden sm:h-[560px]"
      style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}
    >
      {(back || shots.length === 0) && (
        <div className={`absolute left-1/2 top-16 hidden translate-x-[5%] rotate-6 sm:block`}>
          <PhoneFrame className="!w-[250px]">{back ? <ScreenshotImage shot={back} /> : <ChatScreen />}</PhoneFrame>
        </div>
      )}
      <div className={`absolute left-1/2 top-6 z-10 -translate-x-1/2 ${back || shots.length === 0 ? 'sm:-translate-x-[78%]' : ''}`}>
        <PhoneFrame className="!w-[240px] sm:!w-[275px]">{front ? <ScreenshotImage shot={front} /> : <HomeScreen />}</PhoneFrame>
      </div>
    </div>
  );
}
