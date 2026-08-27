import type { FileWatcherProcess } from '../FileWatcherProcess/FileWatcherProcess.ts'

export interface FileWatcherSnapshot {
  readonly message: string
  readonly processes: readonly FileWatcherProcess[]
  readonly supported: boolean
  readonly total: number
}
