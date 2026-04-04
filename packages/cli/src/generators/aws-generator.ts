import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateAws(config: ProjectConfig, outputDir: string): Promise<void> {
  const data = { name: config.name, features: config.features, stack: config.stack };

  // lambda 디렉토리
  const lambdaDir = path.join(outputDir, 'lambda');
  await mkdir(lambdaDir, { recursive: true });

  const lambdaContent = await renderTemplate('aws/lambda-handler.ts.ejs', data);
  await writeFile(path.join(lambdaDir, 'index.ts'), lambdaContent);

  // lib/api-client.ts
  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });
  const apiClientContent = await renderTemplate('aws/api-client.ts.ejs', data);
  await writeFile(path.join(libDir, 'api-client.ts'), apiClientContent);

  // .env.example (AWS용)
  const envContent = await renderTemplate('aws/env.example.ejs', data);
  await writeFile(path.join(outputDir, '.env.example'), envContent);
}
