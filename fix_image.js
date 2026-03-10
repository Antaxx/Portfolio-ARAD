const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace Projects
html = html.replace(/<div class="overflow-hidden mb-6 border-2 border-gray-800 rounded-2xl">\s*<img src="([^"]+)"\s*(alt="[^"]*")?\s*class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 blur-\[2px\] hover:blur-none grayscale group-hover:grayscale-0">/g,
    `<div class="relative h-80 overflow-hidden mb-6 border-2 border-gray-800 rounded-2xl">
                        <img src="$1" $2
                            class="absolute w-full h-[130%] -top-[15%] object-cover parallax-image group-hover:scale-110 transition-transform duration-700 blur-[2px] hover:blur-none grayscale group-hover:grayscale-0">`
);

// Replace Agents
html = html.replace(/<div class="h-64 overflow-hidden rounded-2xl mb-8 border-2 border-white\/5">\s*<img src="([^"]+)"\s*(alt="[^"]*")?\s*class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">/g,
    `<div class="relative h-64 overflow-hidden rounded-2xl mb-8 border-2 border-white/5">
                            <img src="$1" $2
                                class="absolute w-full h-[130%] -top-[15%] object-cover parallax-image group-hover:scale-110 transition-transform duration-1000">`
);

fs.writeFileSync('index.html', html);
console.log('Images fixed for parallax');