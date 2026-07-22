import { cn } from "@/lib/utils";

/**
 * Academic crest for the school — a shield holding a lamp of knowledge
 * rising over an open book. Uses the brand navy + gold.
 */
export function Crest({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-10 w-10", className)}
      role="img"
      aria-label="School crest"
    >
      <defs>
        <linearGradient id="crest-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.4 0.1 264)" />
          <stop offset="100%" stopColor="oklch(0.3 0.085 264)" />
        </linearGradient>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.11 88)" />
          <stop offset="100%" stopColor="oklch(0.74 0.13 74)" />
        </linearGradient>
      </defs>

      {/* Shield */}
      <path
        d="M32 3.5 58 11.5V31c0 15.2-10.4 25.4-26 29.5C16.4 56.4 6 46.2 6 31V11.5L32 3.5Z"
        fill="url(#crest-shield)"
        stroke="url(#crest-gold)"
        strokeWidth="1.6"
      />

      {/* Lamp flame */}
      <path
        d="M32 15c2.6 3 4 5.4 4 7.8a4 4 0 1 1-8 0c0-2.4 1.4-4.8 4-7.8Z"
        fill="url(#crest-gold)"
      />

      {/* Rays */}
      <g stroke="url(#crest-gold)" strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
        <line x1="22" y1="24" x2="18.5" y2="22" />
        <line x1="42" y1="24" x2="45.5" y2="22" />
        <line x1="23" y1="30" x2="19" y2="30" />
        <line x1="41" y1="30" x2="45" y2="30" />
      </g>

      {/* Open book */}
      <path
        d="M15 38c5-2.6 11-2.6 17 0 6-2.6 12-2.6 17 0v9c-5-2.4-11-2.4-17 0-6-2.4-12-2.4-17 0v-9Z"
        fill="oklch(0.98 0.008 85)"
      />
      <line x1="32" y1="39" x2="32" y2="47" stroke="oklch(0.4 0.1 264)" strokeWidth="1.3" />
      <g stroke="oklch(0.55 0.06 264)" strokeWidth="0.9" opacity="0.7">
        <line x1="19" y1="40.5" x2="29" y2="41.5" />
        <line x1="19" y1="43.5" x2="29" y2="44.5" />
        <line x1="35" y1="41.5" x2="45" y2="40.5" />
        <line x1="35" y1="44.5" x2="45" y2="43.5" />
      </g>
    </svg>
  );
}
