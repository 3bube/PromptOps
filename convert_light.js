const fs = require('fs');

const mappings = {
  '"#08080e"': '"#fafafa"',
  '"#0f0f1a"': '"#ffffff"',
  '"#15152a"': '"#f4f4f5"',
  '"#1e1e35"': '"#e4e4e7"',
  '"#2a2a45"': '"#d4d4d8"',
  '"#eeeef5"': '"#09090b"',
  '"#6b6b85"': '"#71717a"',
  '"#9090a8"': '"#52525b"',
  '"#22d4c8"': '"#0d9488"',
  '"#0d0d1c"': '"#ffffff"',
  '"#0a0a14"': '"#f4f4f5"',
  '"#3a3a55"': '"#a1a1aa"',
  '"#1a1a2e"': '"#e4e4e7"',
  '"#2a2a42"': '"#a1a1aa"',
  '"#4a4a62"': '"#71717a"',
  '"#141428"': '"#e4e4e7"',
  '"#343450"': '"#71717a"',
  '"#111120"': '"#ffffff"',
  '"#252540"': '"#e4e4e7"',
  '"#a0a0b8"': '"#52525b"',
  '"#0a0a16"': '"#fafafa"',
  '"#7070a0"': '"#52525b"',
  '"#5a5a72"': '"#71717a"',
  '"#05050b"': '"#fafafa"',
  '"#2e2e48"': '"#d4d4d8"',
  '"#363652"': '"#71717a"',
  '"#8080a0"': '"#71717a"',
  '"#05050c"': '"#ffffff"',
  '"#3a3a60"': '"#a1a1aa"',
  '"#12102a"': '"#f4f4f5"',
  '"#1a1a28"': '"#e4e4e7"',
  '"#3a3a52"': '"#a1a1aa"',
  
  'rgba(8,8,14,0.88)': 'rgba(250,250,250,0.88)',
  'rgba(30,30,53,0.7)': 'rgba(228,228,231,0.7)',
  'rgba(0,0,0,0.7)': 'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.4)': 'rgba(0,0,0,0.05)',
  'rgba(0,0,0,0.65)': 'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.8)': 'rgba(0,0,0,0.15)',
  'rgba(255,255,255,0.018)': 'rgba(0,0,0,0.03)',
  
  "'#05050b'": "'#fafafa'",
  "'#08080e'": "'#fafafa'",
  "'#0f0f1a'": "'#ffffff'",
  "'#15152a'": "'#f4f4f5'",
  "'#1e1e35'": "'#e4e4e7'",
  "'#2a2a45'": "'#d4d4d8'",
  "'#eeeef5'": "'#09090b'",
  "'#6b6b85'": "'#71717a'",
  "'#9090a8'": "'#52525b'",
  "'#22d4c8'": "'#0d9488'",
  "'#0d0d1c'": "'#ffffff'",
  "'#0a0a14'": "'#f4f4f5'",
  "'#3a3a55'": "'#a1a1aa'",
  "'#1a1a2e'": "'#e4e4e7'",
  "'#2a2a42'": "'#a1a1aa'",
  "'#4a4a62'": "'#71717a'",
  "'#141428'": "'#e4e4e7'",
  "'#343450'": "'#71717a'",
  "'#111120'": "'#ffffff'",
  "'#252540'": "'#e4e4e7'",
  "'#a0a0b8'": "'#52525b'",
  "'#0a0a16'": "'#fafafa'",
  "'#7070a0'": "'#52525b'",
  "'#5a5a72'": "'#71717a'",
  "'#05050c'": "'#ffffff'",
  "'#2e2e48'": "'#d4d4d8'",
  "'#363652'": "'#71717a'",
  "'#8080a0'": "'#71717a'",
  "'#3a3a60'": "'#a1a1aa'",
  "'#12102a'": "'#f4f4f5'",
  "'#1a1a28'": "'#e4e4e7'",
  "'#3a3a52'": "'#a1a1aa'",
};

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [key, value] of Object.entries(mappings)) {
    content = content.split(key).join(value);
  }
  fs.writeFileSync(path, content);
}

processFile('/Users/mac/Desktop/promptops/components/v2/HeroSection.tsx');
processFile('/Users/mac/Desktop/promptops/components/v2/sections.tsx');
processFile('/Users/mac/Desktop/promptops/app/v2/landing-page/page.tsx');
