import jsPDF from 'jspdf';
import type { HistoryItem } from '../types';

export const generatePdfReport = (item: HistoryItem) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  let y = 20; // vertical position tracker

  // Helper to handle text wrapping and page breaks
  const addWrappedText = (text: string, x: number, maxWidth: number, options: any = {}) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (y > pageHeight - 20) { // Check for page break margin
        doc.addPage();
        y = 20;
      }
      doc.text(line, x, y, options);
      y += 7; // standard line height
    });
  };

  // --- PDF Header ---
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(236, 72, 153); // Theme primary color
  doc.text('WellTrack Health Analysis Report', pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  // --- Report Details ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Report Date:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(item.date, 50, y);
  y += 12;

  // --- Symptoms Section ---
  doc.setFont('helvetica', 'bold');
  doc.text('Symptoms Reported:', 15, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.setFillColor(245, 245, 245);
  doc.rect(15, y - 5, pageWidth - 30, 20, 'F');
  addWrappedText(`"${item.symptoms}"`, 20, 170);
  y += 15;

  // --- Analysis Section ---
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('AI Analysis Results', 15, y);
  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, 70, y);
  y += 10;

  // Severity
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Severity Assessment:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(item.analysis.severity, 60, y);
  y += 12;

  // Possible Conditions
  doc.setFont('helvetica', 'bold');
  doc.text('Possible Conditions:', 15, y);
  y += 7;
  item.analysis.possibleConditions.forEach(condition => {
    if (y > pageHeight - 40) { // Check margin before adding a new condition block
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    addWrappedText(`• ${condition.name} (Likelihood: ${condition.likelihood})`, 20, 175);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    addWrappedText(condition.description, 25, 170);
    y += 5;
  });

  // Recommendation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Recommended Action:', 15, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  addWrappedText(item.analysis.recommendation, 15, 180);
  y += 10;

  // --- Footer Disclaimer ---
  // Position disclaimer at the bottom of the last page
  const finalPage = doc.internal.getNumberOfPages();
  doc.setPage(finalPage);
  const disclaimerY = pageHeight - 30;
  if (y > disclaimerY) { // If content is too close, add a new page
      doc.addPage();
      y = 20;
  }
  doc.setDrawColor(200, 200, 200);
  doc.line(15, disclaimerY, pageWidth - 15, disclaimerY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  y = disclaimerY + 5;
  addWrappedText(`Disclaimer: ${item.analysis.disclaimer} This report is AI-generated and not a substitute for professional medical advice. Always consult with a qualified healthcare professional for any medical concerns.`, 15, 180);

  // --- Save the PDF ---
  const safeFileName = `WellTrack_Report_${item.id.replace(/[:.]/g, '-')}.pdf`;
  doc.save(safeFileName);
};