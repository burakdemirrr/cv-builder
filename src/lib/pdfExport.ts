import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, filename: string = 'cv.pdf') => {
  try {
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Calculate proportions for A4 paper
    const a4Width = 210; // mm
    const a4Height = 297; // mm
    const scaleFactor = 2; // Higher for better quality

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: scaleFactor,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Calculate dimensions
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF document (A4 size)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // If content exceeds a single page
    if (imgHeight > a4Height) {
      let remainingHeight = imgHeight;
      let position = -a4Height; // Starting position for the second page
      
      // Add new pages as needed
      while (remainingHeight > a4Height) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        remainingHeight -= a4Height;
        position -= a4Height;
      }
    }

    // Save the PDF
    pdf.save(filename);
    return { success: true };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return { error: 'Failed to export PDF' };
  }
}; 