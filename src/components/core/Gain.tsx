import {
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useMemo,
} from 'react'
import { AudioNodeProvider } from './AudioNodeProvider'
import { useAudioNode } from './hooks'
import { AudioNodeProps } from './types'

export const GAIN = {
  GAIN: (node: AudioNode) => (node as GainNode).gain,
}

type GainProps = PropsWithChildren<AudioNodeProps> & {
  gain?: number
}

export const Gain = forwardRef(
  (props: GainProps, ref: ForwardedRef<GainNode>) => {
    const node = useAudioNode(
      ref,
      (audioContext, options) => new GainNode(audioContext, options),
      props,
    )
    const { gain } = props
    const { defaultGain } = useMemo(
      () => ({
        defaultGain: node.gain.value,
      }),
      [node],
    )

    useEffect(() => {
      node.gain.value = gain ?? defaultGain
    }, [node, gain, defaultGain])

    return <AudioNodeProvider value={node}>{props.children}</AudioNodeProvider>
  },
)
