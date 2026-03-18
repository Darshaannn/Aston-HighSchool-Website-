from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, Image
from reportlab.lib.units import inch
import os

def create_mobile_pdf():
    # File path
    output_path = r"c:\Darshan\aston-high-school-website\pdfs\admission-procedure.pdf"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Page size: Optimized for mobile viewing (Portrait, clear margins)
    # Using A4 but we will use large fonts and generous padding
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=40)
    
    styles = getSampleStyleSheet()
    
    # Custom Styles for "Mobile Optimization" (Large fonts)
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Title'],
        fontSize=26,
        leading=32,
        spaceAfter=20,
        textColor=colors.HexColor("#8B0000"), # Primary Red from CSS
        alignment=1 # Center
    )
    
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles['Heading2'],
        fontSize=20,
        leading=24,
        spaceBefore=15,
        spaceAfter=10,
        textColor=colors.black
    )
    
    step_title_style = ParagraphStyle(
        'StepTitle',
        parent=styles['Heading3'],
        fontSize=18,
        leading=22,
        spaceBefore=12,
        spaceAfter=6,
        textColor=colors.HexColor("#333333")
    )
    
    normal_style = ParagraphStyle(
        'NormalLarge',
        parent=styles['Normal'],
        fontSize=15,
        leading=20,
        spaceAfter=10
    )
    
    bullet_style = ParagraphStyle(
        'BulletPoint',
        parent=styles['Normal'],
        fontSize=14,
        leading=18,
        leftIndent=20,
        spaceAfter=5
    )
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        textColor=colors.grey,
        alignment=1
    )

    story = []
    
    # Header Branding
    story.append(Paragraph("ASTON HIGH SCHOOL & JR. COLLEGE", title_style))
    story.append(Paragraph("ADMISSION PROCEDURE", ParagraphStyle('Subtitle', parent=title_style, fontSize=18, textColor=colors.black)))
    story.append(Spacer(1, 0.3 * inch))
    
    # Intro
    story.append(Paragraph("Welcome to the Aston High School cohort. Our admission process ensures we build a community of curious, dedicated, and high-achieving students.", normal_style))
    story.append(Spacer(1, 0.2 * inch))
    
    # The 4 Steps
    story.append(Paragraph("The 4-Step Journey", heading_style))
    
    # Step 1
    story.append(Paragraph("Step 1: Enquiry", step_title_style))
    story.append(Paragraph("Submit your digital enquiry on our website. Our team will share a personalized prospectus and curriculum overview to help you get started.", normal_style))
    
    # Step 2
    story.append(Paragraph("Step 2: Campus Visit", step_title_style))
    story.append(Paragraph("Experience student life firsthand. Schedule a private tour or join us for an Open Day to meet our faculty and explore facilities.", normal_style))
    
    # Step 3
    story.append(Paragraph("Step 3: Assessment", step_title_style))
    story.append(Paragraph("Prospective students participate in an age-appropriate entrance assessment followed by an informal interview with the Head of Admissions.", normal_style))
    
    # Step 4
    story.append(Paragraph("Step 4: Enrollment", step_title_style))
    story.append(Paragraph("Upon successful assessment, receive your official offer of admission. Finalize the registration and deposit to secure your place.", normal_style))
    
    story.append(Spacer(1, 0.3 * inch))
    
    # Important Info
    story.append(Paragraph("Important Guidelines", heading_style))
    story.append(Paragraph("• Admission forms must be collected and submitted in person.", bullet_style))
    story.append(Paragraph("• Parents must be present during the student interview process.", bullet_style))
    story.append(Paragraph("• English is the mandatory medium of communication on campus.", bullet_style))
    story.append(Paragraph("• Fees are payable in two instalments only (50% at admission).", bullet_style))
    story.append(Paragraph("• School property damages are the responsibility of the guardians.", bullet_style))
    
    story.append(Spacer(1, 0.5 * inch))
    
    # Footer Contact
    story.append(Paragraph("Contact Us", ParagraphStyle('ContactTitle', parent=heading_style, alignment=1)))
    story.append(Paragraph("+91 9773737737 / +91 8766785675", footer_style))
    story.append(Paragraph("astonhostelpanchgani@gmail.com", footer_style))
    story.append(Paragraph("Godavali Road, Panchgani, Pincode 412805", footer_style))
    
    # Build
    doc.build(story)
    print(f"PDF created successfully at: {output_path}")

if __name__ == "__main__":
    create_mobile_pdf()
