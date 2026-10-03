import { ViewletCommand } from '@lvce-editor/constants'
import {
  mergeClassNames,
  text,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { FileWatcherExplorerState } from '../FileWatcherExplorerState/FileWatcherExplorerState.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'

type VirtualDomNode = Readonly<Record<string, unknown>>

const tableHeadNode: VirtualDomNode = {
  childCount: 1,
  role: AriaRoles.RowGroup,
  type: VirtualDomElements.THead,
}

const headerRowNode: VirtualDomNode = {
  childCount: 3,
  role: AriaRoles.Row,
  type: VirtualDomElements.Tr,
}

const headerCellNode: VirtualDomNode = {
  childCount: 1,
  className: 'FileWatcherExplorerHeaderCell',
  role: AriaRoles.ColumnHeader,
  type: VirtualDomElements.Th,
}

const messageNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(
    'FileWatcherExplorer',
    'FileWatcherExplorerMessage',
  ),
  type: VirtualDomElements.Div,
}

const rootNode: VirtualDomNode = {
  childCount: 2,
  className: 'FileWatcherExplorer',
  type: VirtualDomElements.Div,
}

const summaryNode: VirtualDomNode = {
  childCount: 1,
  className: 'FileWatcherExplorerSummary',
  type: VirtualDomElements.Div,
}

const fileWatcherExplorerNameCellClassName = mergeClassNames(
  'FileWatcherExplorerCell',
  'FileWatcherExplorerNameCell',
)

const fileWatcherExplorerWatcherCountCellClassName = mergeClassNames(
  'FileWatcherExplorerCell',
  'FileWatcherExplorerWatcherCountCell',
)

const cell = (className: string, value: string): readonly VirtualDomNode[] => [
  {
    childCount: 1,
    className,
    role: AriaRoles.GridCell,
    type: VirtualDomElements.Td,
  },
  text(value),
]

const header = (value: string): readonly VirtualDomNode[] => [
  headerCellNode,
  text(value),
]

const getTableDom = (
  state: FileWatcherExplorerState,
): readonly VirtualDomNode[] => {
  const { processes } = state
  return [
    {
      ariaLabel: 'File Watcher Explorer',
      ariaRowCount: processes.length + 1,
      childCount: 2,
      className: 'FileWatcherExplorerTable',
      role: AriaRoles.Grid,
      type: VirtualDomElements.Table,
    },
    tableHeadNode,
    headerRowNode,
    ...header('Process'),
    ...header('PID'),
    ...header('Watchers'),
    {
      childCount: processes.length,
      role: AriaRoles.RowGroup,
      type: VirtualDomElements.TBody,
    },
    ...processes.flatMap((processInfo) => [
      {
        childCount: 3,
        className: 'FileWatcherExplorerRow',
        'data-pid': processInfo.pid,
        role: AriaRoles.Row,
        title: processInfo.command,
        type: VirtualDomElements.Tr,
      },
      ...cell(fileWatcherExplorerNameCellClassName, processInfo.name),
      ...cell('FileWatcherExplorerCell', String(processInfo.pid)),
      ...cell(
        fileWatcherExplorerWatcherCountCellClassName,
        String(processInfo.watcherCount),
      ),
    ]),
  ]
}

const getDom = (state: FileWatcherExplorerState): readonly VirtualDomNode[] => {
  const { errorMessage, initial, message, processes, total } = state
  if (initial) {
    return []
  }
  const displayMessage = errorMessage || message
  if (displayMessage) {
    return [messageNode, text(displayMessage)]
  }
  return [
    rootNode,
    summaryNode,
    text(`${total} watchers across ${processes.length} processes`),
    ...getTableDom(state),
  ]
}

export const renderItems = (
  _oldState: FileWatcherExplorerState,
  newState: FileWatcherExplorerState,
): readonly any[] => [ViewletCommand.SetDom2, newState.uid, getDom(newState)]
