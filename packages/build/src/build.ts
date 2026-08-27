import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execa } from 'execa'
import { bundleJs } from './bundleJs.ts'
import { bundleNodeJs } from './bundleNodeJs.ts'
import { root } from './root.ts'

const dist = join(root, 'dist')
const fileWatcherViewDist = join(root, '.tmp', 'dist-file-watcher-view')

const readJson = async (path: string): Promise<any> => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path: string, json: any): Promise<void> => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async (): Promise<string> => {
  const { stdout, stderr, exitCode } = await execa(
    'git',
    ['describe', '--exact-match', '--tags'],
    {
      reject: false,
    },
  )
  if (exitCode) {
    if (
      exitCode === 128 &&
      stderr.startsWith('fatal: no tag exactly matches')
    ) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async (): Promise<string> => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    return RG_VERSION.startsWith('v') ? RG_VERSION.slice(1) : RG_VERSION
  }
  if (GIT_TAG) {
    return GIT_TAG.startsWith('v') ? GIT_TAG.slice(1) : GIT_TAG
  }
  return getGitTagFromGit()
}

const replace = async ({
  path,
  occurrence,
  replacement,
}: {
  readonly path: string
  readonly occurrence: string
  readonly replacement: string
}): Promise<void> => {
  const content = await readFile(path, 'utf8')
  const newContent = content.replace(occurrence, replacement)
  await writeFile(path, newContent)
}

await rm(dist, { recursive: true, force: true })
await rm(fileWatcherViewDist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await mkdir(fileWatcherViewDist, { recursive: true })

await bundleNodeJs({
  cwd: root,
  from: 'packages/file-watcher-explorer/src/fileWatcherExplorerMain.ts',
  outFile: 'dist/dist/index.js',
  external: ['electron'],
})

await bundleJs({
  cwd: root,
  from: 'packages/file-watcher-view/src/fileWatcherViewMain.ts',
  outFile: '.tmp/dist-file-watcher-view/index.js',
  browser: true,
  external: ['electron'],
})

await cp(
  join(root, 'packages', 'file-watcher-explorer', 'bin'),
  join(dist, 'bin'),
  {
    recursive: true,
  },
)
await replace({
  path: join(dist, 'bin', 'fileWatcherExplorer.js'),
  occurrence: 'src/fileWatcherExplorerMain.js',
  replacement: 'dist/index.js',
})

const version = await getVersion()
const packageJson = await readJson(
  join(root, 'packages', 'file-watcher-explorer', 'package.json'),
)
const workerPackageJson = await readJson(
  join(root, 'packages', 'file-watcher-view', 'package.json'),
)

delete packageJson.scripts
delete packageJson.devDependencies
delete packageJson.prettier
delete packageJson.jest
delete packageJson.dependencies
delete packageJson.optionalDependencies
packageJson.version = version
packageJson.main = 'dist/index.js'

delete workerPackageJson.scripts
delete workerPackageJson.devDependencies
delete workerPackageJson.prettier
delete workerPackageJson.jest
workerPackageJson.version = version
workerPackageJson.main = 'index.js'

await writeJson(join(dist, 'package.json'), packageJson)
await writeJson(join(fileWatcherViewDist, 'package.json'), workerPackageJson)
await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))
await cp(join(root, 'README.md'), join(fileWatcherViewDist, 'README.md'))
await cp(join(root, 'LICENSE'), join(fileWatcherViewDist, 'LICENSE'))
