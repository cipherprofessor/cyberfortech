// src/components/ui/card-hover-effect.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link: string;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: CardItem[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (isMobile) return;

    const rect = containerRefs.current[index]?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRefs.current[index]?.style.setProperty("--mouse-x", `${x}px`);
      containerRefs.current[index]?.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    >
      {items.map((item, idx) => (
        <a
          key={item.link}
        //   href={(el: HTMLAnchorElement | null) => (containerRefs.current[idx] = el)}
          href={item.link}
          className="relative group block p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all duration-300"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => handleMouseMove(e, idx)}
        >
          <div className="relative z-10">
            <div className="mb-4 text-primary">
              {item.icon}
            </div>
            <div className="mb-2 font-bold text-xl text-gray-900 dark:text-gray-100">
              {item.title}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>

          {!isMobile && (
            <>
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,123,255,0.1), transparent 40%)",
                }}
              />
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredIndex === idx ? 1 : 0,
                  scale: hoveredIndex === idx ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 opacity-0"
                style={{
                  clipPath:
                    hoveredIndex === idx
                      ? "circle(100% at var(--mouse-x) var(--mouse-y))"
                      : "circle(0% at var(--mouse-x) var(--mouse-y))",
                }}
              />
            </>
          )}
        </a>
      ))}
    </div>
  );
};