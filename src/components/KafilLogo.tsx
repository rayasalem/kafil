import { FC } from 'react';

interface KafilLogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** 'dark' = white text on dark bg (sidebar), 'light' = dark text on light bg (landing) */
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Kafil brand logo:
 * - Mark: a golden arc (two embracing arms / stylised Arabic ك) surrounding a lock node
 *         representing the Escrow guarantor protecting both parties.
 * - Wordmark: "كفيل" in the brand typeface.
 */
const KafilLogo: FC<KafilLogoProps> = ({
  size = 'md',
  variant = 'dark',
  className = '',
}) => {
  const dims = { sm: 32, md: 40, lg: 52 }[size];
  const textSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size];
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#0D1B2A] dark:text-white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* ─── SVG Mark ─── */}
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Kafil logo mark"
      >
        {/* Outer golden arc – left arm */}
        <path
          d="M6 20 C6 10.5 12.5 4 20 4"
          stroke="#C9A84C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Outer golden arc – right arm */}
        <path
          d="M34 20 C34 10.5 27.5 4 20 4"
          stroke="#C9A84C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom connector - full arc base */}
        <path
          d="M6 20 C6 29.5 12.5 36 20 36 C27.5 36 34 29.5 34 20"
          stroke="#C9A84C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        {/* Inner navy filled circle – the vault */}
        <circle cx="20" cy="20" r="8" fill="#0D1B2A" />
        {/* Lock body */}
        <rect x="16.5" y="20" width="7" height="5.5" rx="1.5" fill="#C9A84C" />
        {/* Lock shackle */}
        <path
          d="M17.5 20 V18 C17.5 16.07 22.5 16.07 22.5 18 V20"
          stroke="#C9A84C"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lock keyhole dot */}
        <circle cx="20" cy="22.6" r="1" fill="#0D1B2A" />
      </svg>

      {/* ─── Wordmark ─── */}
      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-tight ${textSize} ${textColor} transition-colors`}>
          كفيل
        </span>
        <span
          className="text-[9px] font-bold tracking-widest uppercase"
          style={{ color: '#C9A84C', letterSpacing: '0.18em' }}
        >
          Kafil
        </span>
      </div>
    </div>
  );
};

export const KafilMark: FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 20 C6 10.5 12.5 4 20 4" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M34 20 C34 10.5 27.5 4 20 4" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M6 20 C6 29.5 12.5 36 20 36 C27.5 36 34 29.5 34 20" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.35" />
    <circle cx="20" cy="20" r="8" fill="#0D1B2A" />
    <rect x="16.5" y="20" width="7" height="5.5" rx="1.5" fill="#C9A84C" />
    <path d="M17.5 20 V18 C17.5 16.07 22.5 16.07 22.5 18 V20" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="22.6" r="1" fill="#0D1B2A" />
  </svg>
);

export default KafilLogo;

