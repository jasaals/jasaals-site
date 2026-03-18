const storyEl = document.getElementById('story-list');
const galleryEl = document.getElementById('gallery-grid');
const visionEl = document.getElementById('vision-grid');
const dreamsEl = document.getElementById('dream-list');

const fetchJson = async (path) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
};

const tile = ({ image, title, note }) => `
  <article class="tile">
    <img src="${image}" alt="${title}" loading="lazy" />
    <div class="meta">
      <h4>${title}</h4>
      <p>${note || ''}</p>
    </div>
  </article>
`;

(async () => {
  try {
    const [story, gallery, vision, dreams] = await Promise.all([
      fetchJson('./story.json'),
      fetchJson('./gallery.json'),
      fetchJson('./vision.json'),
      fetchJson('./dreams.json'),
    ]);

    storyEl.innerHTML = story
      .map((item) => `
        <article class="timeline-item">
          <h3>${item.date} — ${item.title}</h3>
          <p>${item.note}</p>
        </article>
      `)
      .join('');

    galleryEl.innerHTML = gallery.map(tile).join('');
    visionEl.innerHTML = vision.map(tile).join('');
    dreamsEl.innerHTML = dreams.map((d) => `<li>${d}</li>`).join('');
  } catch (err) {
    console.error(err);
    storyEl.innerHTML = `<p>Could not load content files yet. Add/update JSON files in <code>content/</code>.</p>`;
  }
})();
