# JASAALS v1 (Private Story Site)

A lightweight static site for Jeffrey + Anna Leah:
- Story timeline
- Favorite photo gallery
- Homestead vision board
- Dream list

## Local preview

From this folder:

```bash
python3 -m http.server 4173
```

Open: http://localhost:4173

## Update content quickly

- Story: `content/story.json`
- Gallery cards: `content/gallery.json`
- Vision board cards: `content/vision.json`
- Dream list: `content/dreams.json`
- Add real images to:
  - `images/gallery/`
  - `images/vision/`

Then replace `image` paths in the JSON files.

## Deploy (private #3)

### Option A (recommended): Cloudflare Pages + Cloudflare Access

1. Push this folder to a GitHub repo (or use direct upload).
2. Create Cloudflare Pages project (no build command needed):
   - Build command: *(empty)*
   - Output directory: `/`
3. Connect custom domain: `jasaals.com`.
4. In Cloudflare Zero Trust, create an **Access Application** for `jasaals.com`:
   - Policy: Allow only specific emails (you two)
   - Optional: require OTP + device posture if desired
5. Turn off indexing:
   - Add `X-Robots-Tag: noindex, nofollow` in Cloudflare response headers.

### Option B: Netlify/Vercel + password layer

- Deploy static site, then protect with site password/basic-auth middleware.

## Future split (public pages later)

When ready, keep private core at `jasaals.com` and publish selected content on:
- `jasaals.com/wedding`
- `jasaals.com/blog`

with separate Access policies.
