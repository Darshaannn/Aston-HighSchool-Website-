const fs = require('fs');
const path = require('path');

const curriculumDir = path.join(process.cwd(), 'curriculum');
const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.html'));

const cleanTemplate = (title, headerLines, address, description, syllabusTitle, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --primary: #8B0000; --text: #333; --bg: #f7f9fc; }
        body { background-color: var(--bg); margin: 0; padding: 2rem 1rem; font-family: "Times New Roman", Times, serif; color: var(--text); }
        .document { 
            background: white; 
            width: 95%; 
            max-width: 1000px; 
            margin: 0 auto; 
            padding: 3rem; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            border-radius: 8px; 
            box-sizing: border-box; 
        }
        .header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #eee; padding-bottom: 1.5rem; position: relative; }
        .header-logo { width: 80px; height: auto; margin-bottom: 1rem; }
        .line1 { font-size: 28pt; font-weight: bold; margin: 0; color: black; }
        .line2 { font-size: 24pt; font-weight: bold; margin: 5px 0; }
        .line3 { font-size: 20pt; font-weight: bold; margin: 0; }
        .address { font-size: 11pt; margin: 10px 0; color: #555; }
        .description { font-size: 10pt; font-style: italic; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .syllabus-title { font-size: 18pt; font-weight: bold; text-align: center; margin: 2rem 0; text-decoration: underline; color: var(--primary); }
        .content { font-size: 14pt; line-height: 1.6; white-space: pre-wrap; margin-bottom: 2rem; }
        .subject-head { font-size: 16pt; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; display: block; text-decoration: underline; color: black; }
        .download-btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 10px;
            background: var(--primary); color: white; text-decoration: none; padding: 12px 24px;
            border-radius: 6px; font-weight: bold; font-family: sans-serif; transition: all 0.3s;
            margin-bottom: 2rem;
        }
        .download-btn:hover { background: #a00000; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(139,0,0,0.3); }
        @media (max-width: 768px) {
            .document { padding: 1.5rem; width: 100%; border-radius: 0; }
            .line1 { font-size: 20pt; }
            .line2 { font-size: 18pt; }
            .line3 { font-size: 16pt; }
            .content { font-size: 12pt; }
            .subject-head { font-size: 14pt; }
        }
        @media print { body { background: white; padding: 0; } .document { box-shadow: none; border: none; width: 100%; max-width: none; } .download-btn { display: none; } }
    </style>
</head>
<body>
    <div class="document">
        <a href="../pdfs/syllabuses/syllabus-${path.basename(title, '.pdf').toLowerCase().replace(/\s+/g, '-')}.pdf" class="download-btn" download>
            <i class="fa-solid fa-file-pdf"></i> Download Official PDF (Mobile Friendly)
        </a>
        <div class="header">
            <img src="../assets/images/school_logo_header.jpeg" class="header-logo" alt="Logo">
            <div class="line1">${headerLines[0]}</div>
            <div class="line2">${headerLines[1]}</div>
            <div class="line3">${headerLines[2]}</div>
            <div class="line3">${headerLines[3] || ''}</div>
            <div class="address">${address}</div>
            <div class="description">${description}</div>
        </div>
        <div class="syllabus-title">${syllabusTitle}</div>
        <div class="content">${content}</div>
    </div>
</body>
</html>
`;

files.forEach(file => {
    const html = fs.readFileSync(path.join(curriculumDir, file), 'utf8');

    // Extract data using regex
    const contentMatch = html.match(/<div class="content">([\s\S]+?)<\/div>/);
    const sTitleMatch = html.match(/<div class="syllabus-title">([\s\S]+?)<\/div>/);
    const descMatch = html.match(/<div class="description">([\s\S]+?)<\/div>/);
    const addrMatch = html.match(/<div class="address">([\s\S]+?)<\/div>/);

    const content = contentMatch ? contentMatch[1].trim() : "Content not found.";
    const syllabusTitle = sTitleMatch ? sTitleMatch[1].trim() : "SYLLABUS";
    const description = descMatch ? descMatch[1].trim() : "";
    const address = addrMatch ? addrMatch[1].trim() : "";

    const headerLines = ["ASTON HOSTEL", "&", "NACHIKETAS HIGH SCHOOL", "AND JR. COLLEGE"];
    const title = file.replace('.html', '');

    const newHtml = cleanTemplate(title, headerLines, address, description, syllabusTitle, content);
    fs.writeFileSync(path.join(curriculumDir, file), newHtml);
    console.log(`Regenerated ${file} with clean template`);
});
