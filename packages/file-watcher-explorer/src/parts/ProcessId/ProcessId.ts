import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)

const getParentProcessId = async (pid: number): Promise<number> => {
  const { stdout } = await execFile('ps', ['-o', 'ppid=', '-p', String(pid)])
  const parentPid = Number(stdout.trim())
  return Number.isFinite(parentPid) && parentPid > 0 ? parentPid : 0
}

interface GetMainProcessIdOptions {
  readonly childProcessId?: number
  readonly includeElectronData?: boolean
}

export const getMainProcessId = async ({
  childProcessId = process.ppid,
  includeElectronData = true,
}: GetMainProcessIdOptions = {}): Promise<number> => {
  if (includeElectronData) {
    return process.ppid
  }
  try {
    return (await getParentProcessId(childProcessId)) || process.ppid
  } catch {
    return process.ppid
  }
}
