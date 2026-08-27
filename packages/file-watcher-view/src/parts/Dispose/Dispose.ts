import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'
import * as InitializeFileWatcherExplorer from '../InitializeFileWatcherExplorer/InitializeFileWatcherExplorer.ts'

export const dispose = async (uid: number): Promise<void> => {
  AutoRefresh.dispose(uid)
  FileWatcherExplorerStates.dispose(uid)
  if (FileWatcherExplorerStates.getKeys().length === 0) {
    await InitializeFileWatcherExplorer.dispose()
  }
}
