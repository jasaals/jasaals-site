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

function initCarousel(trackEl, prevBtn, nextBtn, dotsEl, photos) {
  const VISIBLE = 4;
  const totalPhotos = photos.length;
  const maxIndex = Math.max(0, totalPhotos - VISIBLE);
  let currentIndex = 0;

  const numDots = Math.ceil(totalPhotos / VISIBLE);
  dotsEl.innerHTML = Array.from({ length: numDots }, (_, i) =>
    `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-dot="${i}"></div>`
  ).join('');

  const dots = dotsEl.querySelectorAll('.carousel-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.dot) * VISIBLE));
  });

  function updateDots() {
    const currentPage = Math.round(currentIndex / VISIBLE);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentPage));
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const wrapperWidth = trackEl.parentElement.offsetWidth;
    const tileWidth = (wrapperWidth - (VISIBLE - 1) * 10) / VISIBLE;
    const offset = currentIndex * (tileWidth + 10);
    trackEl.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - VISIBLE));
  nextBtn.addEventListener('click', () => goTo(currentIndex + VISIBLE));
  goTo(0);
}

function buildGalleryCarousel(allPhotos) {
  // Show the 36 most recent photos (newest first) across 3 rows of 12
  const recent = [...allPhotos].reverse().slice(0, 36);
  const row1Photos = recent.slice(0, 12);
  const row2Photos = recent.slice(12, 24);
  const row3Photos = recent.slice(24, 36);

  const makeTile = (photo) => `<article class="tile">
    <img src="${photo.image}" alt="${photo.title}" loading="lazy" />
    <div class="meta"><h4>${photo.title}</h4></div>
  </article>`;

  const makeRow = (rowPhotos, id) => rowPhotos.length === 0 ? '' : `
    <div class="gallery-carousel-row">
      <button class="carousel-arrow" id="${id}-prev" aria-label="Previous">&#8592;</button>
      <div class="carousel-track-wrapper">
        <div class="carousel-track" id="${id}-track">
          ${rowPhotos.map(makeTile).join('')}
        </div>
      </div>
      <button class="carousel-arrow" id="${id}-next" aria-label="Next">&#8594;</button>
    </div>
    <div class="carousel-dots" id="${id}-dots"></div>
  `;

  galleryEl.innerHTML = `
    <div class="gallery-carousel-wrapper">
      ${makeRow(row1Photos, 'row1')}
      ${makeRow(row2Photos, 'row2')}
      ${makeRow(row3Photos, 'row3')}
    </div>
  `;

  if (row1Photos.length > 0) initCarousel(document.getElementById('row1-track'), document.getElementById('row1-prev'), document.getElementById('row1-next'), document.getElementById('row1-dots'), row1Photos);
  if (row2Photos.length > 0) initCarousel(document.getElementById('row2-track'), document.getElementById('row2-prev'), document.getElementById('row2-next'), document.getElementById('row2-dots'), row2Photos);
  if (row3Photos.length > 0) initCarousel(document.getElementById('row3-track'), document.getElementById('row3-prev'), document.getElementById('row3-next'), document.getElementById('row3-dots'), row3Photos);
}

(async () => {
  try {
    const [posts, gallery, vision, dreams] = await Promise.all([
      fetchJson('./posts/index.json'),
      fetchJson('./gallery.json'),
      fetchJson('./vision.json'),
      fetchJson('./dreams.json'),
    ]);

    const latestPosts = [...posts].slice(-3).reverse();
    storyEl.innerHTML = latestPosts.map((item) => `
      <article class="timeline-item has-post">
        <h3><a href="./post.html?slug=${item.slug}">${item.date} — ${item.title}</a></h3>
        <p>${item.excerpt}</p>
        <a href="./post.html?slug=${item.slug}" class="read-more">Read more →</a>
      </article>
    `).join('');

    if (posts.length > 3) {
      storyEl.innerHTML += `<p class="view-all"><a href="./stories.html">View all stories →</a></p>`;
    }

    buildGalleryCarousel(gallery);
    visionEl.innerHTML = vision.map(tile).join('');
    dreamsEl.innerHTML = dreams.map((d) => `<li>${d}</li>`).join('');
  } catch (err) {
    console.error(err);
    storyEl.innerHTML = `<p>Could not load content files yet. Add/update JSON files in <code>posts/</code>.</p>`;
  }
})();