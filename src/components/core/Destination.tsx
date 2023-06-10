import { ForwardedRef, PropsWithChildren, forwardRef } from 'react'
import { AudioNodeProvider } from './AudioNodeProvider'
import { useAudioNode } from './hooks'

type DestinationProps = PropsWithChildren

export const Destination = forwardRef(
  (props: DestinationProps, ref: ForwardedRef<AudioDestinationNode>) => {
    const value = useAudioNode(ref, (audioContext) => audioContext.destination)

    return <AudioNodeProvider value={value}>{props.children}</AudioNodeProvider>
  },
)
