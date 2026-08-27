import type { ProcessInfoWithWatchers } from '../ProcessInfo/ProcessInfo.ts'

export interface FileWatcherSnapshot {
  readonly message: string
  readonly processes: readonly ProcessInfoWithWatchers[]
  readonly supported: boolean
  readonly total: number
}
