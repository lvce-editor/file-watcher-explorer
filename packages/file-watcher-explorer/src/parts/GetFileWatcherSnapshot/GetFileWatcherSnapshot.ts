import type { FileWatcherSnapshot } from '../FileWatcherSnapshot/FileWatcherSnapshot.ts'
import type { ProcessInfoWithWatchers } from '../ProcessInfo/ProcessInfo.ts'
import * as CountInotifyWatches from '../CountInotifyWatches/CountInotifyWatches.ts'
import * as GetDescendantProcesses from '../GetDescendantProcesses/GetDescendantProcesses.ts'
import * as GetProcessList from '../GetProcessList/GetProcessList.ts'

const unsupportedMessage =
  'File Watcher Explorer is currently only supported on Linux.'

const compareProcesses = (
  left: ProcessInfoWithWatchers,
  right: ProcessInfoWithWatchers,
): number => {
  return right.watcherCount - left.watcherCount || left.pid - right.pid
}

export const getFileWatcherSnapshot = async (
  rootPid: number,
): Promise<FileWatcherSnapshot> => {
  if (process.platform !== 'linux') {
    return {
      message: unsupportedMessage,
      processes: [],
      supported: false,
      total: 0,
    }
  }
  const allProcesses = await GetProcessList.getProcessList()
  const descendants = GetDescendantProcesses.getDescendantProcesses(
    allProcesses,
    rootPid,
  )
  const processes = await Promise.all(
    descendants.map(async (processInfo) => ({
      ...processInfo,
      watcherCount: await CountInotifyWatches.countInotifyWatches(
        processInfo.pid,
      ),
    })),
  )
  processes.sort(compareProcesses)
  return {
    message: '',
    processes,
    supported: true,
    total: processes.reduce(
      (total, processInfo) => total + processInfo.watcherCount,
      0,
    ),
  }
}
