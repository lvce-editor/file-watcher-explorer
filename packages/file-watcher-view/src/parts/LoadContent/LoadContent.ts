import type { LoadContentResult } from '@lvce-editor/viewlet-registry'
import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as Refresh from '../Refresh/Refresh.ts'

export const loadContent = async (
  state: FileWatcherExplorerState,
): Promise<LoadContentResult<FileWatcherExplorerState>> => {
  const newState = await Refresh.refresh(state)
  if (!newState.errorMessage && newState.supported) {
    AutoRefresh.start(newState.uid)
  }
  return { error: undefined, state: newState }
}
