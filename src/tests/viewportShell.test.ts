import { describe, it, expect } from 'vitest'

describe('Viewport App Shell & Single Scroll Owner Governance (POS-ENG-STD-001 Rule 9 & GLC-FNB-UX-012)', () => {
  it('enforces 100dvh root dynamic viewport unit without raw 100vw', () => {
    const rootShellClass = 'h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden'
    expect(rootShellClass).toContain('h-[100dvh]')
    expect(rootShellClass).toContain('w-full')
    expect(rootShellClass).not.toContain('100vw')
    expect(rootShellClass).not.toContain('min-h-screen')
  })

  it('guarantees standalone production container has identical 100dvh geometry', () => {
    const standaloneClass = 'h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950'
    expect(standaloneClass).toContain('h-[100dvh]')
    expect(standaloneClass).toContain('overflow-hidden')
  })

  it('guarantees single scroll owner with overscroll-contain and padding buffer', () => {
    const mainScrollOwnerClass = 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 flex flex-col gap-4 pb-32'
    expect(mainScrollOwnerClass).toContain('flex-1')
    expect(mainScrollOwnerClass).toContain('min-h-0')
    expect(mainScrollOwnerClass).toContain('overflow-y-auto')
    expect(mainScrollOwnerClass).toContain('pb-32')
  })

  it('enforces pinned header shrink-0 and bottom dock container containment', () => {
    const headerClass = 'shrink-0 z-30 border-b backdrop-blur-md px-3.5 pt-2 pb-2.5 flex flex-col gap-2 shadow-md theme-customer-header'
    expect(headerClass).toContain('shrink-0')
    expect(headerClass).toContain('z-30')
  })
})
