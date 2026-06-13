# Sundara Mahaa Raja Portfolio

Static portfolio website generated from the resume.

## Run Locally

Use any static file server from this folder:

```bash
python -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Public Hosting

This site has no build step and no backend. Host the full `portfolio` folder on any static host.

### GitHub Pages

1. Create a GitHub repository.
2. Upload all files from this folder.
3. In repository settings, enable Pages from the main branch.

### Netlify

1. Drag this folder into Netlify Drop.
2. Or connect the GitHub repository and keep the publish directory as `/`.

### Vercel

1. Import the GitHub repository into Vercel.
2. Set framework preset to `Other`.
3. Keep build command empty and output directory as `/`.

## Files

- `index.html` - Website structure and resume content.
- `styles.css` - Responsive visual design.
- `script.js` - Canvas background, theme toggle, project filters, and skill interactions.
- `assets/Resume.pdf` - Downloadable resume.
