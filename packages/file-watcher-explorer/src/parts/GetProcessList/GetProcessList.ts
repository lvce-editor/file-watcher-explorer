import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as ParsePsOutput from '../ParsePsOutput/ParsePsOutput.ts'

const execFile = promisify(execFileCallback)

export const getProcessList = async (): Promise<readonly ProcessInfo[]> => {
  const { stdout } = await execFile('ps', ['-ax', '-o', 'pid=,ppid=,command='])
  return ParsePsOutput.parsePsOutput(stdout)
}
