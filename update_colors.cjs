const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-card-bg');
content = content.replace(/bg-gray-100/g, 'bg-bg-deep');
content = content.replace(/border-gray-200/g, 'border-border-color');
content = content.replace(/text-black/g, 'text-accent-green');
content = content.replace(/bg-black/g, 'bg-accent-green');
content = content.replace(/border-black/g, 'border-accent-green');
content = content.replace(/hover:bg-gray-800/g, 'hover:bg-emerald-700');

fs.writeFileSync('src/App.tsx', content);
