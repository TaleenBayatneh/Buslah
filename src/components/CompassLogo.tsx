import { cn } from "@/lib/utils";

interface CompassLogoProps {
  className?: string;
  animated?: boolean;
}

/**
 * Boslah brand compass — a stylized compass rose with an animated needle.
 */
export function CompassLogo({ className, animated = true }: CompassLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary-foreground", className)}
      aria-hidden="true"
    >
      {/* outer ring */}
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="2 3" />

      {/* cardinal ticks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="32"
          y1="6"
          x2="32"
          y2={deg % 90 === 0 ? "11" : "9"}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? "1.5" : "1"}
          opacity={deg % 90 === 0 ? "0.7" : "0.4"}
          transform={`rotate(${deg} 32 32)`}
        />
      ))}

      {/* needle (north red-style + south) */}
      <g className={animated ? "animate-compass-needle" : ""} style={{ transformOrigin: "32px 32px" }}>
        <polygon points="32,10 28,32 32,30 36,32" fill="currentColor" />
        <polygon points="32,54 28,32 32,34 36,32" fill="currentColor" opacity="0.45" />
      </g>

      {/* center pin */}
      <circle cx="32" cy="32" r="3" fill="currentColor" />
      <circle cx="32" cy="32" r="1.2" fill="var(--card)" />
    </svg>
  );
}