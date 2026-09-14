export function EmojiButton({
  glyph,
  alt,
  title,
  onClick,
  disabled,
  active,
  pulse,
  big,
  className,
}: {
  glyph: string
  alt: string
  title?: string
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
      title={title}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  )
}