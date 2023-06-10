import type { Meta, StoryObj } from '@storybook/react'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { Destination } from '../components/core/Destination'
import { Oscillator } from '../components/core/Oscillator'
import { PlayButton } from './PlayButton'

const meta: Meta<typeof Oscillator> = {
  component: Oscillator,
}

export default meta
type Story = StoryObj<typeof Oscillator>

const renderOscillator = (oscillator: OscillatorNode | null) => (
  <>
    <p>Frequency: {oscillator?.frequency?.value}</p>
    <p>Detune: {oscillator?.detune?.value}</p>
    <p>Type: {oscillator?.type}</p>
  </>
)

export const First: Story = {
  render: () => {
    const ref = useRef<OscillatorNode>(null)
    const [info, setInfo] = useState<ReactNode>(null)

    useEffect(() => {
      setInfo(renderOscillator(ref.current))
    }, [ref.current])

    return (
      <>
        <Destination>
          <Oscillator frequency={100} ref={ref} />
        </Destination>
        <PlayButton />
        {info}
      </>
    )
  },
}

export const Second: Story = {
  render: () => {
    const ref = useRef<OscillatorNode>(null)
    const [info, setInfo] = useState<ReactNode>(null)

    useEffect(() => {
      setInfo(renderOscillator(ref.current))
    }, [ref.current])

    return (
      <>
        <Destination>
          <Oscillator frequency={200} ref={ref} />
        </Destination>
        <PlayButton />
        {info}
      </>
    )
  },
}

export const Third: Story = {
  render: () => {
    const ref = useRef<OscillatorNode>(null)
    const [info, setInfo] = useState<ReactNode>(null)

    useEffect(() => {
      setInfo(renderOscillator(ref.current))
    }, [ref.current])

    return (
      <>
        <Destination>
          <Oscillator frequency={300} ref={ref} />
        </Destination>
        <PlayButton />
        {info}
      </>
    )
  },
}

export const Triangle: Story = {
  render: () => {
    const ref = useRef<OscillatorNode>(null)
    const [info, setInfo] = useState<ReactNode>(null)

    useEffect(() => {
      setInfo(renderOscillator(ref.current))
    }, [ref.current])

    return (
      <>
        <Destination>
          <Oscillator frequency={100} type="triangle" ref={ref} />
        </Destination>
        <PlayButton />
        {info}
      </>
    )
  },
}
