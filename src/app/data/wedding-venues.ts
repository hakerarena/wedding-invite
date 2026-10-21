export interface WeddingVenue {
  id: 'sarkarResidency' | 'virasatHotel' | 'prayagInn' | 'chaddhaGarden';
  displayName: string;
  mapsUrl: string;
}

export const weddingVenues: Record<WeddingVenue['id'], WeddingVenue> = {
  sarkarResidency: {
    id: 'sarkarResidency',
    displayName: 'Sarkar Residency',
    mapsUrl: 'https://maps.app.goo.gl/spSo5aq5rFrV5jxAA?g_st=ac'
  },
  virasatHotel: {
    id: 'virasatHotel',
    displayName: 'Virasat The Hotel by Triveni Grand',
    mapsUrl: 'https://maps.app.goo.gl/oMWxyPqhk5Qoha7c6?g_st=ac'
  },
  prayagInn: {
    id: 'prayagInn',
    displayName: 'Hotel Prayag Inn',
    mapsUrl: 'https://maps.app.goo.gl/G1kwzaZy219vZDPp6?g_st=ac'
  },
  chaddhaGarden: {
    id: 'chaddhaGarden',
    displayName: 'Chaddha Garden',
    mapsUrl: 'https://maps.app.goo.gl/DTGp6HgsZAsFVcA98'
  }
};