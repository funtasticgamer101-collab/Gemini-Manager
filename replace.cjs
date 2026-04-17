const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update tight border radii to look friendlier
content = content.replace(/rounded-\[2px\]/g, 'rounded-xl');
content = content.replace(/rounded-\[4px\]/g, 'rounded-xl');
// Clean up the hover buttons to match the sleek black (since it was gold before)
content = content.replace(/hover:bg-\[#bba783\]/g, 'hover:bg-gray-800');
// Some buttons might still have hover:bg-gold related classes... 
content = content.replace(/text-accent-gold/g, 'text-black');
content = content.replace(/bg-accent-gold/g, 'bg-black');
content = content.replace(/border-accent-gold/g, 'border-black');

fs.writeFileSync('src/App.tsx', content);

// Now ensure index.css provides the right variables if needed, though App.tsx replacement ensures direct Tailwind utility mapping where appropriate
