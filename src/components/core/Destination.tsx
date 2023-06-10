import {
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { AudioContextContext } from './AudioContextProvider'
import { AudioNodeProvider } from './AudioNodeProvider'
import { setRef } from './helpers'

type DestinationProps = PropsWithChildren

export const Destination = forwardRef(
  (props: DestinationProps, ref: ForwardedRef<AudioDestinationNode>) => {
    const audioContext = useContext(AudioContextContext)
    const value = useMemo(() => audioContext.destination, [audioContext])

    useEffect(() => {
      setRef(ref, value)
    }, [ref, value])

    return <AudioNodeProvider value={value}>{props.children}</AudioNodeProvider>
  },
)
