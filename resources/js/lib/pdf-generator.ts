export async function generatePDF(
    elementId: string,
    options: {
        filename?: string;
        scale?: number;
        useCORS?: boolean;
        allowTaint?: boolean;
    } = {},
): Promise<void> {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
        scale: options.scale ?? 2,
        useCORS: options.useCORS ?? true,
        allowTaint: options.allowTaint ?? true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(options.filename ?? 'evaluation.pdf');
}

export function generateFilename(
    name?: string | null,
    date?: string,
): string {
    const parts = ['Assessment', name, date].filter(Boolean);
    return parts.join('-') + '.pdf';
}
