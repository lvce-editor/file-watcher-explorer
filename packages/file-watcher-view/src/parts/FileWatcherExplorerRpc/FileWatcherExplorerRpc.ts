import type { Rpc } from '@lvce-editor/rpc'

interface State {
  rpc: Rpc | undefined
}

const state: State = {
  rpc: undefined,
}

export const set = (value: Rpc): void => {
  state.rpc = value
}

export const clear = (): void => {
  state.rpc = undefined
}

export const invoke = (
  method: string,
  ...params: readonly any[]
): Promise<any> => {
  const { rpc } = state
  if (!rpc) {
    throw new Error('File Watcher Explorer RPC is not initialized')
  }
  return rpc.invoke(method, ...params)
}

export const dispose = async (): Promise<void> => {
  const { rpc } = state
  state.rpc = undefined
  await rpc?.dispose()
}
