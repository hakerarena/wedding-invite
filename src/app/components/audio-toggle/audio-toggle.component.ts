import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-audio-toggle',
  standalone: true,
  templateUrl: './audio-toggle.component.html',
  styleUrl: './audio-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioToggleComponent {
  protected readonly audio = inject(AudioService);
}
