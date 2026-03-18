const fs = require('fs');
const path = require('path');

const curriculumDir = path.join(process.cwd(), 'curriculum');
const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(curriculumDir, file), 'utf8');

    // Remove the download button HTML
    const buttonRegex = /<a href="\.\.\/pdfs\/syllabuses\/syllabus-[\s\S]+?class="download-btn"[\s\S]+?<\/a>/;
    content = content.replace(buttonRegex, '');

    // Also remove the download-btn CSS if desired (optional but cleaner)
    // Actually, leaving CSS is harmless, but let's be thorough if it was in the template
    const cssRegex = /\.download-btn\s*{[\s\S]+?}/g;
    content = content.replace(cssRegex, '');

    fs.writeFileSync(path.join(curriculumDir, file), content);
    console.log(`Removed download button from ${file}`);
});
