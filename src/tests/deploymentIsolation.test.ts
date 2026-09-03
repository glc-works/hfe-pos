import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const workflowPath = path.resolve(__dirname, '../../.github/workflows/deploy.yml')

function pagesDeployCommands(): string[] {
  const workflow = fs.readFileSync(workflowPath, 'utf8')
  return workflow
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('command: pages deploy '))
}

describe('Cloudflare Pages deployment isolation', () => {
  it('routes preview and production to four distinct projects', () => {
    const commands = pagesDeployCommands()

    expect(commands).toEqual([
      'command: pages deploy packages/storefront-astro/dist --project-name=pos-landing-preview --branch=main',
      'command: pages deploy dist --project-name=pos-app-preview --branch=main',
      'command: pages deploy packages/storefront-astro/dist --project-name=pos-landing-production --branch=main',
      'command: pages deploy dist --project-name=pos-app-production --branch=main',
    ])

    const projects = commands.map((command) => command.match(/--project-name=([^ ]+)/)?.[1])
    expect(new Set(projects).size).toBe(4)
  })

  it('builds each environment with its matching Company Book surface', () => {
    const workflow = fs.readFileSync(workflowPath, 'utf8')

    expect(workflow).toContain(
      "VITE_HFE_COMPANY_BOOK_URL: ${{ vars.HFE_COMPANY_BOOK_URL || 'https://prv-companybook.hfeit.app' }}",
    )
    expect(workflow).toContain(
      "VITE_HFE_COMPANY_BOOK_URL: ${{ vars.HFE_COMPANY_BOOK_URL || 'https://book.hfeit.app' }}",
    )
    expect(workflow).not.toContain('https://prv-core.hfeit.com')
    expect(workflow).not.toContain("VITE_HFE_COMPANY_BOOK_URL: ${{ vars.HFE_COMPANY_BOOK_URL || 'https://core.hfeit.com' }}")
  })
})
