import { expect, test } from '@jest/globals'
import * as Create from '../src/parts/Create/Create.ts'
import * as FileWatcherExplorerStates from '../src/parts/FileWatcherExplorerStates/FileWatcherExplorerStates.ts'

test('create stores the initial view state', () => {
  FileWatcherExplorerStates.clear()
  const state = Create.create(
    7,
    'file-watcher-explorer:///',
    1,
    2,
    300,
    200,
    undefined,
    6,
    2,
    '/assets',
  )
  expect(state).toMatchObject({
    initial: true,
    parentUid: 6,
    platform: 2,
    uid: 7,
    uri: 'file-watcher-explorer:///',
  })
  expect(FileWatcherExplorerStates.get(7).scheduledState).toBe(state)
})
