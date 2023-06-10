import {
  DependencyList,
  ForwardedRef,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { AudioNodeContext } from './AudioNodeProvider'
import { setRef } from './helpers'
import { AudioNodeProps } from './types'

export const useAudioNode = <T extends AudioNode, O extends AudioNodeProps>(
  getAudioNode: (audioContext: BaseAudioContext, options?: O) => T,
  deps: DependencyList,
  audioContext: BaseAudioContext,
  ref: ForwardedRef<T>,
  options?: O,
) => {
  const node = useMemo(() => getAudioNode(audioContext, options), deps)
  const { channelCount, channelCountMode, channelInterpretation } =
    options ?? {}
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

  return node
}

export const useAudioSourceNode = <
  T extends AudioNode,
  O extends AudioNodeProps,
>(
  C: new (audioContext: BaseAudioContext, options: O) => T,
  deps: DependencyList,
  audioContext: BaseAudioContext,
  ref: ForwardedRef<T>,
  options: O,
) => {
  const parent = useContext(AudioNodeContext)
  const node = useAudioNode(
    () => new C(audioContext, options),
    deps,
    audioContext,
    ref,
    options,
  )
  const { getDestinationParam, outputIndex, inputIndex } = options

  useEffect(() => {
    if (parent) {
      const destinationParam = getDestinationParam?.(parent)
      if (destinationParam) {
        node.connect(destinationParam, outputIndex)
      } else {
        node.connect(parent, outputIndex, inputIndex)
      }
      return () => node.disconnect(parent)
    }
    return () => {}
  }, [parent, node, getDestinationParam, outputIndex, inputIndex])

  return node
}

export const useAudioScheduledSourceNode = <
  T extends AudioScheduledSourceNode,
  O extends AudioNodeProps,
>(
  C: new (audioContext: BaseAudioContext, options: O) => T,
  deps: DependencyList,
  audioContext: BaseAudioContext,
  ref: ForwardedRef<T>,
  options: O,
) => {
  const node = useAudioSourceNode(C, deps, audioContext, ref, options)

  useEffect(() => {
    node.start()
    return () => node.stop()
  }, [node])

  return node
}
