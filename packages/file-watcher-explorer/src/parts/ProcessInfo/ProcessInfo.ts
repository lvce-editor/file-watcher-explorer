export interface ProcessInfo {
  readonly command: string
  readonly name: string
  readonly pid: number
  readonly ppid: number
}

export interface ProcessInfoWithWatchers extends ProcessInfo {
  readonly watcherCount: number
}
