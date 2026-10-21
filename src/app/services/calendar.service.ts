import { Injectable } from '@angular/core';
import { type WeddingEvent } from '../data/wedding-events';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  buildIcsContent(event: WeddingEvent): string {
    const startDate = this.buildLocalDate(event.dateIso, event.startTime24h);
    const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);
    const uid = `${event.id}@sachin-surabhi-invitation`;
    const stamp = this.formatUtcDate(new Date());

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sachin Surabhi Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Kolkata',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0530',
      'TZOFFSETTO:+0530',
      'TZNAME:IST',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=Asia/Kolkata:${this.formatLocalDate(startDate)}`,
      `DTEND;TZID=Asia/Kolkata:${this.formatLocalDate(endDate)}`,
      `SUMMARY:${this.escapeText(event.title)}`,
      `DESCRIPTION:${this.escapeText(event.calendarDescription)}`,
      `LOCATION:${this.escapeText(event.venueDisplayName)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  downloadEvent(event: WeddingEvent): void {
    const content = this.buildIcsContent(event);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${event.id}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private buildLocalDate(dateIso: string, startTime24h: string): Date {
    const [year, month, day] = dateIso.split('-').map(Number);
    const [hours, minutes] = startTime24h.split(':').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  }

  private formatLocalDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}00`;
  }

  private formatUtcDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');
    const seconds = `${date.getUTCSeconds()}`.padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  private escapeText(value: string): string {
    return value
      .split('\\').join(String.raw`\\`)
      .split(',').join(String.raw`\,`)
      .split(';').join(String.raw`\;`)
      .split('\n').join(String.raw`\n`);
  }
}