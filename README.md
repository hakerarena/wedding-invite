# Sachin & Surabhi Wedding Invitation

Interactive Angular wedding invitation for Sachin and Surabhi. The experience begins with an animated envelope and Ganesh blessing, then transitions into a scrollable invitation with ceremony navigation, venue links, calendar downloads, sharing, and a closing message.

## Stack

- Angular 21 standalone components
- TypeScript and SCSS
- Angular signals for invitation state and navigation state
- Browser-native share and clipboard fallback
- Downloadable `.ics` calendar files for each event

## Project structure

- `src/app/components`: invitation scenes and reusable controls
- `src/app/data`: centralized asset manifest, venue map links, and ceremony event data
- `src/app/services`: navigation, calendar, and optional audio logic
- `assets`: preserved supplied imagery

## Asset inventory and mapping

Supplied assets preserved exactly as found:

- `assets/Ganesh.jpg`
- `assets/Nandimukh.jpg`
- `assets/Engagement.png`
- `assets/Haldi.png`
- `assets/Wedding.png`
- `assets/Couple reveal for end.jpg`

Mapped roles in the application:

- `ganeshBlessing` → `assets/Ganesh.jpg`
- `coupleIntroduction` → `assets/Engagement.png`
- `nandimukh` → `assets/Nandimukh.jpg`
- `engagementSangeet` → `assets/Engagement.png`
- `flowerHaldi` → `assets/Haldi.png`
- `baraat` → `assets/Wedding.png`
- `jaimaalReception` → `assets/Wedding.png`
- `closingCouple` → `assets/Wedding.png`

Documented limitations:

- `assets/Couple reveal for end.jpg` is unrelated to the wedding content and is excluded from the rendered invitation.
- The supplied event visuals are illustrations rather than documentary couple photographs.
- No dedicated family portrait, baraat procession image, or separate reception image is present, so the available supplied wedding art is reused with different compositions.

## Development

Install dependencies:

```bash
npx npm@11.6.2 install
```

Start the local server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run unit tests:

```bash
npm test -- --watch=false
```

## Audio

Audio playback is enabled by default and starts when the invitation loads. Browsers may block
audible autoplay until the visitor interacts with the page; opening the envelope retries playback.
The speaker control lets visitors pause and resume audio.

Audio availability is controlled by `features.enableAudio` in `assets/environment.json`. Set it to
`false` to disable playback and hide the speaker control, or `true` to enable audio. The supplied
track is `assets/Music.mp3`.

## Deployment notes

- Share links use the current browser URL at runtime, so the deployed host is used automatically.
- Google Maps links are centralized in `src/app/data/wedding-venues.ts` and use the exact URLs supplied in the brief.
- Calendar downloads are generated in the `Asia/Kolkata` timezone.
