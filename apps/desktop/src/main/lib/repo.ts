import { resolve } from 'path'
import { app } from 'electron'

/**
 * Path to the monorepo root (where package.json with the root crawler lives).
 *
 * - dev: app.getAppPath() === apps/desktop, so root === ../..
 * - packaged: bundled, but for current dev workflow we assume the user runs
 *   the app from a checkout. Override via REPO_ROOT env if needed.
 */
export function repoRoot(): string {
  if (process.env.REPO_ROOT) return resolve(process.env.REPO_ROOT)
  return resolve(app.getAppPath(), '..', '..')
}

export function vaultDir(): string {
  if (process.env.VAULT_DIR) return resolve(process.env.VAULT_DIR)
  return resolve(repoRoot(), 'vault')
}
