import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://sritechengg.in';

const pages = [
  { url: '/', priority: '1.0' },
  { url: '/shop', priority: '0.9' },
  { url: '/auth', priority: '0.5' },
];

// In a real app, you'd fetch product IDs from API/DB here
// For now, we'll just have the static ones.

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('')}
</urlset>`;

try {
  writeFileSync(join(__dirname, 'dist', 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml generated in dist/');
} catch (err) {
  console.error('❌ Sitemap generation failed:', err.message);
}
