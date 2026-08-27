import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import {
  DataTruthProvider,
  useDataTruth,
  useLiveCoreActivation,
} from '../context/DataTruthContext'
import { toLiveCoreProof } from '../services/financial/liveCoreActivation'
import type { ReadbackValidationResult } from '../services/financial/HfePostingReadbackValidator'

const APPLIED: ReadbackValidationResult = {
  isValid: true,
  finality: 'applied',
  isApplied: true,
  isMismatch: false,
  journalLinesCount: 2,
}

const result = (over: Partial<ReadbackValidationResult>): ReadbackValidationResult => ({
  ...APPLIED,
  ...over,
})

let probeChannel = ''
let capturedActivate: ReturnType<typeof useLiveCoreActivation> | null = null

function Probe(): React.ReactElement {
  const truth = useDataTruth()
  capturedActivate = useLiveCoreActivation()
  probeChannel = truth.channel
  return React.createElement('div', null, truth.channel)
}

describe('#35 Live-Core Activation Bridge (fail-closed read-back gate)', () => {
  it('mints a proof ONLY for an applied, matched read-back', () => {
    const proof = toLiveCoreProof(APPLIED, 'journal-abc')
    expect(proof.source).toContain('HfePostingReadbackValidator')
    expect(proof.referenceId).toBe('journal-abc')
  })

  it('throws and never mints proofs for pending / rejected / mismatched / empty inputs', () => {
    expect(() => toLiveCoreProof(result({ finality: 'pending', isApplied: false }), 'j1')).toThrow()
    expect(() =>
      toLiveCoreProof(result({ finality: 'rejected', isApplied: false, isMismatch: true }), 'j1')
    ).toThrow()
    expect(() => toLiveCoreProof(result({ isValid: false, isMismatch: true }), 'j1')).toThrow()
    expect(() => toLiveCoreProof(APPLIED, '')).toThrow()
    expect(() => toLiveCoreProof(null as unknown as ReadbackValidationResult, 'j1')).toThrow()
  })

  it('gate check strictly PRECEDES confirm invocation (fallback bridge ordering)', () => {
    // Capture the bridge OUTSIDE any provider: its confirm is the locked
    // fallback that always throws. That makes it a perfect sentinel for
    // observing whether the gate runs BEFORE confirmation.
    capturedActivate = null
    renderToString(React.createElement(Probe))
    expect(capturedActivate).not.toBeNull()

    // Invalid read-back => gate error wins; locked confirm never reached.
    expect(() =>
      capturedActivate!(result({ finality: 'pending', isApplied: false }), 'j1')
    ).toThrow(/live-core gate/)

    // Valid read-back => gate passes; only then does the locked confirm reject.
    expect(() => capturedActivate!(APPLIED, 'journal-xyz')).toThrow(
      /outside DataTruthProvider/
    )
  })

  it('in-provider: applied read-back forwards without throwing; failing gate stays demo', () => {
    probeChannel = ''
    renderToString(
      React.createElement(DataTruthProvider, null, React.createElement(Probe))
    )
    expect(probeChannel).toBe('demo')

    // Real dispatch executes synchronously; a passing gate must not surface an error.
    expect(() => capturedActivate!(APPLIED, 'journal-live-1')).not.toThrow()

    expect(() =>
      capturedActivate!(result({ finality: 'rejected', isApplied: false, isMismatch: true }), 'j9')
    ).toThrow(/rejected|finality=rejected/)
  })
})
