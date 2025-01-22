// src/components/ui/AcUI/Sparkles/sparkles.tsx
"use client";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useEffect, useRef } from "react";


interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className,
  particleColor = "#FFFFFF"
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();
  const particles = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
  }>>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create initial particles
    const createParticles = () => {
      particles.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / (10000 / particleDensity));
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
        });
      }
    };
    createParticles();

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.speedX -= (dx / distance) * force * 0.02;
            particle.speedY -= (dy / distance) * force * 0.02;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [maxSize, minSize, particleDensity, particleColor, mousePosition.x, mousePosition.y]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{
        background,
      }}
      className={className}
    />
  );
};