import crypto from "node:crypto";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const parsed = await pdf(buffer);
    return { text: normalizeText(parsed.text), checksum };
  }

  if (file.type.includes("wordprocessingml") || file.name.toLowerCase().endsWith(".docx")) {
    const parsed = await mammoth.extractRawText({ buffer });
    return { text: normalizeText(parsed.value), checksum };
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX resume.");
}

export function normalizeText(text: string) {
  return text.replace(/\0/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 120_000);
}
