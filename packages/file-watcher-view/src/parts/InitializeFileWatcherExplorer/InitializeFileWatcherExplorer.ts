import { PlatformType } from '@lvce-editor/constants'
import * as FileWatcherExplorerRpc from '../FileWatcherExplorerRpc/FileWatcherExplorerRpc.ts'
import * as LaunchFileWatcherExplorerElectron from '../LaunchFileWatcherExplorerElectron/LaunchFileWatcherExplorerElectron.ts'
import * as LaunchFileWatcherExplorerNode from '../LaunchFileWatcherExplorerNode/LaunchFileWatcherExplorerNode.ts'

const state = {
  initializedPlatform: 0,
}

const handleClose = (): void => {
  state.initializedPlatform = 0
  FileWatcherExplorerRpc.clear()
}

export const initializeFileWatcherExplorer = async (
  platform: number,
): Promise<void> => {
  if (state.initializedPlatform === platform) {
    return
  }
  if (platform === PlatformType.Electron) {
    FileWatcherExplorerRpc.set(
      await LaunchFileWatcherExplorerElectron.launchFileWatcherExplorerElectron(),
    )
    state.initializedPlatform = platform
    return
  }
  if (platform === PlatformType.Remote) {
    FileWatcherExplorerRpc.set(
      await LaunchFileWatcherExplorerNode.launchFileWatcherExplorerNode(
        handleClose,
      ),
    )
    state.initializedPlatform = platform
  }
}

export const dispose = async (): Promise<void> => {
  state.initializedPlatform = 0
  await FileWatcherExplorerRpc.dispose()
}
