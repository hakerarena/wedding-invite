import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { type WeddingEventId } from '../data/wedding-events';

export type InvitationSectionId =
  'prologue' | 'intro' | 'countdown' | WeddingEventId | 'outro';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly document = inject(DOCUMENT);

  readonly currentSection = signal<InvitationSectionId>('prologue');

  setCurrentSection(sectionId: InvitationSectionId): void {
    this.currentSection.set(sectionId);
  }

  scrollTo(sectionId: InvitationSectionId, behavior: ScrollBehavior = 'smooth'): void {
    this.document.getElementById(sectionId)?.scrollIntoView({
      behavior,
      block: 'start',
    });
  }
}
