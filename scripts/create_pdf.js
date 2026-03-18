const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Branding Colors
const primaryRed = '#8B0000';
const darkGrey = '#333333';
const softGrey = '#666666';

// Use A4 size but with large fonts for mobile readability
const PAGE_SIZE = 'A4';
const MARGIN = 40;

async function generatePdf(title, contentBlocks, outputPath, isSyllabus = false) {
    const doc = new PDFDocument({
        margin: MARGIN,
        size: PAGE_SIZE
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // 1. Header Section
    try {
        const logoPath = path.join(process.cwd(), 'assets', 'images', 'school_logo_header.jpeg');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, {
                fit: [70, 70],
                align: 'center',
                valign: 'top',
                x: (doc.page.width - 70) / 2
            });
            doc.moveDown(3.5);
        }
    } catch (e) {
        console.error('Logo error:', e.message);
    }

    doc.fillColor(primaryRed)
        .fontSize(24)
        .text('ASTON HOSTEL', { align: 'center', lineGap: 2 });

    doc.fillColor(darkGrey)
        .fontSize(18)
        .text('&', { align: 'center', lineGap: 2 });

    doc.fontSize(20)
        .text('NACHIKETAS HIGH SCHOOL', { align: 'center', lineGap: 1 });

    doc.fontSize(18)
        .text('AND JR. COLLEGE', { align: 'center', lineGap: 8 });

    doc.strokeColor('#dddddd').lineWidth(1).moveTo(MARGIN, doc.y).lineTo(doc.page.width - MARGIN, doc.y).stroke();
    doc.moveDown(0.4);

    doc.fillColor(softGrey)
        .fontSize(10)
        .text('Godawali Road, Panchgani, Tal. - Mahabaleshwar, Dist.- Satara - 412805', { align: 'center' });

    doc.moveDown(0.4);
    doc.strokeColor('#dddddd').lineWidth(1).moveTo(MARGIN, doc.y).lineTo(doc.page.width - MARGIN, doc.y).stroke();
    doc.moveDown(1.2);

    // 2. Main Title
    doc.fillColor(primaryRed)
        .fontSize(20)
        .text(title.toUpperCase(), { align: 'center', underline: true });

    doc.moveDown(1.2);

    // 3. Content Section
    contentBlocks.forEach(block => {
        if (block.type === 'heading') {
            doc.fillColor(primaryRed)
                .fontSize(18)
                .text(block.text, { underline: false });
            doc.moveDown(0.4);
        } else if (block.type === 'bullet') {
            doc.fillColor('black')
                .fontSize(14)
                .text('• ' + block.text, {
                    indent: 10,
                    lineGap: 4
                });
            doc.moveDown(0.3);
        } else if (block.type === 'paragraph') {
            doc.fillColor('black')
                .fontSize(14)
                .text(block.text, {
                    lineGap: 4,
                    align: 'justify'
                });
            doc.moveDown(0.6);
        }
    });

    doc.moveDown(1.5);

    // 4. Footer Section
    doc.fillColor(primaryRed)
        .fontSize(14)
        .text('Contact Admissions', { align: 'center' });

    doc.fillColor(darkGrey)
        .fontSize(11)
        .text('+91 9773737737 / +91 8766785675', { align: 'center', lineGap: 2 })
        .text('astonhostelpanchgani@gmail.com', { align: 'center' });

    doc.end();

    return new Promise((resolve) => {
        stream.on('finish', resolve);
    });
}

async function run() {
    const pdfDir = path.join(process.cwd(), 'pdfs');
    const syllabusDir = path.join(pdfDir, 'syllabuses');

    if (!fs.existsSync(syllabusDir)) {
        fs.mkdirSync(syllabusDir, { recursive: true });
    }

    // 1. Generate Main Admission Procedure PDF
    console.log('Generating Admission Procedure PDF...');
    const procedureContent = [
        { type: 'heading', text: 'Step 1: Enquiry' },
        { type: 'paragraph', text: 'Submit our digital enquiry form. Our admissions team provides a personalized prospectus and curriculum overview.' },
        { type: 'heading', text: 'Step 2: Campus Visit' },
        { type: 'paragraph', text: 'Schedule a private tour or attend an Open Day. Meet our faculty and explore our state-of-the-art facilities.' },
        { type: 'heading', text: 'Step 3: Assessment' },
        { type: 'paragraph', text: 'Prospective students participate in age-appropriate entrance assessments and an informal interview.' },
        { type: 'heading', text: 'Step 4: Enrollment' },
        { type: 'paragraph', text: 'Successful applicants receive an offer of admission. Secure your place by completing registration and payment of fees.' },
        { type: 'heading', text: 'Important Guidelines' },
        { type: 'bullet', text: 'Registration forms must be submitted in person.' },
        { type: 'bullet', text: 'Parents must attend the student interview.' },
        { type: 'bullet', text: 'English is the only language of communication on campus.' },
        { type: 'bullet', text: '50% fees must be paid at the time of admission.' },
        { type: 'bullet', text: 'Possession of mobile phones is strictly prohibited (Fine ₹10,000).' }
    ];
    await generatePdf('Admission Procedure', procedureContent, path.join(pdfDir, 'admission-procedure.pdf'));

    // 2. Generate Syllabus PDFs for each grade
    console.log('Scanning curriculum files...');
    const curriculumDir = path.join(process.cwd(), 'curriculum');
    const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.html'));

    for (const file of files) {
        const gradeName = file.replace('.html', '').replace('grade', 'Class ');
        const htmlContent = fs.readFileSync(path.join(curriculumDir, file), 'utf8');

        // Extract Syllabus Content
        let syllabusBlocks = [];

        const subjectMatches = [...htmlContent.matchAll(/<span class="subject-head">([^<]+)<\/span>([^<]+)/g)];

        if (subjectMatches.length > 0) {
            subjectMatches.forEach(match => {
                const subject = match[1].trim();
                const items = match[2].trim().split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(l => l);

                syllabusBlocks.push({ type: 'heading', text: subject });
                items.forEach(item => {
                    syllabusBlocks.push({ type: 'bullet', text: item });
                });
            });
        } else {
            const contentText = htmlContent.match(/<div class="content">([^<]+)<\/div>/);
            if (contentText) {
                syllabusBlocks.push({ type: 'paragraph', text: contentText[1].trim() });
            }
        }

        const title = `Syllabus for ${gradeName} Entrance Test`;
        const outputFilename = `syllabus-${file.replace('.html', '')}.pdf`;
        console.log(`Generating PDF for ${gradeName}...`);
        await generatePdf(title, syllabusBlocks, path.join(syllabusDir, outputFilename), true);
    }

    console.log('All PDFs generated successfully in /pdfs/');
}

run().catch(console.error);
