import { CalendarService } from './calendar.service';
import { weddingEvents } from '../data/wedding-events';

describe('CalendarService', () => {
  it('should create an ICS entry for the Nandimukh ceremony with the correct local start time', () => {
    const service = new CalendarService();
    const ics = service.buildIcsContent(weddingEvents[0]);

    expect(ics).toContain('SUMMARY:Nandimukh');
    expect(ics).toContain('DTSTART;TZID=Asia/Kolkata:20261129T100000');
    expect(ics).toContain('DTEND;TZID=Asia/Kolkata:20261129T130000');
    expect(ics).toContain('LOCATION:Sarkar Residency');
  });
});