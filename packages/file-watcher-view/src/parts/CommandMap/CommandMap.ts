import { terminate } from '@lvce-editor/viewlet-registry'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as E2eFixtureWatcher from '../E2eFixtureWatcher/E2eFixtureWatcher.ts'
import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'

const handleDirectMessagePort = (port: MessagePort): Promise<void> =>
  HandleMessagePort.handleMessagePort(port, commandMap)

export const commandMap = {
  'FileWatcherExplorer.create': Create.create,
  'FileWatcherExplorer.createE2eFixtureWatcher':
    FileWatcherExplorerStates.wrapCommand(
      E2eFixtureWatcher.createE2eFixtureWatcher,
    ),
  'FileWatcherExplorer.diff2': Diff2.diff2,
  'FileWatcherExplorer.dispose': Dispose.dispose,
  'FileWatcherExplorer.disposeE2eFixtureWatcher':
    FileWatcherExplorerStates.wrapCommand(
      E2eFixtureWatcher.disposeE2eFixtureWatcher,
    ),
  'FileWatcherExplorer.getCommandIds': FileWatcherExplorerStates.getCommandIds,
  'FileWatcherExplorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'FileWatcherExplorer.handleMessagePort': handleDirectMessagePort,
  'FileWatcherExplorer.loadContent': FileWatcherExplorerStates.wrapLoadContent(
    LoadContent.loadContent,
  ),
  'FileWatcherExplorer.refresh': FileWatcherExplorerStates.wrapCommand(
    Refresh.refresh,
  ),
  'FileWatcherExplorer.render2': Render2.render2,
  'FileWatcherExplorer.renderEventListeners':
    RenderEventListeners.renderEventListeners,
  'FileWatcherExplorer.terminate': terminate,
}
