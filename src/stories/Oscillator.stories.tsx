import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Destination } from '../components/core/Destination'
import { GAIN, Gain } from '../components/core/Gain'
import { OSCILLATOR, Oscillator } from '../components/core/Oscillator'
import { PlayButton } from './PlayButton'

const meta: Meta<typeof Oscillator> = {
  component: Oscillator,
}

export default meta
type Story = StoryObj<typeof Oscillator>

const renderOscillator = (oscillator: OscillatorNode | null) => (
  <>
    <p>Channel Count: {oscillator?.channelCount}</p>
    <p>Channel Count Mode: {oscillator?.channelCountMode}</p>
    <p>Channel Interpretation: {oscillator?.channelInterpretation}</p>
    <p>Frequency: {oscillator?.frequency?.value}</p>
    <p>Detune: {oscillator?.detune?.value}</p>
    <p>Type: {oscillator?.type}</p>
  </>
)

export const Basic: Story = {
  render: () => {
    const ref = useRef<OscillatorNode>(null)
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)

    useEffect(() => {
      setOscillator(ref.current)
    }, [ref.current])

    const info = useMemo(() => renderOscillator(oscillator), [oscillator])

    return (
      <>
        <Destination>
          <Oscillator ref={ref} frequency={200} type="triangle" />
        </Destination>
        <PlayButton />
        {info}
      </>
    )
  },
}

export const AM: Story = {
  render: () => (
    <>
      <Destination>
        <Gain gain={0.5}>
          <Gain>
            <Oscillator frequency={200} />
            <Oscillator frequency={100} connectTo={GAIN.GAIN} />
          </Gain>
        </Gain>
      </Destination>
      <PlayButton />
    </>
  ),
}

export const FM: Story = {
  render: () => (
    <>
      <Destination>
        <Oscillator frequency={200}>
          <Gain gain={200} connectTo={OSCILLATOR.FREQUENCY}>
            <Oscillator frequency={100} />
          </Gain>
        </Oscillator>
      </Destination>
      <PlayButton />
    </>
  ),
}
