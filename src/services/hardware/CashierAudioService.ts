export class CashierAudioService {
  private static instance: CashierAudioService
  private audioCtx: AudioContext | null = null
  private enabled: boolean = true

  private constructor() {
    try {
      const saved = localStorage.getItem('hfe_cashier_sound_enabled')
      if (saved !== null) {
        this.enabled = JSON.parse(saved)
      }
    } catch {
      // ignore
    }
  }

  public static getInstance(): CashierAudioService {
    if (!CashierAudioService.instance) {
      CashierAudioService.instance = new CashierAudioService()
    }
    return CashierAudioService.instance
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
    try {
      localStorage.setItem('hfe_cashier_sound_enabled', JSON.stringify(enabled))
    } catch {
      // ignore
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public playBeep(freq = 880, durationMs = 120): void {
    if (!this.enabled) return
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + durationMs / 1000)
    } catch {
      // ignore audio playback errors
    }
  }

  public playSuccessChime(): void {
    if (!this.enabled) return
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const startTime = ctx.currentTime + idx * 0.08
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.12, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.18)
      })
    } catch {
      // ignore
    }
  }
}
