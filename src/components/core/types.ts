export type AudioNodeProps = AudioNodeOptions & {
  connectTo?: (node: AudioNode) => AudioParam
  outputIndex?: number
  inputIndex?: number
}
