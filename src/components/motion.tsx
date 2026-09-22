"use client";

/**
 * The public site's motion vocabulary, built on Motion (motion.dev). Every
 * piece here is a thin wrapper so the server-rendered sections can opt in
 * without becoming client components themselves.
 *
 * MotionProvider sets reducedMotion="user": a visitor who has asked their
 * device for less motion gets content in place with no movement at all.
 */

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const noSubscribe = () => () => {};

/**
 * True once the page has hydrated. The server cannot know a visitor's motion
 * setting, so anything that changes rendered styles on it must wait for this,
 * or the first client render would not match the HTML the server sent.
 */
function useHydrated() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Rises a little and fades in the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

/**
 * A list whose items come in one after another. Use RevealItem for each
 * child; `as` keeps list semantics (ul/ol/dl) intact.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "figure";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}

/**
 * Moves its content against the scroll, so a photograph drifts inside its
 * frame. The content overhangs the frame by the travel distance, top and
 * bottom, so no edge ever shows. Give the frame a height (an aspect ratio or
 * h-full) and make the child fill it.
 */
export function Parallax({
  children,
  className,
  strength = 60,
}: {
  children: React.ReactNode;
  className?: string;
  /** Pixels travelled across the whole pass through the viewport. */
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // MotionConfig's reducedMotion covers animations but not values bound to
  // the scroll, so the travel is switched off here by hand, once hydrated.
  // The overhang stays the same either way so the frame never changes size.
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const travel = hydrated && reduce ? 0 : strength;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-x-0" style={{ y, top: -strength, bottom: -strength }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Counts a figure such as "2,400+" or "98%" up from zero when it comes into
 * view. The server renders the finished figure, so it reads correctly without
 * JavaScript; the count only replaces it while it is still below the screen.
 * A four-digit number with no comma is taken to be a year and left alone.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = useMemo(() => value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/), [value]);
  const isYear = /^\d{4}$/.test(match?.[2] ?? "");
  const animated = Boolean(match) && !isYear && !reduce;
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animated || !match) return;
    // Only count if the figure has not been seen yet; one already on screen stays put.
    if (!armed.current && el.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true;
      el.textContent = `${match[1]}0${match[3]}`;
    }
  }, [animated, match]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !armed.current || !match) return;
    const target = Number(match[2].replace(/,/g, ""));
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${match[1]}${v.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${match[3]}`;
      },
      onComplete: () => {
        el.textContent = value;
      },
    });
    return () => controls.stop();
  }, [inView, match, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
