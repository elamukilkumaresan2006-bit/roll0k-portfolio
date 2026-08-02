# ROLL0K — Elamukil Kumaresan Portfolio

A cinematic personal portfolio built with React, Vite, Tailwind CSS v4, Framer Motion, and GSAP-ready structure.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy it anywhere static (Vercel, Netlify, GitHub Pages).

## Swap in your own media

- **Projects** — edit `src/data/projects.js`. Paste your Cloudinary `thumbnailURL` and `videoURL` into each project object and the site wires them in automatically (grid thumbnails + fullscreen modal player).
- **Showreel background** — open `src/sections/Hero.jsx` and set `SHOWREEL_URL` to your Cloudinary video link.
- **Portrait** — replace the placeholder block in `src/sections/About.jsx` with an `<img>`.
- **Resume** — drop a `resume.pdf` file into the `public/` folder (the Download Resume buttons already link to `/resume.pdf`).

## Structure

```
src/
  components/   shared UI: cursor, nav, footer, buttons, project modal, intro
  sections/     page sections: hero, about, skills, journey, projects, contact
  data/         projects.js — Cloudinary-ready project data
  index.css     design tokens (colors, type, cursor, glass, gradients)
```
