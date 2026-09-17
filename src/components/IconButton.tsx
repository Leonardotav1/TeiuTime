import type { ReactNode } from 'react'

export function IconButton({
  icon,
  alt,
  onClick,
  disabled,
  active,
  pulse,
  big,
  className,
}: {
  icon: ReactNode
  alt: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  pulse?: boolean
  big?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      className={`act${active ? ' active' : ''}${pulse ? ' pulse' : ''}${big ? ' big' : ''}${disabled ? ' disabled' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={alt}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
