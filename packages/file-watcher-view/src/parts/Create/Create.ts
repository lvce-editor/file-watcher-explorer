import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'

export const create = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  _savedState: unknown,
  parentUid: number,
  platform: number,
  assetDir: string,
): FileWatcherExplorerState => {
  const state: FileWatcherExplorerState = {
    assetDir,
    errorMessage: '',
    height,
    initial: true,
    message: '',
    parentUid,
    platform,
    processes: [],
    rootPid: -1,
    supported: true,
    total: 0,
    uid,
    uri,
    width,
    x,
    y,
  }
  FileWatcherExplorerStates.set(uid, state, state)
  return state
}
