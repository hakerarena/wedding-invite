import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-envelope-intro',
  standalone: true,
  templateUrl: './envelope-intro.component.html',
  styleUrl: './envelope-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvelopeIntroComponent {
  @Input({ required: true }) opened = false;
  @Input() opening = false;
  @Input() reducedMotion = false;
  @Output() openRequested = new EventEmitter<void>();
}
