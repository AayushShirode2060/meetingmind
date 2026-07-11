// ============================================================
// PDF SERVICE
// Generates professional PDF reports for meetings using PDFKit
// ============================================================
// WHY PDFKit?
// - Pure Node.js — no external binaries or headless browsers
// - Full control over layout, fonts, colors, tables
// - Streams output (memory-efficient for large documents)
// - No API costs — runs entirely on server
//
// ALTERNATIVES CONSIDERED:
// - puppeteer (renders HTML → PDF): Heavy, needs headless Chrome
// - jsPDF: Client-side focused, less server support
// - pdfmake: Good but PDFKit is more flexible
// ============================================================

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { formatDuration } = require('../utils/helpers');

// ---- COLOR PALETTE for PDF ----
// Using the same brand colors from our UI for consistency
const COLORS = {
  primary: '#6c63ff',      // Accent purple
  dark: '#1a1a2e',         // Dark background for header
  text: '#2d2d3f',         // Main text color
  textLight: '#6b6b80',    // Secondary text
  border: '#e0e0e8',       // Light border for tables
  success: '#4ade80',      // Green for positive items
  warning: '#fbbf24',      // Yellow for deadlines
  danger: '#f87171',       // Red for risks
  white: '#ffffff',
  bgLight: '#f8f8fc'       // Light background for alternating rows
};

/**
 * Generate a professional PDF report for a meeting.
 * 
 * @param {Object} meeting - The full meeting document from MongoDB
 * @returns {string} Absolute file path to the generated PDF
 */
