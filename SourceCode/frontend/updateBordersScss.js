const fs = require('fs');
const files = ['styles/global.scss', 'styles/dashboard.scss'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // For borders use the main brand color instead of purple
    content = content.replace(/border(-color)?:\s*(.*?)#5e1cd5/gi, 'border$1: $2#5572fc');

    if(content !== original) {
        fs.writeFileSync(file, content);
        console.log(file + ' updated');
    }
  }
});
