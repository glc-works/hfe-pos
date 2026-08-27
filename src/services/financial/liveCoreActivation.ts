// --- LIVE-CORE ACTIVATION BRIDGE (#35) ---
// Canonical, fail-closed translation from an authoritative L2-POS-91 read-back
// into a DataTruthContext provenance proof. A read-back that did not come back
// `applied` AND fully matched can NEVER produce a proof, so the UI channel
// stays demo/pending regardless of what any transport claimed.
import type { ReadbackValidationResult } from './HfePostingReadbackValidator'

export interface LiveCoreProof {
  source: string
  referenceId: string
}

/**
 * Map a completed read-back validation into activation proof.
 * Throws on every non-applied / mismatched / incomplete input — callers must
 * treat the throw as a financial-integrity event (Dead-Letter territory),
 * never swallow it into a silent success state.
 */
export function toLiveCoreProof(
  validation: ReadbackValidationResult,
  postingId: string
): LiveCoreProof {
  if (!validation || !postingId) {
    throw new Error('live-core activation requires both a read-back result and the expected posting id')
  }
  if (!validation.isValid || !validation.isApplied || validation.isMismatch) {
    throw new Error(
      `read-back did not clear the live-core gate: ${validation.mismatchReason ?? `finality=${validation.finality}`}`
    )
  }
  return { source: 'HfePostingReadbackValidator::applied', referenceId: postingId }
}
