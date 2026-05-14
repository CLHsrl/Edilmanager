const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const original = fs.readFileSync(filePath, 'utf8');
    const updated = original.replace(/@\/app\/\(app\)\/\(app\)/g, '@/app/(app)');
    if (original !== updated) {
      fs.writeFileSync(filePath, updated);
      console.log('Fixed', filePath);
    }
  }
});
