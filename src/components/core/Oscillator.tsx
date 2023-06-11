import { ForwardedRef, PropsWithChildren, useEffect, useMemo } from 'react'
import { AudioNodeProvider } from './AudioNodeProvider'
import { forwardRefAndAssignParams } from './helpers'
import { useAudioScheduledSourceNode } from './hooks'
import { AudioNodeProps } from './types'

type OscillatorProps = PropsWithChildren<AudioNodeProps> & {
  frequency?: number
  detune?: number
  type?: OscillatorType
  periodicWave?: PeriodicWave
}

export const Oscillator = forwardRefAndAssignParams(
  (props: OscillatorProps, ref: ForwardedRef<OscillatorNode>) => {
    const node = useAudioScheduledSourceNode(
      ref,
      (audioContext, options) => new OscillatorNode(audioContext, options),
      props,
    )
    const { frequency, detune, type, periodicWave } = props
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
      if (periodicWave) {
        node.setPeriodicWave(periodicWave)
      } else {
        node.type = type ?? defaultType
      }
    }, [node, type, defaultType, periodicWave])

    return <AudioNodeProvider value={node}>{props.children}</AudioNodeProvider>
  },
  {
    FREQUENCY: (node) => (node as OscillatorNode).frequency,
    DETUNE: (node) => (node as OscillatorNode).detune,
  },
)
