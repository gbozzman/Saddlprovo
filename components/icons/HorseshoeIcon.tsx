import type React from "react"

interface HorseshoeIconProps {
  className?: string
  size?: number
}

export const HorseshoeIcon: React.FC<HorseshoeIconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 16.5C19 19.5376 16.5376 22 13.5 22C10.4624 22 8 19.5376 8 16.5C8 13.4624 10.4624 11 13.5 11C16.5376 11 19 13.4624 19 16.5Z" />
      <path d="M19 16.5V5C19 3.34315 17.6569 2 16 2H11C9.34315 2 8 3.34315 8 5V16.5" />
      <path d="M5 8L8 8" />
      <path d="M5 12L8 12" />
      <path d="M5 16L8 16" />
    </svg>
  )
}
