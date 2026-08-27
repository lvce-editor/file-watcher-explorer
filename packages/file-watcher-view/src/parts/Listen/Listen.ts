import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'

export const listen = async (): Promise<void> => {
  FileWatcherExplorerStates.registerCommands(CommandMap.commandMap)
  RendererWorker.set(
    await WebWorkerRpcClient.create({ commandMap: CommandMap.commandMap }),
  )
}
