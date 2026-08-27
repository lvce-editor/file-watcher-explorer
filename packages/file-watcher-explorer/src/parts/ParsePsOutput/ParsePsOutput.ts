import { basename } from 'node:path'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

const whitespaceRegex = /\s+/

const getName = (command: string): string => {
  const executable = command.trim().split(whitespaceRegex, 1)[0]
  return executable ? basename(executable) : 'unknown'
}

export const parsePsOutput = (stdout: string): readonly ProcessInfo[] => {
  const processes: ProcessInfo[] = []
  for (const line of stdout.split('\n')) {
    const [pidText, ppidText, ...commandParts] = line
      .trim()
      .split(whitespaceRegex)
    if (!pidText || !ppidText || commandParts.length === 0) {
      continue
    }
    const pid = Number(pidText)
    const ppid = Number(ppidText)
    const command = commandParts.join(' ')
    processes.push({
      command,
      name: getName(command),
      pid,
      ppid,
    })
  }
  return processes
}
