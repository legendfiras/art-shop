# lets shop art

Marketplace for graphic designers to list apparel, prints, stickers, and other work.

## Scripts

```bash
npm install
npm run dev
npm run build
```

The production build is a static site in `dist`. Client-side routes fall back to `index.html`.

## Deploy

Pushing `main` to GitHub runs `.github/workflows/deploy.yml` and publishes GitHub Pages at `https://legendfiras.github.io/art-shop/`. In the repo settings, set Pages source to **GitHub Actions**.

For Cloudflare Pages, Netlify, or Vercel, use the repo root, build command `npm run build`, and output directory `dist`. Leave `BASE_PATH` unset so the site is served from `/`.
