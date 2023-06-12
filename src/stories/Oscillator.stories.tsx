import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'
import { Destination } from '../components/core/Destination'
import { Gain } from '../components/core/Gain'
import { Oscillator } from '../components/core/Oscillator'
import { PlayButton } from './PlayButton'

const typeOptions = ['sine', 'sawtooth', 'square', 'triangle']

const meta: Meta<typeof Oscillator> = {
  component: Oscillator,
  argTypes: {
    connectTo: {
      table: {
        disable: true,
      },
    },
    outputIndex: {
      table: {
        disable: true,
      },
    },
    inputIndex: {
      table: {
        disable: true,
      },
    },
    periodicWave: {
      table: {
        disable: true,
      },
    },
    type: { control: 'select', options: typeOptions },
  },
}

export default meta
type Story = StoryObj<typeof Oscillator>

const renderOscillatorInfo = (oscillator: OscillatorNode | null) => (
  <>
    <p>Channel Count: {oscillator?.channelCount}</p>
    <p>Channel Count Mode: {oscillator?.channelCountMode}</p>
    <p>Channel Interpration: {oscillator?.channelInterpretation}</p>
    <p>Type: {oscillator?.type}</p>
    <p>Frequency: {oscillator?.frequency?.value} Hz</p>
    <p>Detune: {oscillator?.detune?.value} cents</p>
  </>
)

export const Basic: Story = {
  args: {
    type: 'sine',
    frequency: 200,
    detune: 0,
  },
  render: ({ type, frequency, detune }) => {
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)
    const [info, setInfo] = useState<JSX.Element | null>(null)

    useEffect(() => {
      setInfo(renderOscillatorInfo(oscillator))
    }, [oscillator, type, frequency, detune])

    return (
      <>
        <PlayButton />
        <Destination>
          <Oscillator
            ref={setOscillator}
            type={type}
            frequency={frequency}
            detune={detune}
          />
        </Destination>
        {info}
      </>
    )
  },
}

export const AM: Story = {
  args: {
    type: 'sine',
    frequency: 200,
    // @ts-ignore
    modulationType: 'sine' as OscillatorType,
    modulationFrequency: 100,
    modulationIndex: 1,
  },
  argTypes: {
    detune: {
      table: {
        disable: true,
      },
    },
    // @ts-ignore
    modulationType: { control: 'select', options: typeOptions },
  },
  render: ({
    type,
    frequency,
    // @ts-ignore
    modulationType,
    // @ts-ignore
    modulationFrequency,
    // @ts-ignore
    modulationIndex,
  }) => (
    <>
      <PlayButton />
      <Destination>
        <Gain gain={1 / (1 + Math.abs(modulationIndex))}>
          <Gain>
            <Oscillator type={type} frequency={frequency} />
            <Gain gain={modulationIndex} connectTo={Gain.GAIN}>
              <Oscillator
                type={modulationType}
                frequency={modulationFrequency}
              />
            </Gain>
          </Gain>
        </Gain>
      </Destination>
    </>
  ),
}

export const FM: Story = {
  args: {
    type: 'sine',
    frequency: 200,
    // @ts-ignore
    modulationType: 'sine' as OscillatorType,
    modulationFrequency: 100,
    modulationIndex: 1,
  },
  argTypes: {
    detune: {
      table: {
        disable: true,
      },
    },
    // @ts-ignore
    modulationType: { control: 'select', options: typeOptions },
  },
  render: ({
    type,
    frequency,
    // @ts-ignore
    modulationType,
    // @ts-ignore
    modulationFrequency,
    // @ts-ignore
    modulationIndex,
  }) => (
    <>
      <PlayButton />
      <Destination>
        <Oscillator type={type} frequency={frequency}>
          <Gain
            gain={modulationIndex * modulationFrequency}
            connectTo={Oscillator.FREQUENCY}
          >
            <Oscillator type={modulationType} frequency={modulationFrequency} />
          </Gain>
        </Oscillator>
      </Destination>
    </>
  ),
}
