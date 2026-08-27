import { PlatformType } from '@lvce-editor/constants'
import type { FileWatcherExplorerSnapshot } from '../FileWatcherExplorerSnapshot/FileWatcherExplorerSnapshot.ts'
import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'
import * as FileWatcherExplorerRpc from '../FileWatcherExplorerRpc/FileWatcherExplorerRpc.ts'
import * as InitializeFileWatcherExplorer from '../InitializeFileWatcherExplorer/InitializeFileWatcherExplorer.ts'

const webMessage = 'File Watcher Explorer is not supported on web.'

export const refresh = async (
  state: FileWatcherExplorerState,
): Promise<FileWatcherExplorerState> => {
  if (state.platform === PlatformType.Web) {
    return {
      ...state,
      initial: false,
      message: webMessage,
      supported: false,
    }
  }
  try {
    await InitializeFileWatcherExplorer.initializeFileWatcherExplorer(
      state.platform,
    )
    const rootPid =
      state.rootPid === -1
        ? await FileWatcherExplorerRpc.invoke('ProcessId.getMainProcessId', {
            includeElectronData: state.platform === PlatformType.Electron,
          })
        : state.rootPid
    const snapshot: FileWatcherExplorerSnapshot =
      await FileWatcherExplorerRpc.invoke(
        'FileWatcherExplorer.getSnapshot',
        rootPid,
      )
    return {
      ...state,
      errorMessage: '',
      initial: false,
      message: snapshot.message,
      processes: snapshot.processes,
      rootPid,
      supported: snapshot.supported,
      total: snapshot.total,
    }
  } catch (error) {
    return {
      ...state,
      errorMessage: error instanceof Error ? error.message : String(error),
      initial: false,
    }
  }
}
