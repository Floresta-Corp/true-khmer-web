export async function countPdfPages(file: File): Promise<number | null> {
  try {
    const { PDFDocument } = await import("pdf-lib");

    const document = await PDFDocument.load(await file.arrayBuffer(), {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const count = document.getPageCount();
    return Number.isInteger(count) && count > 0 ? count : null;
  } catch {
    return null;
  }
}
