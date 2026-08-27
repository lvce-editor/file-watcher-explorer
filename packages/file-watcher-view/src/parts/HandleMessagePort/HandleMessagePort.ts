import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleMessagePort = async (
  port: MessagePort,
  commandMap: Readonly<Record<string, any>>,
): Promise<void> => {
  const executeViewletCommand = async (
    uid: number,
    command: string,
    ...args: readonly any[]
  ): Promise<void> => {
    const fn = commandMap[`FileWatcherExplorer.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    await fn(uid, ...args)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
  }
  RendererProcess.set(
    await PlainMessagePortRpc.create({
      commandMap: { 'Viewlet.executeViewletCommand': executeViewletCommand },
      messagePort: port,
    }),
  )
}
