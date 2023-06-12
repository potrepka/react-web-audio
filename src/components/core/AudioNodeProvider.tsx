import { PropsWithChildren, createContext } from 'react'

export const AudioNodeContext = createContext<AudioNode | null>(null)

type AudioNodeProviderProps = PropsWithChildren<{
  value?: AudioNode | null
}>

export const AudioNodeProvider = ({
  children,
  value = null,
}: AudioNodeProviderProps) => {
  return (
    <AudioNodeContext.Provider value={value}>
      {children}
    </AudioNodeContext.Provider>
  )
}
