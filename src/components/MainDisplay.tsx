import { Fragment } from 'react'
import { DotMatrix } from './DotMatrix'

export function MainDisplay({ text, blink }: { text: string; blink?: boolean }) {
  const parts = text.split(':')
  return (
    <div className="display-inner">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className={`colon${blink ? '' : ' off'}`}>
              <DotMatrix text=":" className="dm-lg" />
            </span>
          )}
          <DotMatrix text={part} className="dm-lg" />
        </Fragment>
      ))}
    </div>
  )
}