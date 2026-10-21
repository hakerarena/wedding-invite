import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  signal,
} from '@angular/core';
import { type InvitationSectionId } from '../../services/navigation.service';

interface NavigationItem {
  id: InvitationSectionId;
  label: string;
  shortLabel: string;
}

@Component({
  selector: 'app-ceremony-navigation',
  standalone: true,
  templateUrl: './ceremony-navigation.component.html',
  styleUrl: './ceremony-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CeremonyNavigationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) items: readonly NavigationItem[] = [];
  @Input({ required: true }) currentSectionId!: InvitationSectionId;
  @Input({ required: true }) countdownTargetIso = '';
  @Output() navigate = new EventEmitter<InvitationSectionId>();

  private countdownTimer?: number;

  protected readonly countdown = signal({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    completed: false,
  });
  protected readonly countdownParts = computed(() => [
    { label: 'Days', value: this.countdown().days },
    { label: 'Hours', value: this.countdown().hours },
    { label: 'Minutes', value: this.countdown().minutes },
    { label: 'Seconds', value: this.countdown().seconds },
  ]);

  ngOnInit(): void {
    this.updateCountdown();

    if (typeof window !== 'undefined') {
      this.countdownTimer = window.setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.countdownTimer) {
      window.clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  private updateCountdown(): void {
    const target = new Date(this.countdownTargetIso);
    const diff = target.getTime() - Date.now();

    if (Number.isNaN(target.getTime()) || diff <= 0) {
      this.countdown.set({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        completed: true,
      });
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown.set({
      days: `${days}`.padStart(2, '0'),
      hours: `${hours}`.padStart(2, '0'),
      minutes: `${minutes}`.padStart(2, '0'),
      seconds: `${seconds}`.padStart(2, '0'),
      completed: false,
    });
  }
}
