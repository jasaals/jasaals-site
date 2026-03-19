# JASAALS v2 (Private Story Site + Blog)

A lightweight static site for Jeffrey + Anna Leah:
- **Blog/Stories** with Markdown support
- Story timeline (latest 3 on homepage)
- Favorite photo gallery
- Homestead vision board
- Dream list

## Local preview

From this folder:

```bash
python3 -m http.server 4173
```

Open: http://localhost:4173

---

## Blog System

### Structure

```
/posts/
  index.json          ← Post metadata (title, date, slug, excerpt)
  jasaals-was-born.md ← Full post content
  proposal-day.md
  elopement-chapter.md
stories.html          ← Lists all posts
post.html             ← Single post viewer (renders Markdown)
```

### Adding a new post

1. **Add entry to `posts/index.json`:**
   ```json
   {
     "slug": "your-post-slug",
     "date": "March 2024",
     "title": "Your Post Title",
     "excerpt": "A brief summary shown on the homepage and stories page.",
     "cover": "./images/posts/your-cover.jpg"
   }
   ```

2. **Create `posts/your-post-slug.md`:**
   ```markdown
   # Your Post Title

   Write your content here with full Markdown support.

   ## Add photos
   ![Description](./images/posts/photo.jpg "Optional caption")

   ## Embed YouTube
   ![video](youtube:VIDEO_ID)

   ## Embed Vimeo
   ![video](vimeo:VIDEO_ID)

   ## Embed Google Map
   ![map](map:EMBED_CODE)
   ```

3. Add images to `images/posts/` folder

### Markdown features

- **Headings**: `#`, `##`, `###`
- **Bold/italic**: `**bold**`, `*italic*`
- **Links**: `[text](url)`
- **Images**: `![alt](path "caption")`
- **Blockquotes**: `> quote`
- **Lists**: `- item` or `1. item`
- **Horizontal rule**: `---`
- **YouTube**: `![video](youtube:VIDEO_ID)`
- **Vimeo**: `![video](vimeo:VIDEO_ID)`
- **Maps**: `![map](map:GOOGLE_EMBED_CODE)`

---

## Other content

- **Gallery**: Update `gallery.json`, add images to `images/gallery/`
- **Vision board**: Update `vision.json`, add images to `images/vision/`
- **Dreams**: Update `dreams.json`

---

## Deploy (private)

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

---

## Future split (public pages later)

When ready, keep private core at `jasaals.com` and publish selected content on:
- `jasaals.com/wedding`
- `jasaals.com/blog`

with separate Access policies.
