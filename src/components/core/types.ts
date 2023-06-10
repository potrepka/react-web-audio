export type AudioNodeProps = AudioNodeOptions & {
  getDestinationParam?: (node: AudioNode) => AudioParam
  outputIndex?: number
  inputIndex?: number
}
