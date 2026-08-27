import { expect, test } from '@jest/globals'
import type { ProcessInfo } from '../src/parts/ProcessInfo/ProcessInfo.ts'
import * as GetDescendantProcesses from '../src/parts/GetDescendantProcesses/GetDescendantProcesses.ts'

const processInfo = (pid: number, ppid: number): ProcessInfo => ({
  command: `process-${pid}`,
  name: `process-${pid}`,
  pid,
  ppid,
})

test('getDescendantProcesses includes only the root process subtree', () => {
  const processes = [
    processInfo(4, 2),
    processInfo(1, 0),
    processInfo(3, 1),
    processInfo(2, 1),
    processInfo(5, 99),
  ]
  expect(
    GetDescendantProcesses.getDescendantProcesses(processes, 1).map(
      ({ pid }) => pid,
    ),
  ).toEqual([1, 3, 2, 4])
})

test('getDescendantProcesses returns empty when the root exited', () => {
  expect(
    GetDescendantProcesses.getDescendantProcesses([processInfo(2, 1)], 1),
  ).toEqual([])
})
