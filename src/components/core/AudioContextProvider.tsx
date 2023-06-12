import { PropsWithChildren, createContext } from 'react'

const createAudioContext = () => {
  const audioContext = new AudioContext()
  audioContext.suspend()
  return audioContext
}

export const AudioContextContext = createContext<AudioContext>(
  createAudioContext(),
)

type AudioContextProviderProps = PropsWithChildren<{
  value?: AudioContext
}>

export const AudioContextProvider = ({
  children,
  value = createAudioContext(),
}: AudioContextProviderProps) => {
  return (
    <AudioContextContext.Provider value={value}>
      {children}
    </AudioContextContext.Provider>
  )
}
