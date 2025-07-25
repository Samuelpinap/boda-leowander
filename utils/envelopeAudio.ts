// Enhanced audio utilities for envelope animation

export interface AudioConfig {
  volume: number
  enabled: boolean
}

export class EnvelopeAudioManager {
  private audioContext: AudioContext | null = null
  private config: AudioConfig = { volume: 0.3, enabled: true }

  constructor(config?: Partial<AudioConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.config.enabled = false
        return false
      }

      // Initialize Web Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) {
        console.log('Web Audio API not supported')
        return false
      }

      this.audioContext = new AudioContext()
      
      // Handle audio context state
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      return true
    } catch (error) {
      console.log('Audio initialization failed:', error)
      this.config.enabled = false
      return false
    }
  }

  private createOscillator(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.config.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filterNode = this.audioContext.createBiquadFilter()

    // Set up audio nodes
    oscillator.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Configure oscillator
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    // Configure filter for more natural sound
    filterNode.type = 'lowpass'
    filterNode.frequency.setValueAtTime(1000, this.audioContext.currentTime)

    // Configure gain with envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.config.volume, this.audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    // Start and stop oscillator
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  private createNoise(duration: number, filterFreq: number): void {
    if (!this.audioContext || !this.config.enabled) return

    // Create white noise buffer
    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    // Create audio nodes
    const noiseSource = this.audioContext.createBufferSource()
    const filterNode = this.audioContext.createBiquadFilter()
    const gainNode = this.audioContext.createGain()

    // Configure nodes
    noiseSource.buffer = buffer
    filterNode.type = 'bandpass'
    filterNode.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime)
    filterNode.Q.setValueAtTime(5, this.audioContext.currentTime)

    // Connect nodes
    noiseSource.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Configure gain envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.3, this.audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    // Start the noise
    noiseSource.start(this.audioContext.currentTime)
  }

  playEnvelopeOpen(): void {
    if (!this.config.enabled) return

    // Paper rustling sound - combination of filtered noise and low frequency tones
    this.createNoise(0.5, 200)
    
    setTimeout(() => {
      this.createOscillator(150, 0.3, 'sawtooth')
    }, 100)

    setTimeout(() => {
      this.createOscillator(120, 0.2, 'triangle')
    }, 200)
  }

  playLetterUnfold(): void {
    if (!this.config.enabled) return

    // Paper crinkling - higher frequency noise with quick tonal elements
    this.createNoise(0.3, 400)
    
    // Add some tonal elements for realism
    setTimeout(() => {
      this.createOscillator(250, 0.15, 'square')
    }, 50)

    setTimeout(() => {
      this.createOscillator(180, 0.1, 'triangle')
    }, 150)
  }

  playLetterEmerge(): void {
    if (!this.config.enabled) return

    // Soft whoosh sound - filtered noise with frequency sweep
    if (!this.audioContext) return

    const duration = 0.4
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filterNode = this.audioContext.createBiquadFilter()

    oscillator.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Create a whoosh by sweeping frequency and using filtered noise characteristics
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration)

    filterNode.type = 'lowpass'
    filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime)
    filterNode.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.4, this.audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playConfirmationChime(): void {
    if (!this.config.enabled) return

    // Pleasant confirmation sound
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createOscillator(freq, 0.4, 'sine')
      }, index * 100)
    })
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume))
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  getConfig(): AudioConfig {
    return { ...this.config }
  }

  destroy(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance for global use
let audioManager: EnvelopeAudioManager | null = null

export function getEnvelopeAudioManager(): EnvelopeAudioManager {
  if (!audioManager) {
    audioManager = new EnvelopeAudioManager()
  }
  return audioManager
}

// Convenience functions
export async function initializeEnvelopeAudio(): Promise<boolean> {
  const manager = getEnvelopeAudioManager()
  return await manager.initialize()
}

export function playEnvelopeSound(type: 'open' | 'unfold' | 'emerge' | 'confirm'): void {
  const manager = getEnvelopeAudioManager()
  
  switch (type) {
    case 'open':
      manager.playEnvelopeOpen()
      break
    case 'unfold':
      manager.playLetterUnfold()
      break
    case 'emerge':
      manager.playLetterEmerge()
      break
    case 'confirm':
      manager.playConfirmationChime()
      break
  }
}

export function setEnvelopeAudioConfig(config: Partial<AudioConfig>): void {
  const manager = getEnvelopeAudioManager()
  if (config.volume !== undefined) manager.setVolume(config.volume)
  if (config.enabled !== undefined) manager.setEnabled(config.enabled)
}