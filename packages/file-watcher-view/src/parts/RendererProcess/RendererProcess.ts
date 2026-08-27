import type { Rpc } from '@lvce-editor/rpc'
import { RendererProcess as Registry } from '@lvce-editor/rpc-registry'

const state = {
  connected: false,
}

export const isConnected = (): boolean => {
  const { connected } = state
  return connected
}
export const set = (rpc: Rpc): void => {
  Registry.set(rpc)
  state.connected = true
}
export const invoke = (
  method: string,
  ...params: readonly unknown[]
): Promise<any> => Registry.invoke(method, ...params)
