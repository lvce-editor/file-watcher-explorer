import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'

export const {
  clear,
  dispose,
  get,
  getCommandIds,
  getKeys,
  registerCommands,
  set,
  wrapCommand,
  wrapLoadContent,
} = ViewletRegistry.create<FileWatcherExplorerState>()
