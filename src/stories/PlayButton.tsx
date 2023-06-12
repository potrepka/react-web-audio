import { useContext, useEffect, useMemo, useState } from 'react'
import { AudioContextContext } from '../components'

export const PlayButton = () => {
  const audioContext = useContext(AudioContextContext)

  const [playing, setPlaying] = useState(audioContext.state === 'running')
  const [closed] = useState(audioContext.state === 'closed')

  const text = useMemo(
    () => (closed ? 'Closed' : playing ? 'Pause' : 'Play'),
    [playing],
  )

  useEffect(() => {
    if (playing) {
      audioContext.resume()
    } else {
      audioContext.suspend()
    }
  }, [playing])

  return (
    <button disabled={closed} onClick={() => setPlaying((p) => !p)}>
      {text}
    </button>
  )
}
