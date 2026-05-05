type IconProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

const Logo = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" width={p.width} height={p.height} className={p.className}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.15" />
    <path
      d="M9 6h6v2l-1 1v3l3 4v3H7v-3l3-4V9L9 8V6z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Production = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M3 21V10l6 4V10l6 4V7l6-4v18H3z" />
    <path d="M9 17h.01M13 17h.01M17 17h.01" />
  </svg>
);

const Orders = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

const Supplies = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

const Search = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const Plus = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Close = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const Chevron = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Factory = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M3 21V11l6 3V11l6 3V8l6-3v16H3z" />
  </svg>
);

const Box = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.width}
    height={p.height}
    className={p.className}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

export const Icon = {
  Logo,
  Production,
  Orders,
  Supplies,
  Search,
  Plus,
  Close,
  Chevron,
  Factory,
  Box,
};
