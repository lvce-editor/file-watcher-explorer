export interface FileWatcherProcess {
  readonly command: string
  readonly name: string
  readonly pid: number
  readonly ppid: number
  readonly watcherCount: number
}
