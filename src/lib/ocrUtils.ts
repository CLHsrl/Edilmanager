import { createWorker } from 'tesseract.js';

export async function recognizeText(file: File, onProgress?: (progress: number) => void) {
  const worker = await createWorker('ita', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    }
  });

  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
}

export interface ParsedInvoiceData {
  total: number | null;
  date: string | null;
  vatNumber: string | null;
}

export function parseInvoiceText(text: string): ParsedInvoiceData {
  console.log('Parsing text:', text);

  // 1. Extract Date (GG/MM/AAAA or GG.MM.AAAA or GG-MM-AAAA)
  const dateRegex = /(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? normalizeDate(dateMatch[1], dateMatch[2], dateMatch[3]) : null;

  // 2. Extract Total Amount
  // Look for keywords like Totale, Importo, Netto, A pagare, EUR
  const totalRegex = /(?:TOTALE|TOTAL|PAGARE|TOT|EUR|€)\s*[:=]?\s*(\d+[\s.]?\d*[,.]\d{2})/i;
  const amountMatch = text.match(totalRegex);
  const total = amountMatch ? parseFloat(amountMatch[1].replace(/\s/g, '').replace(',', '.')) : null;

  // 3. Extract Partita IVA (11 digits, sometimes prefixed with IT)
  const pivaRegex = /(?:P\.IVA|PIVA|PARTITA IVA|VAT)\s*[:=]?\s*(?:IT)?\s*(\d{11})/i;
  const pivaMatch = text.match(pivaRegex);
  const vatNumber = pivaMatch ? pivaMatch[1] : null;

  return { total, date, vatNumber };
}

function normalizeDate(day: string, month: string, year: string): string {
  let fullYear = year;
  if (year.length === 2) {
    fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
  }
  const d = day.padStart(2, '0');
  const m = month.padStart(2, '0');
  return `${fullYear}-${m}-${d}`; // ISO format for <input type="date">
}
