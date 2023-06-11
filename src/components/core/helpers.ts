import { ForwardedRef, forwardRef } from 'react'
import { AudioNodeProps } from './types'

export const setRef = <T>(ref: ForwardedRef<T>, value: T) => {
  if (ref) {
    if (typeof ref === 'function') {
      ref(value)
    } else {
      ref.current = value
    }
  }
}

export const forwardRefAndAssignParams = <
  T extends AudioNode = AudioNode,
  U extends AudioNodeProps = AudioNodeProps,
>(
  component: (props: U, ref: ForwardedRef<T>) => JSX.Element,
  params: { [key: string]: (node: AudioNode) => AudioParam },
) => {
  const exoticComponent = forwardRef(component)
  Object.assign(exoticComponent, params)
  return exoticComponent as typeof exoticComponent & typeof params
}
