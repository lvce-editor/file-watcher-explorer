import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const launchFileWatcherExplorerElectron = async (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: async (port: MessagePort): Promise<void> => {
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToExtensionHostWorker.sendMessagePortToFileWatcherExplorer',
        port,
      )
    },
  })
}
