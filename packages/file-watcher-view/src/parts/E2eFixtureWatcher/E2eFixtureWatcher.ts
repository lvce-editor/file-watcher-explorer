import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'
import * as FileWatcherExplorerRpc from '../FileWatcherExplorerRpc/FileWatcherExplorerRpc.ts'
import * as Refresh from '../Refresh/Refresh.ts'

export const createE2eFixtureWatcher = async (
  state: FileWatcherExplorerState,
  marker: string,
): Promise<FileWatcherExplorerState> => {
  await FileWatcherExplorerRpc.invoke(
    'FileWatcherExplorer.createE2eFixtureWatcher',
    marker,
  )
  return Refresh.refresh(state)
}

export const disposeE2eFixtureWatcher = async (
  state: FileWatcherExplorerState,
  marker: string,
): Promise<FileWatcherExplorerState> => {
  await FileWatcherExplorerRpc.invoke(
    'FileWatcherExplorer.disposeE2eFixtureWatcher',
    marker,
  )
  return Refresh.refresh(state)
}