const generatePDF = async (meeting) => {
  // ---- Set up the output file path ----
  // Reports are saved in uploads/reports/ with the meeting ID as filename
  // This makes them easy to find and clean up when a meeting is deleted
  const reportsDir = path.join(__dirname, '..', 'uploads', 'reports');
  const filePath = path.join(reportsDir, `${meeting._id}-report.pdf`);

  // Ensure the reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // ---- Create a new PDF document ----
  // We wrap this in a Promise because PDFKit uses streams
  // and we need to wait for the stream to finish before returning
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: `Meeting Report - ${meeting.title}`,
        Author: 'MeetingMind AI',
        Subject: 'Meeting Summary Report',
        Creator: 'MeetingMind AI'
      }
    });

    // ---- Pipe output to a file ----
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===== PAGE 1: HEADER & SUMMARY =====

    // ---- Brand Header Bar ----
    doc
      .rect(0, 0, doc.page.width, 100)
      .fill(COLORS.dark);

    doc
      .font('Helvetica-Bold')
      .fontSize(24)
      .fillColor(COLORS.white)
      .text('MeetingMind AI', 50, 30);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#9898b0')
      .text('AI-Powered Meeting Report', 50, 60);

    // ---- Meeting Title ----
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor(COLORS.text)
      .text(meeting.title, 50, 120);

    // ---- Meeting Metadata (date, duration, speakers) ----
    const metaY = 150;
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.textLight);

    const date = new Date(meeting.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.text(`Date: ${date}`, 50, metaY);
    doc.text(
      `Duration: ${formatDuration(meeting.duration)}  |  Speakers: ${meeting.speakerCount || 'N/A'}`,
      50,
      metaY + 15
    );

    // ---- Horizontal Divider ----
    doc
      .moveTo(50, metaY + 40)
      .lineTo(doc.page.width - 50, metaY + 40)
      .strokeColor(COLORS.border)
      .stroke();

    let currentY = metaY + 55;

    // ===== EXECUTIVE SUMMARY SECTION =====
    if (meeting.summary) {
      currentY = addSectionHeader(doc, 'Executive Summary', currentY);
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor(COLORS.text)
        .text(meeting.summary, 50, currentY, {
          width: doc.page.width - 100,
          lineGap: 4
        });
      currentY = doc.y + 20;
    }

    // ===== KEY DECISIONS SECTION =====
    if (meeting.keyDecisions && meeting.keyDecisions.length > 0) {
      currentY = checkPageBreak(doc, currentY, 100);
      currentY = addSectionHeader(doc, 'Key Decisions', currentY);

      meeting.keyDecisions.forEach((decision, index) => {
        currentY = checkPageBreak(doc, currentY, 30);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(COLORS.primary)
          .text(`${index + 1}.`, 50, currentY, { continued: true })
          .fillColor(COLORS.text)
          .text(`  ${decision}`, { width: doc.page.width - 120, lineGap: 3 });
        currentY = doc.y + 8;
      });
      currentY += 10;
    }

    // ===== ACTION ITEMS SECTION (as a table) =====
    if (meeting.actionItems && meeting.actionItems.length > 0) {
      currentY = checkPageBreak(doc, currentY, 120);
      currentY = addSectionHeader(doc, 'Action Items', currentY);

      // ---- Table Header ----
      const tableLeft = 50;
      const colWidths = [250, 120, 120]; // Task, Owner, Deadline

      doc
        .rect(tableLeft, currentY, colWidths[0] + colWidths[1] + colWidths[2], 22)
        .fill(COLORS.dark);

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLORS.white);

      doc.text('Task', tableLeft + 8, currentY + 6);
      doc.text('Owner', tableLeft + colWidths[0] + 8, currentY + 6);
      doc.text('Deadline', tableLeft + colWidths[0] + colWidths[1] + 8, currentY + 6);

      currentY += 22;

      // ---- Table Rows ----
      meeting.actionItems.forEach((item, index) => {
        currentY = checkPageBreak(doc, currentY, 25);

        // Alternate row background for readability
        if (index % 2 === 0) {
          doc
            .rect(tableLeft, currentY, colWidths[0] + colWidths[1] + colWidths[2], 22)
            .fill(COLORS.bgLight);
        }

        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor(COLORS.text);

        doc.text(item.task, tableLeft + 8, currentY + 6, { width: colWidths[0] - 16 });
        doc.text(item.owner, tableLeft + colWidths[0] + 8, currentY + 6, { width: colWidths[1] - 16 });
        doc.text(item.deadline, tableLeft + colWidths[0] + colWidths[1] + 8, currentY + 6, { width: colWidths[2] - 16 });

        currentY += 22;
      });
      currentY += 15;
    }

    // ===== DEADLINES SECTION =====
    if (meeting.deadlines && meeting.deadlines.length > 0) {
      currentY = checkPageBreak(doc, currentY, 80);
      currentY = addSectionHeader(doc, 'Deadlines', currentY);

      meeting.deadlines.forEach((deadline) => {
        currentY = checkPageBreak(doc, currentY, 25);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(COLORS.warning)
          .text('⏰ ', 50, currentY, { continued: true })
          .fillColor(COLORS.text)
          .text(`${deadline.item} — `, { continued: true })
          .font('Helvetica-Bold')
          .text(deadline.date);
        currentY = doc.y + 8;
      });
      currentY += 10;
    }

    // ===== RISKS & OPEN QUESTIONS SECTION =====
    if (meeting.risks && meeting.risks.length > 0) {
      currentY = checkPageBreak(doc, currentY, 80);
      currentY = addSectionHeader(doc, 'Risks & Open Questions', currentY);

      meeting.risks.forEach((risk) => {
        currentY = checkPageBreak(doc, currentY, 25);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(COLORS.danger)
          .text('⚠ ', 50, currentY, { continued: true })
          .fillColor(COLORS.text)
          .text(risk, { width: doc.page.width - 120, lineGap: 3 });
        currentY = doc.y + 8;
      });
      currentY += 10;
    }

    // ===== FULL TRANSCRIPT SECTION =====
    if (meeting.transcript && meeting.transcript.utterances && meeting.transcript.utterances.length > 0) {
      // Transcript is usually long — start on a new page
      doc.addPage();
      currentY = 50;

      currentY = addSectionHeader(doc, 'Full Transcript', currentY);

      meeting.transcript.utterances.forEach((utterance) => {
        currentY = checkPageBreak(doc, currentY, 40);

        // Speaker label (colored)
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(COLORS.primary)
          .text(utterance.speaker, 50, currentY);

        currentY = doc.y + 2;

        // Utterance text
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(COLORS.text)
          .text(utterance.text, 50, currentY, {
            width: doc.page.width - 100,
            lineGap: 3
          });

        currentY = doc.y + 12;
      });
    }

    // ===== FOOTER =====
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.textLight)
      .text(
        `Generated by MeetingMind AI on ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 40,
        { align: 'center', width: doc.page.width - 100 }
      );

    // ---- Finalize the PDF ----
    doc.end();

    // Wait for the stream to finish writing
    stream.on('finish', () => resolve(filePath));
    stream.on('error', (err) => reject(new Error(`PDF generation error: ${err.message}`)));
  });
};

// ============================================================
// HELPER FUNCTIONS (internal to this service)
// ============================================================

/**
 * Adds a styled section header to the PDF
 * @param {PDFDocument} doc - The PDFKit document
 * @param {string} title - Section title text
 * @param {number} y - Y coordinate to start at
 * @returns {number} Updated Y coordinate (after the header)
 */
function addSectionHeader(doc, title, y) {
  // Colored left bar + bold title (mimics modern UI section headers)
  doc
    .rect(50, y, 3, 18)
    .fill(COLORS.primary);

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(COLORS.text)
    .text(title, 60, y);

  return doc.y + 12;
}

/**
 * Checks if we need a page break and adds one if necessary.
 * Prevents content from being cut off at the bottom of a page.
 * 
 * @param {PDFDocument} doc - The PDFKit document
 * @param {number} currentY - Current Y position
 * @param {number} requiredSpace - Minimum space needed (in points)
 * @returns {number} Updated Y coordinate (top of new page if break occurred)
 */
function checkPageBreak(doc, currentY, requiredSpace) {
  // Check if remaining space on page is less than what we need
  if (currentY + requiredSpace > doc.page.height - 60) {
    doc.addPage();
    return 50; // Reset to top margin
  }
  return currentY;
}

module.exports = { generatePDF };
