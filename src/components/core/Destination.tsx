import { ForwardedRef, PropsWithChildren, forwardRef, useContext } from 'react'
import { AudioContextContext } from './AudioContextProvider'
import { AudioNodeProvider } from './AudioNodeProvider'
import { useAudioNode } from './hooks'

type DestinationProps = PropsWithChildren

export const Destination = forwardRef(
  (props: DestinationProps, ref: ForwardedRef<AudioDestinationNode>) => {
    const audioContext = useContext(AudioContextContext)
    const value = useAudioNode(
      (audioContext: BaseAudioContext) => audioContext.destination,
      [audioContext],
      audioContext,
      ref,
    )

    return <AudioNodeProvider value={value}>{props.children}</AudioNodeProvider>
  },
)
