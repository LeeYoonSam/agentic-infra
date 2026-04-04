import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateApiClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const data = {
    name: config.name,
    features: config.features,
    stack: config.stack,
    hasAuth: config.features.includes('auth'),
  };

  // TypeScript 클라이언트 (web 또는 both)
  if (config.client === 'web' || config.client === 'both') {
    const clientDir = path.join(outputDir, 'src', 'api');
    await mkdir(clientDir, { recursive: true });

    const tsClientContent = await renderTemplate('shared/api-client-ts.ejs', data);
    await writeFile(path.join(clientDir, 'client.ts'), tsClientContent);
  }

  // Kotlin 클라이언트 (android 또는 both)
  if (config.client === 'android' || config.client === 'both') {
    const kotlinDir = path.join(outputDir, 'android', 'app', 'src', 'main', 'kotlin', 'api');
    await mkdir(kotlinDir, { recursive: true });

    const kotlinClientContent = await renderTemplate('shared/api-client-kotlin.ejs', data);
    await writeFile(path.join(kotlinDir, 'ApiClient.kt'), kotlinClientContent);
  }
}
