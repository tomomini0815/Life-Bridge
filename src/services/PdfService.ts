import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const PdfService = {
    generateApplicationPdf: async (data: any): Promise<Uint8Array> => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        const { width, height } = page.getSize();

        // Embed a standard font
        // Note: For real Japanese text we would need a custom font file (e.g., Noto Sans JP)
        // For this demo we use StandardFonts which supports ASCII. 
        // In a real app we'd load a font buffer.
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Helper to draw lines
        const drawLine = (y: number) => {
            page.drawLine({
                start: { x: 50, y },
                end: { x: 545, y },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
        };

        // Header
        page.drawText('Official Application Form', { x: 50, y: height - 60, size: 24, font: fontBold });
        page.drawText('(Simulated Government Document)', { x: 50, y: height - 85, size: 10, font });

        // Date box
        page.drawRectangle({ x: 400, y: height - 100, width: 145, height: 30, borderWidth: 1 });
        page.drawText('Date: 2025/12/16', { x: 410, y: height - 90, size: 12, font });

        // Main Form Structure
        let currentY = height - 140;

        // Title Block
        page.drawRectangle({ x: 50, y: currentY - 40, width: 495, height: 40, color: rgb(0.9, 0.9, 0.9) });
        page.drawText('APPLICANT INFORMATION', { x: 200, y: currentY - 25, size: 14, font: fontBold });
        currentY -= 40;

        // Row 1: Name
        page.drawRectangle({ x: 50, y: currentY - 30, width: 100, height: 30, borderWidth: 1 });
        page.drawText('Name', { x: 60, y: currentY - 20, size: 10, font });
        page.drawRectangle({ x: 150, y: currentY - 30, width: 395, height: 30, borderWidth: 1 });
        page.drawText('Taro Tanaka', { x: 160, y: currentY - 20, size: 12, font: fontBold }); // Mocked Data
        currentY -= 30;

        // Row 2: Address
        page.drawRectangle({ x: 50, y: currentY - 30, width: 100, height: 30, borderWidth: 1 });
        page.drawText('Address', { x: 60, y: currentY - 20, size: 10, font });
        page.drawRectangle({ x: 150, y: currentY - 30, width: 395, height: 30, borderWidth: 1 });
        page.drawText('1-2-3 Shibuya, Tokyo, Japan', { x: 160, y: currentY - 20, size: 12, font });
        currentY -= 30;

        // Row 3: Phone
        page.drawRectangle({ x: 50, y: currentY - 30, width: 100, height: 30, borderWidth: 1 });
        page.drawText('Phone', { x: 60, y: currentY - 20, size: 10, font });
        page.drawRectangle({ x: 150, y: currentY - 30, width: 395, height: 30, borderWidth: 1 });
        page.drawText('090-1234-5678', { x: 160, y: currentY - 20, size: 12, font });
        currentY -= 50;

        // Content Block
        page.drawRectangle({ x: 50, y: currentY - 40, width: 495, height: 40, color: rgb(0.9, 0.9, 0.9) });
        page.drawText('APPLICATION DETAILS', { x: 200, y: currentY - 25, size: 14, font: fontBold });
        currentY -= 40;

        // Content Body
        page.drawRectangle({ x: 50, y: currentY - 300, width: 495, height: 300, borderWidth: 1 });
        page.drawText('This document certifies the intent to complete the procedure.', { x: 60, y: currentY - 30, size: 12, font });
        page.drawText('Verified by Life-Bridge Application.', { x: 60, y: currentY - 50, size: 12, font });

        // Footer with "Cut here" line
        const footerY = 100;
        page.drawLine({ start: { x: 0, y: footerY }, end: { x: 595, y: footerY }, thickness: 2, dashArray: [5, 5] });
        page.drawText('Official Use Only', { x: 250, y: footerY - 20, size: 10, font });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        return await pdfDoc.save();
    }
};
