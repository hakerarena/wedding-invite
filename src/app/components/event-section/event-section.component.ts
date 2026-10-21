import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { type AssetManifestEntry } from '../../data/asset-manifest';
import { type WeddingEvent } from '../../data/wedding-events';

@Component({
  selector: 'app-event-section',
  standalone: true,
  templateUrl: './event-section.component.html',
  styleUrl: './event-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSectionComponent {
  @Input({ required: true }) event!: WeddingEvent;
  @Input({ required: true }) asset!: AssetManifestEntry | null;
  @Input({ required: true }) previousLabel = '';
  @Input({ required: true }) nextLabel = '';
  @Input() active = false;
  @Output() previousRequested = new EventEmitter<void>();
  @Output() nextRequested = new EventEmitter<void>();
}
