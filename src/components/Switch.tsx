export function Switch({
  alt,
  checked,
  onChange,
}: {
  alt: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} aria-label={alt} />
      <span className="track">
        <span className="thumb" />
      </span>
    </label>
  )
}