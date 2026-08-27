import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

export const getDescendantProcesses = (
  processes: readonly ProcessInfo[],
  rootPid: number,
): readonly ProcessInfo[] => {
  const children = new Map<number, ProcessInfo[]>()
  for (const processInfo of processes) {
    const items = children.get(processInfo.ppid) || []
    items.push(processInfo)
    children.set(processInfo.ppid, items)
  }
  const root = processes.find((processInfo) => processInfo.pid === rootPid)
  if (!root) {
    return []
  }
  const result: ProcessInfo[] = []
  const queue = [root]
  for (let index = 0; index < queue.length; index++) {
    const processInfo = queue[index]
    result.push(processInfo)
    queue.push(...(children.get(processInfo.pid) || []))
  }
  return result
}
