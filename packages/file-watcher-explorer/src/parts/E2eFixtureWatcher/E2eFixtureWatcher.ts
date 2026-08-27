import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as CountInotifyWatches from '../CountInotifyWatches/CountInotifyWatches.ts'

const fixtureScript = `
const fs = require('node:fs')
const directory = process.argv[1]
const watcher = fs.watch(directory, () => {})
process.on('SIGTERM', () => {
  watcher.close()
  process.exit(0)
})
setTimeout(() => process.exit(0), 120_000)
setInterval(() => {}, 1_000)
`

interface Fixture {
  readonly directory: string
  readonly pid: number
}

const fixtures = new Map<string, Fixture>()

const waitForWatcher = async (pid: number): Promise<void> => {
  for (let attempt = 0; attempt < 40; attempt++) {
    if ((await CountInotifyWatches.countInotifyWatches(pid)) === 1) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error('Timed out waiting for e2e fixture watcher')
}

export const createE2eFixtureWatcher = async (
  marker: string,
): Promise<number> => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-file-watcher-'))
  const childProcess = spawn(
    process.execPath,
    ['-e', fixtureScript, directory, marker],
    {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
      shell: false,
      stdio: 'ignore',
    },
  )
  childProcess.unref()
  if (!childProcess.pid) {
    await rm(directory, { force: true, recursive: true })
    throw new Error('Failed to create e2e fixture watcher')
  }
  fixtures.set(marker, { directory, pid: childProcess.pid })
  await waitForWatcher(childProcess.pid)
  return childProcess.pid
}

export const disposeE2eFixtureWatcher = async (
  marker: string,
): Promise<void> => {
  const fixture = fixtures.get(marker)
  if (!fixture) {
    return
  }
  fixtures.delete(marker)
  try {
    process.kill(fixture.pid, 'SIGTERM')
  } catch {
    // best effort cleanup for tests
  }
  await rm(fixture.directory, { force: true, recursive: true })
}
