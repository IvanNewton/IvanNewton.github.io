// Renders the project deck (projects.json) and the art gallery (art.json)
// into the containers in index.html. Edit the JSON files to update your
// content — you shouldn't need to touch this file.

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function renderProjects(projects) {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  grid.innerHTML = projects.map(p => {
    const tags = (p.tags || []).map(t => `<span class="pip">${escapeHTML(t)}</span>`).join("");
    return `
      <article class="project-card" style="--rarity-color: ${rarityColor}">
        <span class="rarity-tag">${escapeHTML(p.rarity || "common")}</span>
        <h3>${escapeHTML(p.title)}</h3>
        <div class="project-meta">${escapeHTML(p.year || "")}</div>
        <p class="desc">${escapeHTML(p.description || "")}</p>
        <div class="tag-row">${tags}</div>
        ${p.link ? `<a class="card-link" href="${escapeAttr(p.link)}" target="_blank" rel="noopener">${escapeHTML(p.linkLabel || "View project")} →</a>` : ""}
      </article>
    `;
  }).join("");
}

function renderGallery(items) {
  const grid = document.getElementById("art-grid");
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <figure class="gallery-item" tabindex="0">
      <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.alt || item.title || "")}" loading="lazy">
      <figcaption class="gallery-caption">
        <span class="title">${escapeHTML(item.title || "")}</span>
        <span class="medium">${escapeHTML(item.medium || "")}</span>
      </figcaption>
    </figure>
  `).join("");
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}

async function init() {
  const projectGrid = document.getElementById("project-grid");
  const artGrid = document.getElementById("art-grid");

  try {
    const projects = await loadJSON("projects.json");
    renderProjects(projects);
  } catch (err) {
    if (projectGrid) projectGrid.innerHTML = `<p class="state-msg">Couldn't load projects.json — check the console.</p>`;
    console.error(err);
  }

  try {
    const art = await loadJSON("art.json");
    renderGallery(art);
  } catch (err) {
    if (artGrid) artGrid.innerHTML = `<p class="state-msg">Couldn't load art.json — check the console.</p>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);
