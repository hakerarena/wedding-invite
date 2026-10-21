import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EnvelopeIntroComponent } from './components/envelope-intro/envelope-intro.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { EventSectionComponent } from './components/event-section/event-section.component';
import { AudioToggleComponent } from './components/audio-toggle/audio-toggle.component';
import { WeddingOutroComponent } from './components/wedding-outro/wedding-outro.component';
import { assetManifest } from './data/asset-manifest';
import { weddingEvents, type WeddingEvent, type WeddingEventId } from './data/wedding-events';
import { AudioService } from './services/audio.service';
import { NavigationService, type InvitationSectionId } from './services/navigation.service';

interface RuntimeEnvironment {
  features?: {
    showCountdownTimer?: boolean | string;
    enableAudio?: boolean | string;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    EnvelopeIntroComponent,
    CountdownTimerComponent,
    EventSectionComponent,
    AudioToggleComponent,
    WeddingOutroComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private static readonly runtimeEnvironmentPath = 'assets/environment.json';

  private readonly document = inject(DOCUMENT);
  private readonly navigation = inject(NavigationService);
  protected readonly audio = inject(AudioService);

  private intersectionObserver?: IntersectionObserver;
  private scrollHandler?: () => void;
  private autoScrollHandler?: () => void;
  private autoScrollAnimationFrame?: number;
  private autoScrollPausedUntil = 0;
  private autoScrollSuppressPauseUntil = 0;
  private autoScrollCarry = 0;
  private autoScrollEnabled = false;
  private envelopeRevealTimer?: number;
  private autoScrollStartTimer?: number;
  private mediaQuery?: MediaQueryList;
  private mediaQueryHandler?: (event: MediaQueryListEvent) => void;
  private countdownTimer?: number;

  protected readonly assetManifest = assetManifest;
  protected readonly weddingEvents = weddingEvents;
  protected readonly countdownNow = signal(Date.now());
  protected readonly showCountdownTimer = signal(true);
  protected readonly envelopeOpening = signal(false);
  protected readonly invitationOpened = signal(false);
  protected readonly prefersReducedMotion = signal(false);
  protected readonly shareFeedback = signal('');
  protected readonly currentSectionId = this.navigation.currentSection;
  protected readonly countdownPinned = computed(() => {
    const sectionId = this.currentSectionId();
    return (
      sectionId === 'countdown' ||
      sectionId === 'nandimukh' ||
      sectionId === 'engagement-sangeet' ||
      sectionId === 'flower-haldi' ||
      sectionId === 'wedding-day' ||
      sectionId === 'outro'
    );
  });
  protected readonly weddingCountdownTargetIso = '2026-12-02T12:00:00+05:30';
  protected readonly weddingCountdown = computed(() => {
    const targetTime = new Date(this.weddingCountdownTargetIso).getTime();
    const remainingMilliseconds = Math.max(0, targetTime - this.countdownNow());

    const totalSeconds = Math.floor(remainingMilliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      complete: remainingMilliseconds === 0,
    };
  });
  protected readonly navigationItems = [
    { id: 'prologue', label: 'Prologue', shortLabel: 'Start' },
    { id: 'intro', label: 'Family Invitation', shortLabel: 'Intro' },
    { id: 'wedding-highlight', label: 'Sachin weds Surabhi', shortLabel: 'Highlight' },
    { id: 'countdown', label: 'Countdown', shortLabel: 'Count' },
    { id: 'nandimukh', label: 'Nandimukh', shortLabel: 'Nandimukh' },
    { id: 'engagement-sangeet', label: 'Engagement & Sangeet', shortLabel: 'Sangeet' },
    { id: 'flower-haldi', label: 'Flower Haldi', shortLabel: 'Haldi' },
    { id: 'wedding-day', label: 'Baraat, Jaimaal & Reception', shortLabel: 'Wedding' },
    { id: 'outro', label: 'Outro', shortLabel: 'Outro' },
  ] as const;
  protected readonly shareUrl = computed(() => {
    if (typeof window === 'undefined') {
      return 'https://example.com';
    }

    return window.location.href;
  });

  ngOnInit(): void {
    void this.hydrateRuntimeFeatureFlags();

    this.mediaQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : undefined;

    this.prefersReducedMotion.set(Boolean(this.mediaQuery?.matches));

    if (this.mediaQuery) {
      this.mediaQueryHandler = (event: MediaQueryListEvent) => {
        this.prefersReducedMotion.set(event.matches);
      };
      this.mediaQuery.addEventListener('change', this.mediaQueryHandler);
    }

    this.countdownTimer = window.setInterval(() => {
      this.countdownNow.set(Date.now());
    }, 1000);
    this.setScrollLocked(true);
    this.setScrollLocked(true);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.navigation.setCurrentSection('prologue');

    if (typeof IntersectionObserver !== 'undefined') {
      const sections = this.document.querySelectorAll<HTMLElement>('[data-section-id]');
      const isDesktop = window.innerWidth >= 1100;
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

          if (!visibleEntry) {
            return;
          }

          const sectionId = (visibleEntry.target as HTMLElement).dataset['sectionId'] as
            InvitationSectionId | undefined;
          if (sectionId) {
            this.navigation.setCurrentSection(sectionId);
          }
        },
        {
          threshold: isDesktop ? [0.55, 0.75, 0.9] : [0.4, 0.65, 0.85],
          rootMargin: isDesktop ? '-25% 0px -15% 0px' : '-10% 0px -45% 0px',
        },
      );

      sections.forEach((section) => this.intersectionObserver?.observe(section));
    }

