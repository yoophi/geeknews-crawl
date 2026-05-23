import { registerVaultIpc } from './vault'
import { registerMutateIpc } from './mutate'
import { registerRunIpc } from './run'

export function registerAllIpc(): void {
  registerVaultIpc()
  registerMutateIpc()
  registerRunIpc()
}
