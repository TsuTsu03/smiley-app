import Link from "next/link";

/**
 * Smiley brand mark — a tooth with a smile inside a rounded teal square.
 * Self-contained SVG (includes its own background), so it scales crisply
 * anywhere. Swap to a raster by replacing the <svg> with an <img> if you
 * drop the exact file in /public.
 */
export function SmileyIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* rounded square background */}
      <rect x="2" y="2" width="60" height="60" rx="17" fill="#A7E0DF" />
      {/* tooth outline */}
      <path
        d="M32 14
           C24 9, 16.5 11.5, 14.5 20
           C13 27, 15 32.5, 17.3 40
           C18.7 44.6, 19.8 49.6, 24 49
           C27.8 48.5, 28.4 41, 31 39
           C31.6 38.4, 32.4 38.4, 33 39
           C35.6 41, 36.2 48.5, 40 49
           C44.2 49.6, 45.3 44.6, 46.7 40
           C49 32.5, 51 27, 49.5 20
           C47.5 11.5, 40 9, 32 14 Z"
        fill="#FFFFFF"
        stroke="#2B95A3"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* smile */}
      <path
        d="M25 27 Q32 33.5 39 27"
        fill="none"
        stroke="#2B95A3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Icon + "Smiley" wordmark. Use across nav, footer, login, sidebar, etc.
 * Pass `href` to make it a link, or omit for a plain mark.
 */
export function Logo({
  size = 36,
  href,
  textClassName = "font-display text-lg font-bold text-sky-900",
  showText = true,
  className = "",
}: {
  size?: number;
  href?: string;
  textClassName?: string;
  showText?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SmileyIcon size={size} />
      {showText && <span className={textClassName}>Smiley</span>}
    </span>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
