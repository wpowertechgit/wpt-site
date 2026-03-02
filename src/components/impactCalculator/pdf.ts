import jsPDF from "jspdf";
import figtreeRegularTtfUrl from "../../assets/fonts/Figtree/Figtree-Regular.ttf?url";
import figtreeSemiBoldTtfUrl from "../../assets/fonts/Figtree/Figtree-SemiBold.ttf?url";
import stackRegularTtfUrl from "../../assets/fonts/Stack/StackSansText-Regular.ttf?url";
import stackBoldTtfUrl from "../../assets/fonts/Stack/StackSansText-Bold.ttf?url";

export const PDF_LOGO_URL = "/wpt logo-01.png";
export const PDF_LOGO_WIDTH_PX = 1313;
export const PDF_LOGO_HEIGHT_PX = 254;

let pdfFontDataPromise: Promise<Record<string, string>> | null = null;
let pdfLogoDataUrlPromise: Promise<string> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

async function fetchB64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed: ${url}`);
  }

  return arrayBufferToBase64(await response.arrayBuffer());
}

export async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function getPdfFontData(): Promise<Record<string, string>> {
  if (!pdfFontDataPromise) {
    pdfFontDataPromise = Promise.all([
      fetchB64(figtreeRegularTtfUrl),
      fetchB64(figtreeSemiBoldTtfUrl),
      fetchB64(stackRegularTtfUrl),
      fetchB64(stackBoldTtfUrl),
    ]).then(([figtreeRegular, figtreeSemiBold, stackRegular, stackBold]) => ({
      figtreeRegular,
      figtreeSemiBold,
      stackRegular,
      stackBold,
    }));
  }

  return pdfFontDataPromise;
}

export async function registerPdfFonts(doc: jsPDF): Promise<void> {
  const fonts = await getPdfFontData();

  doc.addFileToVFS("Figtree-Regular.ttf", fonts.figtreeRegular);
  doc.addFont("Figtree-Regular.ttf", "Figtree", "normal");
  doc.addFileToVFS("Figtree-SemiBold.ttf", fonts.figtreeSemiBold);
  doc.addFont("Figtree-SemiBold.ttf", "Figtree", "bold");
  doc.addFileToVFS("StackSansText-Regular.ttf", fonts.stackRegular);
  doc.addFont("StackSansText-Regular.ttf", "Stack Sans Headline", "normal");
  doc.addFileToVFS("StackSansText-Bold.ttf", fonts.stackBold);
  doc.addFont("StackSansText-Bold.ttf", "Stack Sans Headline", "bold");
}

export async function getPdfLogoDataUrl(): Promise<string> {
  if (!pdfLogoDataUrlPromise) {
    pdfLogoDataUrlPromise = (async () => {
      const response = await fetch(PDF_LOGO_URL);
      if (!response.ok) {
        throw new Error("Logo failed");
      }

      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("Conversion failed"));
        reader.onerror = () => reject(new Error("Read failed"));
        reader.readAsDataURL(blob);
      });
    })();
  }

  return pdfLogoDataUrlPromise;
}
