import type { Rpc } from '@lvce-editor/rpc'
import { LazyWebSocketRpcParent2, WebSocketRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const commandNotFoundRegex = /command not found|not found/i

export const launchFileWatcherExplorerNode = async (
  onClose: () => void,
): Promise<Rpc> => {
  try {
    const { protocols, url } = (await RendererWorker.invoke(
      'WebSocketCapability.create',
      'file-watcher-explorer',
    )) as { readonly protocols: string[]; readonly url: string }
    const webSocket = new WebSocket(url, protocols)
    webSocket.addEventListener('close', onClose)
    return await WebSocketRpcParent.create({ commandMap: {}, webSocket })
  } catch (error) {
    if (!(
      error instanceof Error &&
      (error.message.includes('WebSocketCapability.create') ||
        error.message.includes('module WebSocketCapability not found')) &&
      commandNotFoundRegex.test(error.message)
    )) {
      throw error
    }
  }
  return LazyWebSocketRpcParent2.create({
    commandMap: {},
    onClose,
    type: 'file-watcher-explorer',
  })
}
