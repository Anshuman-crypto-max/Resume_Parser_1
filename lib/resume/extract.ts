import crypto from "node:crypto";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");
  const fileName = file.name.toLowerCase();

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    const parsed = await pdf(buffer);
    return { text: normalizeText(parsed.text), checksum };
  }

  if (file.type.includes("wordprocessingml") || fileName.endsWith(".docx")) {
    const parsed = await mammoth.extractRawText({ buffer });
    return { text: normalizeText(parsed.value), checksum };
  }

  if (file.type === "application/msword" || fileName.endsWith(".doc")) {
    return { text: normalizeText(extractLegacyDocText(buffer)), checksum };
  }

  throw new Error("Unsupported file type. Upload a PDF, DOCX, or DOC resume.");
}

export function normalizeText(text: string) {
  return text.replace(/\0/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 120_000);
}

function extractLegacyDocText(buffer: Buffer) {
  const asciiText = buffer.toString("latin1").replace(/[^\x20-\x7E\r\n\t]+/g, " ");
  const unicodeText = buffer.toString("utf16le").replace(/[^\x20-\x7E\r\n\t]+/g, " ");
  return [asciiText, unicodeText]
    .join("\n")
    .split(/\s{2,}/)
    .filter((part) => /[A-Za-z]{3,}/.test(part))
    .join("\n");
}