    this.scrollHandler = () => {
      this.syncCurrentSectionFromViewport();

      if (!this.autoScrollEnabled && Date.now() > this.autoScrollSuppressPauseUntil) {
        this.markAutoScrollPause();
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.syncCurrentSectionFromViewport();

    this.autoScrollHandler = () => this.markAutoScrollPause();
    window.addEventListener('wheel', this.autoScrollHandler, { passive: true });
    window.addEventListener('keydown', this.autoScrollHandler);
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.clearIntroTimers();
    this.stopAutoScroll();
    this.clearOpenTimers();
    if (this.countdownTimer) {
      window.clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    this.setScrollLocked(false);
    if (typeof window !== 'undefined' && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }
    if (typeof window !== 'undefined' && this.autoScrollHandler) {
      window.removeEventListener('wheel', this.autoScrollHandler);
      window.removeEventListener('keydown', this.autoScrollHandler);
      this.autoScrollHandler = undefined;
    }
    if (this.mediaQuery && this.mediaQueryHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryHandler);
    }
  }

  protected openInvitation(): void {
    if (this.envelopeOpening() || this.invitationOpened()) {
      return;
    }

    void this.audio.startPlayback();
    this.clearIntroTimers();
    this.clearOpenTimers();
    this.envelopeOpening.set(true);
    this.invitationOpened.set(true);
    this.navigation.setCurrentSection('prologue');
    this.stopAutoScroll();

    if (typeof window !== 'undefined') {
      const sparkleDelay = this.prefersReducedMotion() ? 0 : 650;
      const autoScrollDelay = this.prefersReducedMotion() ? 0 : 8000;

      this.envelopeRevealTimer = window.setTimeout(() => {
        this.envelopeOpening.set(false);
      }, sparkleDelay);

      window.requestAnimationFrame(() => {
        this.setScrollLocked(false);
        this.autoScrollSuppressPauseUntil = Date.now() + 450;
        this.jumpToOpenSection('intro');
        this.scheduleAutoScrollStart(autoScrollDelay);
      });
    }
  }

  protected scrollToSection(sectionId: InvitationSectionId, behavior?: ScrollBehavior): void {
    this.navigation.scrollTo(
      sectionId,
      behavior ?? (this.prefersReducedMotion() ? 'auto' : 'smooth'),
    );
  }

  protected previousLabel(event: WeddingEvent): string {
    if (event.id === 'nandimukh') {
      return this.showCountdownTimer() ? 'Countdown' : 'Sachin weds Surabhi';
    }

    if (event.previousEventId) {
      return this.labelForSection(event.previousEventId);
    }

    return 'Family Invitation';
  }

  protected nextLabel(event: WeddingEvent): string {
    if (event.id === 'wedding-day') {
      return 'Continue to Outro';
    }

    if (event.nextEventId) {
      return this.labelForSection(event.nextEventId);
    }

    return 'Outro';
  }

  protected goToPrevious(event: WeddingEvent): void {
    if (event.id === 'nandimukh') {
      this.scrollToSection(this.showCountdownTimer() ? 'countdown' : 'wedding-highlight');
      return;
    }

    this.scrollToSection(event.previousEventId ?? 'intro');
  }

  protected goToNext(event: WeddingEvent): void {
    this.scrollToSection(event.nextEventId ?? 'outro');
  }

  protected returnToBeginning(): void {
    this.clearIntroTimers();
    this.clearOpenTimers();
    this.stopAutoScroll();
    this.setScrollLocked(true);
    this.envelopeOpening.set(false);
    this.invitationOpened.set(false);
    this.shareFeedback.set('');
    this.scrollToSection('prologue');
  }

  protected async shareInvitation(): Promise<void> {
    const sharePayload = {
      title: 'Sachin & Surabhi Wedding Invitation',
      text: 'Join us to celebrate the wedding of Sachin and Surabhi.',
      url: this.shareUrl(),
    };

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(sharePayload);
        this.shareFeedback.set('Invitation shared successfully.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          this.shareFeedback.set('Sharing was cancelled.');
          return;
        }
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${sharePayload.text} ${sharePayload.url}`);
        this.shareFeedback.set('Invitation link copied to the clipboard.');
        return;
      } catch {
        this.shareFeedback.set('Clipboard copy failed on this device.');
        return;
      }
    }

    this.shareFeedback.set('Sharing is unavailable in this browser.');
  }

  protected trackByEventId(index: number, event: WeddingEvent): WeddingEventId {
    return event.id;
  }

  private labelForSection(sectionId: InvitationSectionId): string {
    return this.navigationItems.find((item) => item.id === sectionId)?.label ?? 'Celebration';
  }

  private syncCurrentSectionFromViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const sections = Array.from(this.document.querySelectorAll<HTMLElement>('[data-section-id]'));
    if (!sections.length) {
      return;
    }

    const focusLine =
      window.innerWidth >= 1100 ? window.innerHeight * 0.38 : window.innerHeight * 0.62;
    const nearest = sections
      .map((section) => ({
        id: section.dataset['sectionId'] as InvitationSectionId | undefined,
        distance: Math.abs(section.getBoundingClientRect().top - focusLine),
      }))
      .filter((entry): entry is { id: InvitationSectionId; distance: number } => Boolean(entry.id))
      .sort((left, right) => left.distance - right.distance)[0];

    if (!nearest) {
      return;
    }

    this.navigation.setCurrentSection(nearest.id);

    if (nearest.id !== 'prologue' && this.invitationOpened()) {
      this.invitationOpened.set(false);
    }
  }

  private clearIntroTimers(): void {
    if (typeof window === 'undefined') {
      return;
    }
  }

  private async hydrateRuntimeFeatureFlags(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    let runtimeEnvironment: RuntimeEnvironment | undefined;
    try {
      const response = await fetch(App.runtimeEnvironmentPath, { cache: 'no-store' });
      if (response.ok) {
        runtimeEnvironment = (await response.json()) as RuntimeEnvironment;
      } else {
        console.warn(
          `Failed to load runtime environment (${response.status}); using default feature flags.`,
        );
      }
    } catch (error) {
      console.warn('Failed to load runtime environment; using default feature flags.', error);
    }

    const showCountdownTimer = this.parseFeatureFlagValue(
      runtimeEnvironment?.features?.showCountdownTimer,
    );
    if (showCountdownTimer !== undefined) {
      this.showCountdownTimer.set(showCountdownTimer);
    }

    const enableAudio =
      this.parseFeatureFlagValue(runtimeEnvironment?.features?.enableAudio) ?? true;
    this.audio.setEnabled(enableAudio);
    if (enableAudio) {
      void this.audio.startPlayback();
    }
  }

  private parseFeatureFlagValue(value: boolean | string | null | undefined): boolean | undefined {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();
    if (
      normalized === '1' ||
      normalized === 'true' ||
      normalized === 'on' ||
      normalized === 'yes'
    ) {
      return true;
    }

    if (
      normalized === '0' ||
      normalized === 'false' ||
      normalized === 'off' ||
      normalized === 'no'
    ) {
      return false;
    }

    return undefined;
  }

  private clearOpenTimers(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.envelopeRevealTimer) {
      window.clearTimeout(this.envelopeRevealTimer);
      this.envelopeRevealTimer = undefined;
    }

    if (this.autoScrollStartTimer) {
      window.clearTimeout(this.autoScrollStartTimer);
      this.autoScrollStartTimer = undefined;
    }
  }

  private scheduleAutoScrollStart(delayMs: number): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.autoScrollStartTimer) {
      window.clearTimeout(this.autoScrollStartTimer);
    }

    this.autoScrollStartTimer = window.setTimeout(() => {
      this.autoScrollStartTimer = undefined;
      this.startAutoScroll();
    }, delayMs);
  }

  private jumpToOpenSection(sectionId: InvitationSectionId): void {
    if (typeof window === 'undefined') {
      return;
    }

    const targetElement = this.document.getElementById(sectionId);
    if (!targetElement) {
      return;
    }

    const blockPosition: ScrollLogicalPosition = window.innerWidth < 880 ? 'center' : 'start';
    targetElement.scrollIntoView({ behavior: 'auto', block: blockPosition });
  }

  private startAutoScroll(initialDelayMs = 0): void {
    if (typeof window === 'undefined' || this.autoScrollEnabled) {
      return;
    }

    this.autoScrollEnabled = true;
    this.autoScrollCarry = 0;
    this.autoScrollPausedUntil = initialDelayMs > 0 ? Date.now() + initialDelayMs : 0;

    const step = () => {
      if (typeof window === 'undefined' || !this.autoScrollEnabled) {
        return;
      }

      const scrollingElement = this.document.scrollingElement ?? this.document.documentElement;
      const viewportCandidates = [
        window.innerHeight,
        scrollingElement.clientHeight || window.innerHeight,
        Math.floor(window.visualViewport?.height ?? window.innerHeight),
      ].filter((value) => value > 0);
      const effectiveViewportHeight = Math.min(...viewportCandidates);
      const maxScrollTop = Math.max(0, scrollingElement.scrollHeight - effectiveViewportHeight);
      const currentScrollTop = scrollingElement.scrollTop;
      if (currentScrollTop >= maxScrollTop - 1) {
        window.scrollTo({ top: maxScrollTop, left: 0, behavior: 'auto' });
        this.stopAutoScroll();
        return;
      }

      if (Date.now() < this.autoScrollPausedUntil) {
        this.autoScrollAnimationFrame = window.requestAnimationFrame(step);
        return;
      }

      this.autoScrollCarry += 1.5;
      const delta = Math.floor(this.autoScrollCarry);
      if (delta > 0) {
        this.autoScrollCarry -= delta;
        this.autoScrollSuppressPauseUntil = Date.now() + 220;
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }

      this.autoScrollAnimationFrame = window.requestAnimationFrame(step);
    };

    this.autoScrollAnimationFrame = window.requestAnimationFrame(step);
  }

  private stopAutoScroll(): void {
    if (typeof window !== 'undefined' && this.autoScrollAnimationFrame !== undefined) {
      window.cancelAnimationFrame(this.autoScrollAnimationFrame);
      this.autoScrollAnimationFrame = undefined;
    }

    this.autoScrollEnabled = false;
    this.autoScrollCarry = 0;
  }

  private markAutoScrollPause(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.autoScrollPausedUntil = Date.now() + 2000;
  }

  private setScrollLocked(locked: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    const overflowValue = locked ? 'hidden' : '';
    this.document.documentElement.style.overflow = overflowValue;
    this.document.body.style.overflow = overflowValue;
  }
}
