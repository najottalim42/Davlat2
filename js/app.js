// ===== MA'LUMOTLARNI IMPORT QILISH =====
import {countries }from '../js/dats.js';

// ===== ELEMENTLAR =====
const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('dropdown');
const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownLabel = document.getElementById('dropdownLabel');
const themeBtn = document.getElementById('themeBtn');
const themeText = document.getElementById('themeText');

// ===== HOLAT =====
let selectedRegion = '';
let searchQuery = '';

// ===== YORDAMCHI FUNKSIYALAR =====
const formatNumber = (n) => Number(n || 0).toLocaleString('en-US');

// HTML ichiga xavfsiz qo'yish uchun
const esc = (str) =>
  String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

// ===== DARK MODE =====
function updateThemeText() {
  const isDark = document.documentElement.classList.contains('dark');
  themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (e) {}
  updateThemeText();
});

updateThemeText();

// ===== KARTOCHKA =====
function countryCard(c) {
  return `
    <div class="card">
      <img class="card__flag" src="${esc(c.flag)}" alt="Flag of ${esc(c.name)}" loading="lazy">
      <div class="card__body">
        <h2 class="card__title">${esc(c.name)}</h2>
        <p><b>Population:</b> <span>${formatNumber(c.population)}</span></p>
        <p><b>Region:</b> <span>${esc(c.region)}</span></p>
        <p><b>Capital:</b> <span>${esc(c.capital || '—')}</span></p>
      </div>
    </div>`;
}

// ===== RO'YXATNI CHIQARISH (qidiruv + filtr) =====
function renderCountries() {
  const q = searchQuery.trim().toLowerCase();

  const filtered = countries.filter((c) => {
    const matchRegion = !selectedRegion || c.region === selectedRegion;
    const matchName = !q || c.name.toLowerCase().includes(q) ||
      (c.nativeName || '').toLowerCase().includes(q);
    return matchRegion && matchName;
  });

  grid.innerHTML = filtered.map(countryCard).join('');
  statusEl.textContent = filtered.length ? '' : 'No countries found.';
}

// ===== QIDIRUV =====
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderCountries();
});

// ===== FILTR (DROPDOWN) =====
function setDropdown(open) {
  dropdown.classList.toggle('open', open);
  dropdownBtn.setAttribute('aria-expanded', String(open));
}

dropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  setDropdown(!dropdown.classList.contains('open'));
});

dropdownMenu.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-region]');
  if (!btn) return;

  selectedRegion = btn.dataset.region;
  dropdownLabel.textContent = selectedRegion ? btn.textContent : 'Filter by Region';

  dropdownMenu.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
  if (selectedRegion) btn.classList.add('active');

  setDropdown(false);
  renderCountries();
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) setDropdown(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setDropdown(false);
});

// ===== ISHGA TUSHIRISH =====
renderCountries();