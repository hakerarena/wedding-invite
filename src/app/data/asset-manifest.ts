export type AssetManifestKey =
  | 'ganeshBlessing'
  | 'coupleIntroduction'
  | 'nandimukh'
  | 'engagementSangeet'
  | 'flowerHaldi'
  | 'baraat'
  | 'jaimaalReception'
  | 'closingCouple';

export interface AssetManifestEntry {
  path: string;
  alt: string;
  role: string;
  notes?: string[];
  focalPoint?: string;
}

export const assetManifest: Record<AssetManifestKey, AssetManifestEntry | null> = {
  ganeshBlessing: {
    path: 'assets/Ganesh.jpg',
    alt: 'Golden Lord Ganesh blessing illustration framed against a warm background.',
    role: 'Used in the prologue blessing reveal because a Ganesh image is supplied in the repository.',
    notes: [
      'The supplied image appears to be a stock-style devotional illustration with a visible watermark.',
    ],
  },
  coupleIntroduction: {
    path: 'assets/Engagement.png',
    alt: 'Sachin and Surabhi illustrated together during an engagement ring ceremony beneath a spotlight.',
    role: 'Reused as the introductory couple portrait because no separate family or invitation portrait asset was supplied.',
    notes: [
      'The repository does not contain a dedicated family photograph for the invitation copy section.',
    ],
    focalPoint: 'center 30%',
  },
  nandimukh: {
    path: 'assets/Nandimukh.jpg',
    alt: 'A ceremonial vessel decorated with flowers and offerings for the Nandimukh ritual.',
    role: 'Primary image for the Nandimukh section.',
    focalPoint: 'center 64%',
  },
  engagementSangeet: {
    path: 'assets/Engagement.png',
    alt: 'Sachin and Surabhi illustrated during an engagement exchange on a festive stage.',
    role: 'Primary image for the Engagement & Sangeet section.',
    focalPoint: 'center 28%',
  },
  flowerHaldi: {
    path: 'assets/Haldi.png',
    alt: 'Sachin and Surabhi smiling during a haldi celebration surrounded by marigold garlands.',
    role: 'Primary image for the Flower Haldi section.',
    focalPoint: 'center 28%',
  },
  baraat: {
    path: 'assets/Wedding.png',
    alt: 'Sachin and Surabhi beneath an ornate wedding mandap with floral decoration.',
    role: 'Used for the Baraat scene because the repository contains one wedding-stage image but no dedicated baraat procession photograph.',
    notes: [
      'The same wedding asset is reused with a wider composition for the wedding scene transition.',
    ],
    focalPoint: 'center 25%',
  },
  jaimaalReception: {
    path: 'assets/Wedding.png',
    alt: 'Sachin and Surabhi standing together in wedding attire under a festive mandap.',
    role: 'Primary image for Jaimaal & Reception, where the couple is the focal point.',
    notes: [
      'This reuses the supplied wedding asset because no separate reception image is present.',
    ],
    focalPoint: 'center 24%',
  },
  closingCouple: {
    path: 'assets/Outro.jpg',
    alt: 'Sachin and Surabhi posing together for the wedding outro portrait.',
    role: 'Used in the outro as the closing couple portrait.',
    focalPoint: 'center 22%',
  },
};

export const assetAudit = {
  providedAssets: [
    'assets/Ganesh.jpg',
    'assets/Nandimukh.jpg',
    'assets/Engagement.png',
    'assets/Haldi.png',
    'assets/Wedding.png',
    'assets/Outro.jpg',
    'assets/Couple reveal for end.jpg',
  ],
  unresolvedAssignments: [
    'No separate family portrait was supplied, so the introduction uses the provided engagement illustration as a couple portrait.',
    'The outro now uses assets/Outro.jpg as the closing couple portrait with orientation-aware cropping.',
    'assets/Couple reveal for end.jpg depicts a broccoli sculpture rather than the couple or a wedding moment, so it is preserved but intentionally excluded from the live invitation experience.',
    'The supplied ceremony visuals are illustrations rather than documentary photographs, so the site preserves and uses the provided artwork while documenting that limitation.',
  ],
} as const;
