/**
 * A generic, brand-neutral illustration for the login pages: an abstract
 * checklist card floating above soft gradient blobs. Fully inline SVG (plus
 * a couple of CSS-blurred background blobs) so it needs no external image
 * and stays crisp at any size.
 */
export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Soft background blobs, rendered in CSS (not SVG gradients, which
          can show tiling seams at small scales in some browsers). */}
      <div
        aria-hidden
        className="absolute -left-10 top-4 h-56 w-56 rounded-full bg-violet-400 opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-400 opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute right-6 top-0 h-40 w-40 rounded-full bg-pink-400 opacity-30 blur-3xl"
      />

      <svg
        viewBox="0 0 600 600"
        className="relative w-full"
        role="img"
        aria-label="Illustration d'une liste de tâches"
      >
        <defs>
          <linearGradient id="card-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f5f3ff" />
          </linearGradient>
          <linearGradient id="check-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#4c1d95" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Floating dots */}
        <circle cx="90" cy="470" r="8" fill="#a78bfa" opacity="0.6" />
        <circle cx="500" cy="330" r="6" fill="#22d3ee" opacity="0.7" />
        <circle cx="520" cy="230" r="5" fill="#f472b6" opacity="0.6" />
        <circle cx="70" cy="260" r="5" fill="#818cf8" opacity="0.6" />

        {/* Main checklist card */}
        <g filter="url(#soft-shadow)">
          <rect
            x="140"
            y="120"
            width="320"
            height="380"
            rx="28"
            fill="url(#card-grad)"
            stroke="#e9e5ff"
            strokeWidth="2"
          />

          {/* Card header bar */}
          <rect x="172" y="156" width="120" height="16" rx="8" fill="#c4b5fd" />
          <circle cx="428" cy="164" r="12" fill="#ddd6fe" />

          {/* Checklist rows */}
          {[0, 1, 2, 3].map((i) => {
            const y = 216 + i * 66;
            const done = i < 2;
            return (
              <g key={i}>
                <rect x="172" y={y} width="256" height="50" rx="14" fill={done ? "#f5f3ff" : "#faf9ff"} />
                <circle
                  cx="200"
                  cy={y + 25}
                  r="14"
                  fill={done ? "url(#check-grad)" : "none"}
                  stroke={done ? "none" : "#a78bfa"}
                  strokeWidth="2.5"
                />
                {done && (
                  <path
                    d={`M193 ${y + 25} l5 5 l10 -11`}
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                )}
                <rect
                  x="228"
                  y={y + 18}
                  width={i === 3 ? 130 : 170}
                  height="14"
                  rx="7"
                  fill={done ? "#ddd6fe" : "#c4b5fd"}
                />
              </g>
            );
          })}
        </g>

        {/* Floating badge, top-right of the card */}
        <g filter="url(#soft-shadow)">
          <circle cx="470" cy="150" r="34" fill="url(#check-grad)" />
          <path
            d="M457 150 l9 9 l18 -20"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Small floating card, bottom-left */}
        <g filter="url(#soft-shadow)">
          <rect x="70" y="380" width="110" height="70" rx="16" fill="white" opacity="0.95" />
          <rect x="88" y="398" width="60" height="10" rx="5" fill="#a5b4fc" />
          <rect x="88" y="416" width="40" height="10" rx="5" fill="#e0e7ff" />
        </g>
      </svg>
    </div>
  );
}
