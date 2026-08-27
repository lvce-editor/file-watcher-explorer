import type { Rpc } from '@lvce-editor/rpc'
import {
  ElectronMessagePortRpcClient,
  ElectronUtilityProcessRpcClient,
  NodeForkedProcessRpcClient,
  NodeWebSocketRpcClient,
  NodeWorkerRpcClient,
} from '@lvce-editor/rpc'
import { SharedProcess } from '@lvce-editor/rpc-registry'
import * as E2eFixtureWatcher from '../E2eFixtureWatcher/E2eFixtureWatcher.ts'
import * as GetFileWatcherSnapshot from '../GetFileWatcherSnapshot/GetFileWatcherSnapshot.ts'
import * as ProcessId from '../ProcessId/ProcessId.ts'

const requiresSocket = (): boolean => false

const exit = (): void => {
  process.exitCode = 0
  process.kill(process.pid, 'SIGTERM')
}

const handleClose = async (): Promise<void> => {
  try {
    const refCount = await SharedProcess.invoke(
      'FileWatcherExplorer.decreaseRefCount',
    )
    if (refCount === 0) {
      exit()
    }
  } catch {
    exit()
  }
}

const listenForClose = (rpc: Rpc): void => {
  const { ipc } = rpc as Rpc & { readonly ipc?: any }
  if (!ipc) {
    return
  }
  if (typeof ipc.addEventListener === 'function') {
    ipc.addEventListener('close', () => void handleClose(), { once: true })
  } else if (typeof ipc.once === 'function') {
    ipc.once('close', () => void handleClose())
  }
}

const handleMessagePort = async (messagePort: unknown): Promise<void> => {
  const rpc = await ElectronMessagePortRpcClient.create({
    commandMap,
    messagePort,
    requiresSocket,
  })
  listenForClose(rpc)
}

const handleWebSocket = async (
  handle: unknown,
  request: unknown,
): Promise<void> => {
  if (!handle || !request) {
    return
  }
  const rpc = await NodeWebSocketRpcClient.create({
    commandMap,
    handle,
    request,
    requiresSocket,
  })
  listenForClose(rpc)
}

const commandMap = {
  'FileWatcherExplorer.createE2eFixtureWatcher':
    E2eFixtureWatcher.createE2eFixtureWatcher,
  'FileWatcherExplorer.disposeE2eFixtureWatcher':
    E2eFixtureWatcher.disposeE2eFixtureWatcher,
  'FileWatcherExplorer.getSnapshot':
    GetFileWatcherSnapshot.getFileWatcherSnapshot,
  'HandleElectronMessagePort.handleElectronMessagePort': handleMessagePort,
  'HandleMessagePort.handleMessagePort': handleMessagePort,
  'HandleWebSocket.handleWebSocket': handleWebSocket,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
}

const getFactory = (): ((options: any) => Promise<Rpc>) => {
  if (process.argv.includes('--ipc-type=node-worker')) {
    return NodeWorkerRpcClient.create
  }
  if (process.argv.includes('--ipc-type=node-forked-process')) {
    return NodeForkedProcessRpcClient.create
  }
  if (process.argv.includes('--ipc-type=electron-utility-process')) {
    return ElectronUtilityProcessRpcClient.create
  }
  throw new Error('[file-watcher-explorer] unknown ipc type')
}

export const main = async (): Promise<void> => {
  const rpc = await getFactory()({ commandMap })
  SharedProcess.set(rpc)
}
