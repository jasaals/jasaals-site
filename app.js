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
    const [posts, gallery, vision, dreams] = await Promise.all([
      fetchJson('./posts/index.json'),
      fetchJson('./gallery.json'),
      fetchJson('./vision.json'),
      fetchJson('./dreams.json'),
    ]);

    // Show only the 3 most recent posts (last 3 in array, reversed for newest first)
    const latestPosts = [...posts].slice(-3).reverse();
    
    storyEl.innerHTML = latestPosts
      .map((item) => `
        <article class="timeline-item has-post">
          <h3><a href="./post.html?slug=${item.slug}">${item.date} — ${item.title}</a></h3>
          <p>${item.excerpt}</p>
          <a href="./post.html?slug=${item.slug}" class="read-more">Read more →</a>
        </article>
      `)
      .join('');
    
    // Add "View all stories" link if there are more than 3
    if (posts.length > 3) {
      storyEl.innerHTML += `
        <p class="view-all"><a href="./stories.html">View all stories →</a></p>
      `;
    }

    galleryEl.innerHTML = gallery.map(tile).join('');
    visionEl.innerHTML = vision.map(tile).join('');
    dreamsEl.innerHTML = dreams.map((d) => `<li>${d}</li>`).join('');
  } catch (err) {
    console.error(err);
    storyEl.innerHTML = `<p>Could not load content files yet. Add/update JSON files in <code>posts/</code>.</p>`;
  }
})();
