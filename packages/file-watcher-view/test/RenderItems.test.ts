import { expect, test } from '@jest/globals'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'
import { createTestState } from './TestState.ts'

test('renders watcher total and process table', () => {
  const state = createTestState({
    processes: [
      {
        command: 'node watcher-fixture',
        name: 'node',
        pid: 42,
        ppid: 1,
        watcherCount: 1,
      },
    ],
    total: 1,
  })
  const command = RenderItems.renderItems(state, state)
  expect(command[0]).toBe('Viewlet.setDom2')
  expect(command[1]).toBe(7)
  expect(command[2]).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        ariaLabel: 'File Watcher Explorer',
        className: 'FileWatcherExplorerTable',
      }),
      expect.objectContaining({
        className: 'FileWatcherExplorerRow',
        'data-pid': 42,
        title: 'node watcher-fixture',
      }),
      expect.objectContaining({ text: '1 watchers across 1 processes' }),
    ]),
  )
})

test('renders unsupported message', () => {
  const state = createTestState({
    message: 'File Watcher Explorer is not supported on web.',
    supported: false,
  })
  const dom = RenderItems.renderItems(state, state)[2]
  expect(dom).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'FileWatcherExplorer FileWatcherExplorerMessage',
      }),
      expect.objectContaining({
        text: 'File Watcher Explorer is not supported on web.',
      }),
    ]),
  )
})
