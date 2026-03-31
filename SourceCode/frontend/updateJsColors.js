const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('components').concat(walk('app'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Fix gradients
    content = content.replace(/from-\[#E67529\]/gi, 'from-[#2392F8] to-[#5E1CD5]');
    // Fix hardcoded hexes
    content = content.replace(/#E67529/gi, '#5572fc');
    // Fix tailwind classes that might be cached
    content = content.replace(/text-primary/g, 'text-[#5572fc]');
    content = content.replace(/bg-primary/g, 'bg-[#5572fc]');
    content = content.replace(/border-primary/g, 'border-[#5e1cd5]');
    
    if(content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated JS file: ' + file);
    }
});
