'use client';

interface IconProps {
  className?: string;
}

export function EternalAIIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      className={`text-purple-600 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="eternal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Outer circle background */}
      <circle cx="12" cy="12" r="12" fill="url(#eternal-gradient)" />

      {/* Inner geometric shape representing AI/generation */}
      <g fill="white">
        {/* Center point */}
        <circle cx="12" cy="12" r="1.5" />

        {/* Four radiating points */}
        <circle cx="12" cy="6" r="1.2" />
        <circle cx="12" cy="18" r="1.2" />
        <circle cx="6" cy="12" r="1.2" />
        <circle cx="18" cy="12" r="1.2" />

        {/* Diagonal points for dynamic feel */}
        <circle cx="8" cy="8" r="0.8" />
        <circle cx="16" cy="16" r="0.8" />
        <circle cx="16" cy="8" r="0.8" />
        <circle cx="8" cy="16" r="0.8" />
      </g>

      {/* Connecting lines to suggest generation/connection */}
      <g stroke="white" strokeWidth="0.5" strokeOpacity="0.6" fill="none">
        <line x1="12" y1="12" x2="12" y2="6" />
        <line x1="12" y1="12" x2="12" y2="18" />
        <line x1="12" y1="12" x2="6" y2="12" />
        <line x1="12" y1="12" x2="18" y2="12" />
      </g>
    </svg>
  );
}

export default EternalAIIcon;
