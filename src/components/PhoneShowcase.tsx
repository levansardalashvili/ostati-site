import { PhoneFrame } from './PhoneFrame';
import { ChatScreen } from './phoneScreens/ChatScreen';
import { HomeScreen } from './phoneScreens/HomeScreen';

// ორი ტელეფონის კლასტერი — მთავარი (Home ეკრანი) წინ და ცენტრში,
// მეორე (ჩატის ეკრანი) მის უკან, პატარა, ოდნავ დახრილი, ჩრდილით —
// სტანდარტული "device cluster" hero-პატერნი. მობილურ ვიუზე მეორე
// ტელეფონი იმალება (ადგილი არ ჰყოფნის ორივეს ლამაზად ჩასატევად ვიწრო
// ეკრანზე) — მთავარი ცალკე კარგად მუშაობს იქაც.
export function PhoneShowcase() {
  return (
    <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center px-4 py-10 sm:py-14">
      <div className="absolute right-2 top-16 hidden rotate-6 opacity-95 sm:right-6 sm:block md:right-10">
        <PhoneFrame className="!w-[230px] md:!w-[260px]">
          <ChatScreen />
        </PhoneFrame>
      </div>
      <div className="relative z-10 -translate-x-6 sm:-translate-x-16 md:-translate-x-20">
        <PhoneFrame>
          <HomeScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
