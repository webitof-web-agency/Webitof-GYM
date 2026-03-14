const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
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
    
    // Fix tailwind classes that might be cached
    content = content.replace(/border-\[#5e1cd5\]/g, 'border-[#5572fc]');
    
    if(content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated JS file: ' + file);
    }
});
