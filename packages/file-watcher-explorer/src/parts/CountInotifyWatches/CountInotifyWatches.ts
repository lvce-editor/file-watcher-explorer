import { readFile, readdir, readlink } from 'node:fs/promises'
import { join } from 'node:path'

const isInotifyDescriptor = async (fdPath: string): Promise<boolean> => {
  try {
    return (await readlink(fdPath)) === 'anon_inode:inotify'
  } catch {
    return false
  }
}

const countDescriptorWatches = async (
  pid: number,
  fd: string,
): Promise<number> => {
  try {
    const content = await readFile(
      join('/proc', String(pid), 'fdinfo', fd),
      'utf8',
    )
    return content.split('\n').filter((line) => line.startsWith('inotify '))
      .length
  } catch {
    return 0
  }
}

export const countInotifyWatches = async (pid: number): Promise<number> => {
  try {
    const fdDirectory = join('/proc', String(pid), 'fd')
    const fds = await readdir(fdDirectory)
    const inotifyFlags = await Promise.all(
      fds.map((fd) => isInotifyDescriptor(join(fdDirectory, fd))),
    )
    const inotifyFds = fds.filter((_fd, index) => inotifyFlags[index])
    const counts = await Promise.all(
      inotifyFds.map((fd) => countDescriptorWatches(pid, fd)),
    )
    return counts.reduce((total, count) => total + count, 0)
  } catch {
    return 0
  }
}
