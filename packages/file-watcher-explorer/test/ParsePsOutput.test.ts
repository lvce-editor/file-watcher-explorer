import { expect, test } from '@jest/globals'
import * as ParsePsOutput from '../src/parts/ParsePsOutput/ParsePsOutput.ts'

test('parsePsOutput parses pid, parent pid, name, and command', () => {
  expect(
    ParsePsOutput.parsePsOutput(
      '  42     1 /usr/bin/node server.js\n  43    42 bash -l',
    ),
  ).toEqual([
    {
      command: '/usr/bin/node server.js',
      name: 'node',
      pid: 42,
      ppid: 1,
    },
    {
      command: 'bash -l',
      name: 'bash',
      pid: 43,
      ppid: 42,
    },
  ])
})

test('parsePsOutput ignores malformed lines', () => {
  expect(ParsePsOutput.parsePsOutput('header\n\ninvalid')).toEqual([])
})
