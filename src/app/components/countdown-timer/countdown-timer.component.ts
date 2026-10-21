import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CountdownTimerValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
}

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent {
  @Input({ required: true }) countdown!: CountdownTimerValue;
  @Input() pinned = false;
}
