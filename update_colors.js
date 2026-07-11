const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // colors
    content = content.replace(/bg-blue-600/g, 'bg-edil-blue');
    content = content.replace(/text-blue-600/g, 'text-edil-blue');
    content = content.replace(/border-blue-600/g, 'border-edil-blue');
    content = content.replace(/bg-blue-500/g, 'bg-edil-blue-hover');
    content = content.replace(/text-blue-500/g, 'text-edil-blue-hover');
    content = content.replace(/border-blue-500/g, 'border-edil-blue-hover');
    content = content.replace(/bg-blue-50/g, 'bg-edil-light');
    content = content.replace(/bg-slate-900/g, 'bg-navy-deep');
    content = content.replace(/text-slate-900/g, 'text-navy-deep');
    content = content.replace(/border-slate-900/g, 'border-navy-deep');
    content = content.replace(/bg-slate-950/g, 'bg-navy-deep');
    content = content.replace(/text-slate-950/g, 'text-navy-deep');
    content = content.replace(/bg-slate-50/g, 'bg-warm-gray');
    
    // fonts
    content = content.replace(/font-sans/g, 'font-manrope');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory('./src/app/(public)');
processDirectory('./src/components');
