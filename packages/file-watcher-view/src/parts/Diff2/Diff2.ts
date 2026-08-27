import * as FileWatcherExplorerStates from '../FileWatcherExplorerStates/FileWatcherExplorerStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { oldState, scheduledState } = FileWatcherExplorerStates.get(uid)
  return oldState.initial === scheduledState.initial &&
    oldState.errorMessage === scheduledState.errorMessage &&
    oldState.message === scheduledState.message &&
    oldState.processes === scheduledState.processes &&
    oldState.total === scheduledState.total
    ? []
    : [1]
}
