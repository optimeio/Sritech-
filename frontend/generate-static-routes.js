import fs from 'fs';
import path from 'path';

// List of all your frontend routes
const routes = ['admin', 'shop', 'auth', 'contact', 'products', 'projects'];

const distPath = path.resolve('dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Generating fallback directories for static hosting...');

if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    routes.forEach(route => {
        const routePath = path.join(distPath, route);
        if (!fs.existsSync(routePath)) {
            fs.mkdirSync(routePath, { recursive: true });
        }
        fs.writeFileSync(path.join(routePath, 'index.html'), indexContent);
        console.log(`✅ Created fallback for /${route} -> ${route}/index.html`);
    });
    console.log('Static route generation complete!');
} else {
    console.error('Error: dist/index.html not found! Run npm run build first.');
}
