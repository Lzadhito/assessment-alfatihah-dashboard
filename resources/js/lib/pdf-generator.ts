export async function generatePDF(
    elementId: string,
    options: {
        filename?: string;
        scale?: number;
        useCORS?: boolean;
        allowTaint?: boolean;
    } = {},
): Promise<void> {
    const { default: html2canvas } = await import('html2canvas-pro');
    const { default: jsPDF } = await import('jspdf');

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
        scale: options.scale ?? 2,
        useCORS: options.useCORS ?? true,
        allowTaint: options.allowTaint ?? true,
        backgroundColor: '#ffffff',
        logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 in mm
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = A4_WIDTH_MM;
    // calculate the rendered height in mm proportionally
    const renderedHeightMm = (canvas.height / canvas.width) * pdfWidth;

    if (renderedHeightMm <= A4_HEIGHT_MM) {
        // fits on one page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedHeightMm);
    } else {
        // slice across multiple pages
        let remainingHeightMm = renderedHeightMm;
        let offsetMm = 0;

        while (remainingHeightMm > 0) {
            pdf.addImage(imgData, 'PNG', 0, -offsetMm, pdfWidth, renderedHeightMm);
            remainingHeightMm -= A4_HEIGHT_MM;
            offsetMm += A4_HEIGHT_MM;
            if (remainingHeightMm > 0) {
                pdf.addPage();
            }
        }
    }

    pdf.save(options.filename ?? 'evaluation.pdf');
}

export function generateFilename(
    name?: string | null,
    date?: string,
): string {
    const parts = ['Assessment', name, date].filter(Boolean);
    return parts.join('-') + '.pdf';
}
