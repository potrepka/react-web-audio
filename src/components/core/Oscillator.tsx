import {
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useMemo,
} from 'react'
import { AudioNodeProvider } from './AudioNodeProvider'
import { useAudioScheduledSourceNode } from './hooks'
import { AudioNodeProps } from './types'

type OscillatorProps = PropsWithChildren<AudioNodeProps> & {
  frequency?: number
  detune?: number
  type?: OscillatorType
}

export const Oscillator = forwardRef(
  (props: OscillatorProps, ref: ForwardedRef<OscillatorNode>) => {
    const node = useAudioScheduledSourceNode(
      ref,
      (audioContext, options) => new OscillatorNode(audioContext, options),
      props,
    )
    const { frequency, detune, type } = props
    const { defaultFrequency, defaultDetune, defaultType } = useMemo(
      () => ({
        defaultFrequency: node.frequency.value,
        defaultDetune: node.detune.value,
        defaultType: node.type,
      }),
      [node],
    )

    useEffect(() => {
      node.frequency.value = frequency ?? defaultFrequency
    }, [node, frequency, defaultFrequency])

    useEffect(() => {
      node.detune.value = detune ?? defaultDetune
    }, [node, detune, defaultDetune])

    useEffect(() => {
      node.type = type ?? defaultType
    }, [node, type])

    return <AudioNodeProvider value={node}>{props.children}</AudioNodeProvider>
  },
)
