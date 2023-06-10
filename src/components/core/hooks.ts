import {
  DependencyList,
  ForwardedRef,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { AudioContextContext } from './AudioContextProvider'
import { AudioNodeContext } from './AudioNodeProvider'
import { setRef } from './helpers'
import { AudioNodeProps } from './types'

export const useAudioNode = <T extends AudioNode, O extends AudioNodeProps>(
  ref: ForwardedRef<T>,
  getOrCreateAudioNode: (audioContext: BaseAudioContext, options?: O) => T,
  options?: O,
  deps?: DependencyList,
) => {
  const audioContext = useContext(AudioContextContext)
  const parent = useContext(AudioNodeContext)
  const node = useMemo(
    () => getOrCreateAudioNode(audioContext, options),
    deps ?? [audioContext],
  )
  const {
    channelCount,
    channelCountMode,
    channelInterpretation,
    getDestinationParam,
    outputIndex,
    inputIndex,
  } = options ?? {}
  const {
    channelCount: defaultChannelCount,
    channelCountMode: defaultChannelCountMode,
    channelInterpretation: defaultChannelInterpretation,
  } = useMemo(() => node, [node])

  useEffect(() => {
    setRef(ref, node)
  }, [ref, node])

  useEffect(() => {
    node.channelCount = channelCount ?? defaultChannelCount
  }, [node, channelCount, defaultChannelCount])

  useEffect(() => {
    node.channelCountMode = channelCountMode ?? defaultChannelCountMode
  }, [node, channelCountMode, defaultChannelCountMode])

  useEffect(() => {
    node.channelInterpretation =
      channelInterpretation ?? defaultChannelInterpretation
  }, [node, channelInterpretation, defaultChannelInterpretation])

  useEffect(() => {
    if (parent && node.numberOfOutputs) {
      const destinationParam = getDestinationParam?.(parent)
      if (destinationParam) {
        node.connect(destinationParam, outputIndex)
        return () => node.disconnect(destinationParam)
      } else {
        node.connect(parent, outputIndex, inputIndex)
        return () => node.disconnect(parent)
      }
    }
    return () => {}
  }, [parent, node, getDestinationParam, outputIndex, inputIndex])

  return node
}

export const useAudioScheduledSourceNode = <
  T extends AudioScheduledSourceNode,
  O extends AudioNodeProps,
>(
  ref: ForwardedRef<T>,
  getOrCreateAudioNode: (audioContext: BaseAudioContext, options?: O) => T,
  options?: O,
  deps?: DependencyList,
) => {
  const node = useAudioNode(ref, getOrCreateAudioNode, options, deps)

  useEffect(() => {
    node.start()
    return () => node.stop()
  }, [node])

  return node
}
