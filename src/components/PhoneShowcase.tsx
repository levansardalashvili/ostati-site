import { PhoneFrame } from './PhoneFrame';
import { ChatScreen } from './phoneScreens/ChatScreen';
import { HomeScreen } from './phoneScreens/HomeScreen';

// ორი ტელეფონის კლასტერი: მთავარი ეკრანი წინ, ჩატი უკან და ოდნავ დახრილი. ქვედა ნაწილი განზრახ მოჭრილია და
// ფერმკრთალდება (mask) — ტელეფონები "ამოდიან" ქვემოდან, გვერდზე ცარიელი ადგილი არ რჩება.
export function PhoneShowcase() {
  return (
    <div
      className="relative mx-auto h-[460px] w-full max-w-[560px] overflow-hidden sm:h-[560px]"
      style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}
    >
      <div className="absolute left-1/2 top-16 hidden translate-x-[5%] rotate-6 sm:block">
        <PhoneFrame className="!w-[250px]">
          <ChatScreen />
        </PhoneFrame>
      </div>
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 sm:-translate-x-[78%]">
        <PhoneFrame className="!w-[240px] sm:!w-[275px]">
          <HomeScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
