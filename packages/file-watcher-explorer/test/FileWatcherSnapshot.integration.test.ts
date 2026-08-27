import { expect, test } from '@jest/globals'
import * as CountInotifyWatches from '../src/parts/CountInotifyWatches/CountInotifyWatches.ts'
import * as E2eFixtureWatcher from '../src/parts/E2eFixtureWatcher/E2eFixtureWatcher.ts'
import * as GetFileWatcherSnapshot from '../src/parts/GetFileWatcherSnapshot/GetFileWatcherSnapshot.ts'

test('counts one real fs.watch owned by a descendant process', async () => {
  if (process.platform !== 'linux') {
    return
  }
  const marker = `file-watcher-snapshot-${process.pid}`
  const fixturePid = await E2eFixtureWatcher.createE2eFixtureWatcher(marker)
  try {
    expect(await CountInotifyWatches.countInotifyWatches(fixturePid)).toBe(1)
    const snapshot = await GetFileWatcherSnapshot.getFileWatcherSnapshot(
      process.pid,
    )
    expect(snapshot.supported).toBe(true)
    expect(snapshot.total).toBeGreaterThanOrEqual(1)
    expect(
      snapshot.processes.find(({ pid }) => pid === fixturePid),
    ).toMatchObject({
      pid: fixturePid,
      watcherCount: 1,
    })
  } finally {
    await E2eFixtureWatcher.disposeE2eFixtureWatcher(marker)
  }
})

test('missing process has no inotify watches', async () => {
  expect(await CountInotifyWatches.countInotifyWatches(2_147_483_647)).toBe(0)
})
