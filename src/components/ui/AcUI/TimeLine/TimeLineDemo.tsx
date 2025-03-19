"use client";
import Image from "next/image";
import React from "react";
import { Timeline } from "./timeline";

export function CyberFortTimeline() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Expanded our services with advanced cybersecurity training programs and launched enterprise security solutions
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/timeline/cybertrainingtimeline.png" 
              alt="Cybersecurity Training"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/timeline/webdtraining.webp" 
              alt="Web Development"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="text-neutral-100 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Successfully trained over 1000 students in cybersecurity fundamentals and launched corporate training programs
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Established Cybersecurity Training Center
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Launched Web Development Bootcamp
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Started Corporate Security Consulting
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Introduced Ethical Hacking Course
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Services",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Comprehensive Tech Education & Security Solutions
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              🔒 Advanced Cybersecurity Training
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              💻 Full-Stack Web Development Courses
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              🛡️ Enterprise Security Solutions
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              🌐 Custom Website Development
            </div>
            <div className="flex gap-2 items-center text-neutral-100 dark:text-neutral-300 text-xs md:text-sm">
              👥 Corporate Training Programs
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/timeline/securityaudit.jpg"
              alt="Security Audit"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/timeline/codingbootcamp.webp"
              alt="Coding Bootcamp"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}