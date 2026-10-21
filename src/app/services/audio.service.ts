import { Injectable, computed, signal } from '@angular/core';

type AudioStatus = 'loading' | 'paused' | 'playing' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly source = 'assets/Music.mp3';
  private audio?: HTMLAudioElement;
  private initialized = false;

  readonly enabled = signal(false);
  readonly status = signal<AudioStatus>('loading');
  readonly muted = signal(false);
  readonly label = computed(() => {
    switch (this.status()) {
      case 'playing':
        return 'Audio playing';
      case 'paused':
        return 'Audio paused';
      case 'unavailable':
        return 'Audio unavailable';
      default:
        return 'Checking audio';
    }
  });

  setEnabled(enabled: boolean): void {
    this.enabled.set(enabled);

    if (!enabled) {
      this.audio?.pause();
      this.status.set('paused');
    }
  }

  async initialize(): Promise<void> {
    if (!this.enabled() || this.initialized || typeof window === 'undefined') {
      return;
    }

    this.initialized = true;

    try {
      const response = await fetch(this.source, { method: 'HEAD' });
      if (!response.ok) {
        this.status.set('unavailable');
        return;
      }

      this.audio = new Audio(this.source);
      this.audio.preload = 'auto';
      this.audio.addEventListener('play', () => this.status.set('playing'));
      this.audio.addEventListener('pause', () => this.status.set('paused'));
      this.audio.addEventListener('ended', () => this.status.set('paused'));
      this.audio.addEventListener('error', () => this.status.set('unavailable'));
      this.audio.muted = this.muted();
      this.status.set('paused');
    } catch {
      this.status.set('unavailable');
    }
  }

  async startPlayback(): Promise<void> {
    await this.initialize();

    if (!this.enabled() || !this.audio || this.status() === 'unavailable') {
      return;
    }

    if (!this.audio.paused) {
      this.status.set('playing');
      return;
    }

    if (this.audio.ended) {
      this.audio.currentTime = 0;
    }

    try {
      await this.audio.play();
    } catch {
      this.status.set('paused');
    }
  }

  async togglePlayback(): Promise<void> {
    await this.initialize();

    if (!this.enabled() || !this.audio || this.status() === 'unavailable') {
      return;
    }

    if (this.audio.paused) {
      await this.startPlayback();
      return;
    }

    this.audio.pause();
  }

  async toggleMute(): Promise<void> {
    await this.initialize();
    if (!this.enabled()) {
      return;
    }

    this.muted.update((value) => !value);

    if (this.audio) {
      this.audio.muted = this.muted();
    }
  }
}
