import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { toLiveCoreProof } from '../services/financial/liveCoreActivation'
import type { LiveCoreProof } from '../services/financial/liveCoreActivation'
import type { ReadbackValidationResult } from '../services/financial/HfePostingReadbackValidator'

/**
 * Data Truth Boundary (single source of truth for data authenticity).
 *
 * Fail-closed by construction: every session starts as 'demo' and may only
 * advance to 'live-core' through confirmLiveCore(), which requires an explicit
 * provenance source. Presentational surfaces MUST consume useDataTruth() before
 * rendering success language (Posted / Settled / Ready) about financial or
 * operational truth — see scripts/check-truth-boundary.mjs CI gate.
 */
export type DataTruthChannel = 'live-core' | 'pending-sync' | 'demo'

export interface DataTruthProof {
  source: string
  referenceId?: string
  confirmedAt: string
}

export interface DataTruthState {
  channel: DataTruthChannel
  proof: DataTruthProof | null
}

export type TruthAction =
  | { type: 'confirm-live-core'; source: string; referenceId?: string }
  | { type: 'mark-pending-sync' }
  | { type: 'reset-to-demo' }

export const initialTruthState: DataTruthState = { channel: 'demo', proof: null }

/** Pure state machine — unit-testable without any renderer. */
export function dataTruthReducer(state: DataTruthState, action: TruthAction): DataTruthState {
  switch (action.type) {
    case 'confirm-live-core': {
      if (!action.source || !action.source.trim()) {
        throw new Error('confirmLiveCore requires a non-empty provenance source')
      }
      return {
        channel: 'live-core',
        proof: {
          source: action.source.trim(),
          referenceId: action.referenceId,
          confirmedAt: new Date().toISOString(),
        },
      }
    }
    case 'mark-pending-sync':
      return { ...state, channel: 'pending-sync' }
    case 'reset-to-demo':
      return initialTruthState
  }
}

export interface DataTruthContextValue extends DataTruthState {
  isLiveCore: boolean
  /** Advance to live-core. Throws without a non-empty provenance source. */
  confirmLiveCore: (source: string, referenceId?: string) => void
  markPendingSync: () => void
  resetToDemo: () => void
}

const DataTruthContext = createContext<DataTruthContextValue | null>(null)

const LOCKED_DEMO_CONFIRM = () => {
  throw new Error('confirmLiveCore called outside DataTruthProvider with no provenance context')
}

/** Fail-closed default consumed outside a provider (stories, isolated mounts). */
export const DEMO_TRUTH_FALLBACK: DataTruthContextValue = {
  ...initialTruthState,
  isLiveCore: false,
  confirmLiveCore: LOCKED_DEMO_CONFIRM,
  markPendingSync: () => {},
  resetToDemo: () => {},
}

export function DataTruthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataTruthReducer, initialTruthState)

  const confirmLiveCore = useCallback((source: string, referenceId?: string) => {
    dispatch({ type: 'confirm-live-core', source, referenceId })
  }, [])
  const markPendingSync = useCallback(() => dispatch({ type: 'mark-pending-sync' }), [])
  const resetToDemo = useCallback(() => dispatch({ type: 'reset-to-demo' }), [])

  const value = useMemo<DataTruthContextValue>(
    () => ({
      ...state,
      isLiveCore: state.channel === 'live-core',
      confirmLiveCore,
      markPendingSync,
      resetToDemo,
    }),
    [state, confirmLiveCore, markPendingSync, resetToDemo]
  )

  return <DataTruthContext.Provider value={value}>{children}</DataTruthContext.Provider>
}

export function useDataTruth(): DataTruthContextValue {
  return useContext(DataTruthContext) ?? DEMO_TRUTH_FALLBACK
}

/**
 * #35 activation bridge: the ONLY sanctioned way a runtime flips the channel to
 * live-core — by presenting an applied, fully-matched L2-POS-91 read-back.
 * Throws on every failed gate; treat as financial-integrity event.
 *
 * Integration point: call this in the REAL settlement handler immediately after
 * port.submitRetailTransaction + validator round-trip once connected checkout
 * ships (see src/services/financial/liveCoreActivation.ts). Never wire into the
 * simulated QR/alert flows.
 */
export function useLiveCoreActivation() {
  const { confirmLiveCore } = useDataTruth()
  return useCallback(
    (validation: ReadbackValidationResult, postingId: string): LiveCoreProof => {
      const proof = toLiveCoreProof(validation, postingId)
      confirmLiveCore(proof.source, proof.referenceId)
      return proof
    },
    [confirmLiveCore]
  )
}
