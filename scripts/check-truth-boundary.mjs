#!/usr/bin/env node
/**
 * Data Truth Boundary Gate (CI).
 *
 * Fails when any registered financial-truth surface renders without consuming
 * the DataTruthContext primitive (useDataTruth() / <TruthChannelBadge/>), or
 * when banned fabrication patterns (e.g. fake settled status inside catch)
 * reappear in service transports.
 *
 * Surface registry: scripts/truth-boundary-surfaces.json (single source of truth,
 * shared with src/tests/dataTruthBoundary.test.ts).
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(
  readFileSync(join(root, 'scripts', 'truth-boundary-surfaces.json'), 'utf8')
)

const CONSUMPTION_RE = /useDataTruth\(|<TruthChannelBadge/
let failed = false

for (const rel of config.surfaces) {
  const abs = join(root, rel)
  if (!existsSync(abs)) {
    console.error(`✗ MISSING SURFACE FILE: ${rel}`)
    failed = true
    continue
  }
  const src = readFileSync(abs, 'utf8')
  if (!CONSUMPTION_RE.test(src)) {
    console.error(
      `✗ TRUTH BOUNDARY VIOLATION: ${rel} does not consume useDataTruth()/<TruthChannelBadge/>. ` +
        `Financial success language may not be rendered without the DataTruthContext channel.`
    )
    failed = true
  } else {
    console.log(`✓ ${rel}`)
  }
}

for (const scope of config.bannedPatternScopes ?? []) {
  const { readdirSync, statSync } = await import('node:fs')
  const walk = dir => {
    for (const entry of readdirSync(join(root, dir))) {
      const abs = join(root, dir, entry)
      if (statSync(abs).isDirectory()) walk(join(dir, entry))
      else if (abs.endsWith('.ts') || abs.endsWith('.tsx')) checkBanned(join(dir, entry))
    }
  }
  const checkBanned = relFromScope => {
    const rel = relFromScope.replace(/\\/g, '/')
    const src = readFileSync(join(root, rel), 'utf8')
    for (const [name, pattern] of Object.entries(config.bannedPatterns ?? {})) {
      if (new RegExp(pattern).test(src)) {
        console.error(`✗ BANNED PATTERN "${name}" in ${rel}`)
        failed = true
      }
    }
  }
  walk(scope)
}

if (failed) {
  console.error('\n✗ Data Truth Boundary gate FAILED — see violations above.')
  process.exit(1)
}
console.log('\n✓ Data Truth Boundary gate passed: all surfaces consume the truth channel primitive.')
