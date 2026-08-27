import { diffTree } from '@lvce-editor/virtual-dom-worker'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const render2 = async (
  uid: number,
  diffResult: readonly number[],
): Promise<readonly any[]> => {
  const { oldState, scheduledState } = FileWatcherExplorerStates.get(uid)
  FileWatcherExplorerStates.set(uid, scheduledState, scheduledState)
  if (diffResult.length === 0) {
    return []
  }
  const oldDom = RenderItems.renderItems(oldState, oldState)[2]
  const newDom = RenderItems.renderItems(scheduledState, scheduledState)[2]
  const commands = [['Viewlet.setPatches', uid, diffTree(oldDom, newDom)]]
  if (!RendererProcess.isConnected()) {
    return commands
  }
  const transactionId = await RendererProcess.invoke(
    'Viewlet.queueCommands',
    uid,
    commands,
  )
  return [['Viewlet.commitPending', uid, transactionId]]
}
