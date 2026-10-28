# Ralph Gracie Pleasanton

Live site: https://rg-pleasanton.vercel.app/

This dependency-free static site preserves the six original pages, source copy, 312 media files, and all gallery albums. The original brand colors are black, #CD391A, and #F5F5F5.

## Build and preview

Use Node.js to run:

```
node build.mjs
node serve.mjs 4790
```

The build writes the complete deployable website to `site/`. Vercel runs `node build.mjs` and publishes `site/`; its existing settings are in `vercel.json`. Generated output is excluded from Git and rebuilt from source.

The `tools/` directory contains the original Wix migration utilities. Normal development and deployment do not require running them; all content and media are already included in `src/`.

## Content and presentation

- `src/content/texts.json`: original page copy.
- `src/content/gallery.json`: original gallery album metadata.
- `src/media/`: all original media.
- `build.mjs`: shared HTML layout and page templates.
- `src/assets/styles.css`: responsive layout and reduced-motion support.
- `src/assets/site.js`: navigation, photo rails, lightbox, scroll reveals, and video controls.

## Wiil assistant and booking

The shared layout adds the supplied Pleasanton widget configuration before `</body>` on every page, including the 404 page. It enables chat and voice and retains `data-auto-open="true"`.

`src/assets/booking.js` initializes the widget after the deferred CDN script, then connects all marked class-booking links to the widget instance's public `open()` method. Header and hero intro buttons, kids/adult intro buttons, gallery booking, and the contact booking link use this behavior. Opening the assistant does not submit a chat message or create a booking. Existing links remain fallback destinations if the SDK cannot open.

Configuration ID: `ntVgcxIBkOV8pLWKAKFX`.
