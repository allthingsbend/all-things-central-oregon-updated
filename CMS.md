# Editing with Pages CMS

Pages CMS is an optional editing screen on top of this GitHub repository. GitHub remains the source of truth, and every CMS save creates a Git commit that triggers the existing Cloudflare Pages deployment.

## First-time setup

1. Visit https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App for the `allthingsbend` account.
3. Grant it access to `all-things-central-oregon-updated`.
4. Open the repository and select the `main` branch.

## What editors can change

- Homepage search title, description, hero text, optional hero image, labels, and introduction.
- About page search title, hero, sections, lists, and contact button.
- Images in `public/uploads`.

The page templates, navigation, styles, analytics, and other code are not exposed in the CMS.

## Publishing

Saving in Pages CMS commits directly to `main`. Cloudflare Pages detects the commit, builds the Astro site, and publishes it using the same pipeline as a normal GitHub edit.

Normal GitHub edits still work exactly as before. Avoid editing the same content file in GitHub and Pages CMS at the same time; finish one save before starting the other.
