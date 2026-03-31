const fs = require('fs');
const files = ['styles/global.scss', 'styles/dashboard.scss'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // For backgrounds use the gradient
    content = content.replace(/background(-color)?:\s*#e67529/gi, 'background: linear-gradient(-45deg, #2392F8 0%, #5E1CD5 100%)');
    content = content.replace(/background:\s*primary/gi, 'background: linear-gradient(-45deg, #2392F8 0%, #5E1CD5 100%)');

    // For text colors use the new brand main color
    content = content.replace(/color:\s*#e67529/gi, 'color: #5572fc');

    // For borders use the new brand second color or main color
    content = content.replace(/border(-color)?:\s*(.*?)#e67529/gi, 'border$1: $2#5e1cd5');

    // Catch-all remaining #e67529 to main brand color
    content = content.replace(/#e67529/gi, '#5572fc');

    fs.writeFileSync(file, content);
    console.log(file + ' updated');
  }
});
