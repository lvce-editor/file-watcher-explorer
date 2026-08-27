import type { FileWatcherExplorerState } from '../src/parts/FileWatcherExplorerState/FileWatcherExplorerState.ts'

export const createTestState = (
  overrides: Partial<FileWatcherExplorerState> = {},
): FileWatcherExplorerState => ({
  assetDir: '',
  errorMessage: '',
  height: 100,
  initial: false,
  message: '',
  parentUid: 0,
  platform: 0,
  processes: [],
  rootPid: 1,
  supported: true,
  total: 0,
  uid: 7,
  uri: 'file-watcher-explorer:///',
  width: 100,
  x: 0,
  y: 0,
  ...overrides,
})
