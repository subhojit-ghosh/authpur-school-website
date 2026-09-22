import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The school's crest: a maroon ring carrying the school's name in gold, around
 * a lamp of learning, a green candle whose flame burns inside an orange
 * cogwheel. Redrawn as a vector from the 60px badge on the school's previous
 * website, so it stays sharp at any size; the small Bengali line inside the
 * original was too small to read there and is left out until the school
 * supplies its artwork. src/app/icon.svg is the same drawing for the favicon.
 */
export function Crest({ className }: { className?: string }) {
  // Each crest on the page needs its own id for the circle the name follows.
  const ring = `crest-ring-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg viewBox="0 0 100 100" className={cn("h-10 w-10", className)} role="img" aria-label="School crest">
      <circle cx="50" cy="50" r="49" fill="#6e1d17" />
      <circle cx="50" cy="50" r="47.2" fill="none" stroke="#e8b84a" strokeWidth="1" />
      <circle cx="50" cy="50" r="33.5" fill="#fffaf0" stroke="#e8b84a" strokeWidth="1.2" />

      {/* The name, running clockwise from the lower left over the top */}
      <path id={ring} d="M50,90.6 a40.6,40.6 0 1,1 0,-81.2 a40.6,40.6 0 1,1 0,81.2" fill="none" />
      <text
        fill="#f2c55a"
        fontSize="7.4"
        fontWeight="700"
        letterSpacing="0.3"
        style={{ fontFamily: "var(--font-outfit), Arial, sans-serif" }}
      >
        <textPath href={`#${ring}`} startOffset="7%" textLength="220" lengthAdjust="spacingAndGlyphs">
          AUTHPUR NATIONAL MODEL HIGHER SECONDARY SCHOOL
        </textPath>
      </text>
      <path d="M50,86.8 l1.1,2.3 2.5,.3 -1.8,1.7 .5,2.5 -2.3,-1.2 -2.3,1.2 .5,-2.5 -1.8,-1.7 2.5,-.3z" fill="#f2c55a" />

      {/* Cogwheel */}
      <g fill="#e4572e">
        <circle cx="50" cy="40" r="11" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x="47.8" y="26.4" width="4.4" height="5" rx="0.8" transform={`rotate(${i * 36} 50 40)`} />
        ))}
      </g>
      <circle cx="50" cy="40" r="7.4" fill="#fffaf0" />

      {/* Candle and flame */}
      <rect x="45.8" y="49" width="8.4" height="27" rx="1" fill="#1f7a3e" stroke="#123f22" strokeWidth="1" />
      <rect x="42.5" y="75.5" width="15" height="3.2" rx="1" fill="#123f22" />
      <path d="M50,30.5 C54.2,35.8 55,39.6 50,46.5 C45,39.6 45.8,35.8 50,30.5Z" fill="#e1322a" />
      <path d="M50,35.2 C52.2,38.2 52.6,40.4 50,44 C47.4,40.4 47.8,38.2 50,35.2Z" fill="#f7c948" />
    </svg>
  );
}
