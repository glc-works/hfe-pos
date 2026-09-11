import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'

type SessionStorage = Pick<Storage, 'getItem' | 'removeItem'>

/** Browser snapshots are never proof of a connected person or staff session. */
export function readLegacyPosSession(key: string, session?: SessionStorage, local?: SessionStorage): string | null {
  if (isConnectedFirstPartyRuntime()) {
    session?.removeItem(key)
    local?.removeItem(key)
    return null
  }
  return session?.getItem(key) || local?.getItem(key) || null
}
