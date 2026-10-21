import { type AssetManifestKey } from './asset-manifest';
import { weddingVenues, type WeddingVenue } from './wedding-venues';

export type WeddingEventId = 'nandimukh' | 'engagement-sangeet' | 'flower-haldi' | 'wedding-day';

export type WeddingThemeId = 'ritual' | 'sangeet' | 'haldi' | 'baraat';

export interface WeddingEventScheduleHighlight {
  label: string;
  time: string;
}

export interface WeddingEvent {
  id: WeddingEventId;
  title: string;
  subtitle: string;
  dateIso: string;
  dateLabel: string;
  localStartTime: string;
  startTime24h: string;
  timezone: 'Asia/Kolkata';
  venueId: WeddingVenue['id'];
  venueDisplayName: string;
  mapUrl: string;
  assetKey: AssetManifestKey;
  themeId: WeddingThemeId;
  scheduleHighlights?: readonly WeddingEventScheduleHighlight[];
  previousEventId?: WeddingEventId;
  nextEventId?: WeddingEventId;
  durationMinutes: number;
  calendarDescription: string;
}

const defaultDurationMinutes = 180;

export const weddingEvents: readonly WeddingEvent[] = [
  {
    id: 'nandimukh',
    title: 'Nandimukh',
    subtitle:
      'An intimate Bengali ritual opening the family celebrations with blessings and tradition.',
    dateIso: '2026-11-29',
    dateLabel: '29 November 2026',
    localStartTime: '10:00 AM',
    startTime24h: '10:00',
    timezone: 'Asia/Kolkata',
    venueId: weddingVenues.sarkarResidency.id,
    venueDisplayName: weddingVenues.sarkarResidency.displayName,
    mapUrl: weddingVenues.sarkarResidency.mapsUrl,
    assetKey: 'nandimukh',
    themeId: 'ritual',
    nextEventId: 'engagement-sangeet',
    durationMinutes: defaultDurationMinutes,
    calendarDescription: 'Nandimukh ceremony for the wedding celebrations of Sachin and Surabhi.',
  },
  {
    id: 'engagement-sangeet',
    title: 'Engagement & Sangeet',
    subtitle:
      'An evening of music, light, and celebration as the families gather for the ring ceremony and festive performances.',
    dateIso: '2026-11-30',
    dateLabel: '30 November 2026',
    localStartTime: '5:00 PM',
    startTime24h: '17:00',
    timezone: 'Asia/Kolkata',
    venueId: weddingVenues.virasatHotel.id,
    venueDisplayName: weddingVenues.virasatHotel.displayName,
    mapUrl: weddingVenues.virasatHotel.mapsUrl,
    assetKey: 'engagementSangeet',
    themeId: 'sangeet',
    previousEventId: 'nandimukh',
    nextEventId: 'flower-haldi',
    durationMinutes: defaultDurationMinutes,
    calendarDescription: 'Engagement and sangeet celebration for Sachin and Surabhi.',
  },
  {
    id: 'flower-haldi',
    title: 'Flower Haldi',
    subtitle: 'A bright daytime gathering wrapped in marigolds, haldi, and warm family laughter.',
    dateIso: '2026-12-01',
    dateLabel: '1 December 2026',
    localStartTime: '11:00 AM',
    startTime24h: '11:00',
    timezone: 'Asia/Kolkata',
    venueId: weddingVenues.prayagInn.id,
    venueDisplayName: weddingVenues.prayagInn.displayName,
    mapUrl: weddingVenues.prayagInn.mapsUrl,
    assetKey: 'flowerHaldi',
    themeId: 'haldi',
    previousEventId: 'engagement-sangeet',
    nextEventId: 'wedding-day',
    durationMinutes: defaultDurationMinutes,
    calendarDescription: 'Flower haldi ceremony for Sachin and Surabhi.',
  },
  {
    id: 'wedding-day',
    title: 'Baraat, Jaimaal & Reception',
    subtitle:
      'The wedding day gathers grandeur, colour, and celebration in one seamless gathering at a shared venue.',
    dateIso: '2026-12-02',
    dateLabel: '2 December 2026',
    localStartTime: '12:00 PM onwards',
    startTime24h: '12:00',
    timezone: 'Asia/Kolkata',
    venueId: weddingVenues.chaddhaGarden.id,
    venueDisplayName: weddingVenues.chaddhaGarden.displayName,
    mapUrl: weddingVenues.chaddhaGarden.mapsUrl,
    assetKey: 'jaimaalReception',
    themeId: 'baraat',
    scheduleHighlights: [
      { label: 'Baraat', time: '12:00 PM' },
      { label: 'Jaimaal & Reception', time: '4:00 PM' },
    ],
    previousEventId: 'flower-haldi',
    durationMinutes: 480,
    calendarDescription:
      'Wedding day celebration featuring Baraat, Jaimaal, and Reception for Sachin and Surabhi.',
  },
] as const;
