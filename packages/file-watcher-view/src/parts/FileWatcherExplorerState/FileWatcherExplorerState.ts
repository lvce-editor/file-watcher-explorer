import type { FileWatcherProcess } from '../FileWatcherProcess/FileWatcherProcess.ts'

export interface FileWatcherExplorerState {
  readonly assetDir: string
  readonly errorMessage: string
  readonly height: number
  readonly initial: boolean
  readonly message: string
  readonly parentUid: number
  readonly platform: number
  readonly processes: readonly FileWatcherProcess[]
  readonly rootPid: number
  readonly supported: boolean
  readonly total: number
  readonly uid: number
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}
