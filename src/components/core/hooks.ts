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

export const useAudioNode = <T extends AudioNode, U extends AudioNodeProps>(
  ref: ForwardedRef<T>,
  getOrCreateAudioNode: (audioContext: BaseAudioContext, options?: U) => T,
  options?: U,
  deps?: DependencyList,
) => {
  const audioContext = useContext(AudioContextContext)
  const parent = useContext(AudioNodeContext)
  const node = useMemo(
    () => getOrCreateAudioNode(audioContext, options),
    deps ?? [audioContext],
  )
  console.log('creating from parent:', parent, 'node:', node)
  const {
    channelCount,
    channelCountMode,
    channelInterpretation,
    connectTo,
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
      const param = connectTo?.(parent)
      if (param) {
        node.connect(param, outputIndex)
        return () => node.disconnect(param)
      } else if (parent.numberOfInputs) {
        node.connect(parent, outputIndex, inputIndex)
        return () => node.disconnect(parent)
      }
    }
    return () => {}
  }, [parent, node, connectTo, outputIndex, inputIndex])

  return node
}

export const useAudioScheduledSourceNode = <
  T extends AudioScheduledSourceNode,
  U extends AudioNodeProps,
>(
  ref: ForwardedRef<T>,
  getOrCreateAudioNode: (audioContext: BaseAudioContext, options?: U) => T,
  options?: U,
  deps?: DependencyList,
) => {
  const node = useAudioNode(ref, getOrCreateAudioNode, options, deps)

  useEffect(() => {
    node.start()
    return () => node.stop()
  }, [node])

  return node
}
