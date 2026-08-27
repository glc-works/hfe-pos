import { describe, it, expect } from 'vitest'
import React from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import {
  DataTruthProvider,
  useDataTruth,
  dataTruthReducer,
  initialTruthState,
} from '../context/DataTruthContext'
import { TruthChannelBadge } from '../ui/TruthChannelBadge'

const REPO_ROOT = join(__dirname, '..', '..')

let captured: ReturnType<typeof useDataTruth> | null = null

function Probe(): React.ReactElement {
  captured = useDataTruth()
  return React.createElement('div', null, `${captured.channel}|${captured.isLiveCore}`)
}

describe('Data Truth Boundary (fail-closed demo default, proof-gated live)', () => {
  it('pure reducer starts fail-closed in demo and flips only on proven confirm', () => {
    expect(initialTruthState).toEqual({ channel: 'demo', proof: null })

    const confirmed = dataTruthReducer(initialTruthState, {
      type: 'confirm-live-core',
      source: 'FinancialKernel::PostingService read-back',
      referenceId: 'journal-123',
    })
    expect(confirmed.channel).toBe('live-core')
    expect(confirmed.proof?.source).toContain('read-back')
    expect(confirmed.proof?.referenceId).toBe('journal-123')

    const pending = dataTruthReducer(confirmed, { type: 'mark-pending-sync' })
    expect(pending.channel).toBe('pending-sync')
    expect(pending.proof).not.toBeNull()

    expect(dataTruthReducer(pending, { type: 'reset-to-demo' })).toEqual(initialTruthState)
  })

  it('rejects confirm without a provenance source (no silent live claim)', () => {
    expect(() =>
      dataTruthReducer(initialTruthState, { type: 'confirm-live-core', source: '' })
    ).toThrow()
    expect(() =>
      dataTruthReducer(initialTruthState, { type: 'confirm-live-core', source: '   ' })
    ).toThrow()
  })

  it('provider boots every session in the demo channel', () => {
    captured = null
    renderToString(
      React.createElement(DataTruthProvider, null, React.createElement(Probe))
    )
    expect(captured!.channel).toBe('demo')
    expect(captured!.isLiveCore).toBe(false)
    expect(captured!.proof).toBeNull()
  })

  it('falls back to a locked demo channel outside any provider', () => {
    captured = null
    renderToString(React.createElement(Probe))
    expect(captured!.channel).toBe('demo')
    expect(captured!.proof).toBeNull()
    expect(() => captured!.confirmLiveCore('x')).toThrow(
      /outside DataTruthProvider/
    )
  })

  it('renders the ambient demo label by default and honors explicit overrides', () => {
    expect(renderToString(React.createElement(TruthChannelBadge))).toContain('Data Demo')
    expect(
      renderToString(React.createElement(TruthChannelBadge, { channel: 'live-core' }))
    ).toContain('LIVE')
    expect(
      renderToString(React.createElement(TruthChannelBadge, { channel: 'pending-sync' }))
    ).toContain('Sinkron CORE')
  })

  it('keeps test parity with the CI gate surface registry (zero drift)', () => {
    const registry = JSON.parse(
      readFileSync(join(REPO_ROOT, 'scripts', 'truth-boundary-surfaces.json'), 'utf8')
    ) as { surfaces: string[] }
    expect(registry.surfaces.length).toBeGreaterThanOrEqual(5)
    for (const rel of registry.surfaces) {
      const src = readFileSync(join(REPO_ROOT, rel), 'utf8')
      expect(
        /useDataTruth\(|<TruthChannelBadge/.test(src),
        `${rel} must consume the truth primitive`
      ).toBe(true)
    }
  })
})
