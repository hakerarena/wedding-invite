import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { weddingEvents } from './data/wedding-events';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the intro blessing copy', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('With the blessings of');
  });

  it('should expose the four central wedding events', () => {
    expect(weddingEvents).toHaveLength(4);
  });
});
