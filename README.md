# File Watcher Explorer

File Watcher Explorer shows the number of Linux inotify watches owned by LVCE Editor and each of its descendant processes.

The repository publishes two packages:

- `@lvce-editor/file-watcher-explorer`: the Linux `/proc` collector process.
- `@lvce-editor/file-watcher-view`: the web worker that renders the editor table.

Electron and remote-server sessions are supported on Linux. Browser-only sessions show an unsupported message, and non-Linux hosts report that collection is unavailable.
Inspect file watcher usage across LVCE Editor processes
