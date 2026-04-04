import { readFile } from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

export async function renderTemplate(
  templatePath: string,
  data: Record<string, unknown>,
): Promise<string> {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  const template = await readFile(fullPath, 'utf-8');
  return ejs.render(template, data, { filename: fullPath });
}

export function getTemplatesDir(): string {
  return TEMPLATES_DIR;
}
