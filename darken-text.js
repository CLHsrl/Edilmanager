const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

walk('./src', (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // We need to do this carefully so we don't double replace
        content = content.replace(/text-slate-500/g, 'TEXT_SLATE_600_TEMP');
        content = content.replace(/text-slate-400/g, 'TEXT_SLATE_500_TEMP');
        
        content = content.replace(/TEXT_SLATE_600_TEMP/g, 'text-slate-600');
        content = content.replace(/TEXT_SLATE_500_TEMP/g, 'text-slate-500');
        
        // Also let's do text-gray if it exists
        content = content.replace(/text-gray-500/g, 'TEXT_GRAY_600_TEMP');
        content = content.replace(/text-gray-400/g, 'TEXT_GRAY_500_TEMP');
        
        content = content.replace(/TEXT_GRAY_600_TEMP/g, 'text-gray-600');
        content = content.replace(/TEXT_GRAY_500_TEMP/g, 'text-gray-500');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
