import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  ...config.recommendedRegex,
  ...config.recommendedTsconfig,
  {
    rules: {
      '@cspell/spellchecker': 'off',
      'github-actions/ci-versions': 'off',
      'devcontainer/post-create-command': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['packages/**/test/**/*.ts'],
    rules: {
      'jest/no-restricted-jest-methods': 'off',
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: [
      'packages/file-watcher-view/src/parts/Create/Create.ts',
      'packages/file-watcher-view/src/parts/InitializeFileWatcherExplorer/InitializeFileWatcherExplorer.ts',
      'packages/file-watcher-view/src/parts/LoadContent/LoadContent.ts',
      'packages/file-watcher-view/src/parts/Refresh/Refresh.ts',
    ],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: [
      'packages/file-watcher-view/src/parts/LaunchFileWatcherExplorerNode/LaunchFileWatcherExplorerNode.ts',
    ],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
])
