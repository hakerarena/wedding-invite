import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { type AssetManifestEntry } from '../../data/asset-manifest';

@Component({
  selector: 'app-wedding-outro',
  standalone: true,
  templateUrl: './wedding-outro.component.html',
  styleUrl: './wedding-outro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeddingOutroComponent {
  @Input({ required: true }) asset!: AssetManifestEntry | null;
  @Input() showReturnTop = false;
  @Output() restartRequested = new EventEmitter<void>();
}
