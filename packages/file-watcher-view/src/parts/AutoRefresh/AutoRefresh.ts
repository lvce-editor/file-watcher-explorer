import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'
import * as Refresh from '../Refresh/Refresh.ts'

const intervals = new Map<number, ReturnType<typeof setInterval>>()
const pending = new Set<number>()

export const dispose = (uid: number): void => {
  const interval = intervals.get(uid)
  if (interval) {
    clearInterval(interval)
    intervals.delete(uid)
  }
  pending.delete(uid)
}

const update = async (uid: number): Promise<void> => {
  if (!FileWatcherExplorerStates.getKeys().includes(uid)) {
    dispose(uid)
    return
  }
  if (pending.has(uid)) {
    return
  }
  pending.add(uid)
  try {
    await FileWatcherExplorerStates.wrapCommand(Refresh.refresh)(uid)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
  } catch (error) {
    console.error(error)
  } finally {
    pending.delete(uid)
  }
}

export const start = (uid: number): void => {
  if (intervals.has(uid)) {
    return
  }
  intervals.set(
    uid,
    setInterval(() => void update(uid), 2000),
  )
}
