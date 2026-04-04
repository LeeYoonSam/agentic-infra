import { writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateVercel(config: ProjectConfig, outputDir: string): Promise<void> {
  const data = { name: config.name, stack: config.stack, features: config.features };

  const vercelContent = await renderTemplate('vercel/vercel.json.ejs', data);
  await writeFile(path.join(outputDir, 'vercel.json'), vercelContent);

  const nextConfigContent = await renderTemplate('vercel/next.config.js.ejs', data);
  await writeFile(path.join(outputDir, 'next.config.js'), nextConfigContent);
}
