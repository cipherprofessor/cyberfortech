"use client";

import HeroSection from "@/components/home/HeroSection/HeroSection";
import HeroUIJustTabs from "@/components/ui/HeroUI/Tabs/JustTabs";




export default function Home() {
  return (
   
    <>
      <div className="flex flex-col items-center justify-center m-20 w-full p-20">
        {/* <HeroUIJustTabs /> */}

        <HeroSection />
      </div>
    </>
  );
}
