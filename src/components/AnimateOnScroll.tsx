"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Animation = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up";

interface Props {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
}

const initialStates: Record<Animation, string> = {
  "fade-up": "opacity-0 translate-y-8",
  "fade-in": "opacity-0",
  "fade-left": "opacity-0 -translate-x-8",
  "fade-right": "opacity-0 translate-x-8",
  "scale-up": "opacity-0 scale-95",
};

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className,
}: Props) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : initialStates[animation],
        className
      )}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
