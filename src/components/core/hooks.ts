import { ForwardedRef, useContext, useEffect, useMemo } from 'react'
import { AudioNodeContext } from './AudioNodeProvider'
import { setRef } from './helpers'
import { AudioNodeProps } from './types'

export const useAudioNode = <T extends AudioNode, O extends AudioNodeProps>(
  C: new (audioContext: BaseAudioContext, options: O) => T,
  audioContext: BaseAudioContext,
  options: O,
  ref: ForwardedRef<T>,
) => {
  const parent = useContext(AudioNodeContext)
  const node = useMemo(() => new C(audioContext, options), [audioContext])
  const {
    channelCount,
    channelCountMode,
    channelInterpretation,
    getDestinationParam,
    outputIndex,
    inputIndex,
  } = options
  const {
    defaultChannelCount,
    defaultChannelCountMode,
    defaultChannelInterpretation,
  } = useMemo(
    () => ({
      defaultChannelCount: node.channelCount,
      defaultChannelCountMode: node.channelCountMode,
      defaultChannelInterpretation: node.channelInterpretation,
    }),
    [node],
  )

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
    if (parent) {
      const destinationParam = getDestinationParam?.(parent)
      if (destinationParam) {
        node.connect(destinationParam, outputIndex)
      } else {
        node.connect(parent, outputIndex, inputIndex)
      }
    }
    return () => node.disconnect()
  }, [parent, node, getDestinationParam, outputIndex, inputIndex])

  return node
}

export const useAudioScheduledSourceNode = <
  T extends AudioScheduledSourceNode,
  O extends AudioNodeProps,
>(
  C: new (audioContext: BaseAudioContext, options: O) => T,
  audioContext: BaseAudioContext,
  options: O,
  ref: ForwardedRef<T>,
) => {
  const node = useAudioNode(C, audioContext, options, ref)

  useEffect(() => {
    node.start()
    return () => node.stop()
  }, [node])

  return node
}
