import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';
import { generateSupabase } from './supabase-generator.js';
import { generateAws } from './aws-generator.js';

export async function generateHybrid(config: ProjectConfig, outputDir: string): Promise<void> {
  const data = { name: config.name, features: config.features, stack: config.stack };

  // Supabase: DB + Auth + Realtime
  await generateSupabase(config, outputDir);

  // AWS Lambda: 복잡한 비즈니스 로직
  const lambdaDir = path.join(outputDir, 'lambda');
  await mkdir(lambdaDir, { recursive: true });

  const lambdaContent = await renderTemplate('aws/lambda-crud.ts.ejs', data);
  await writeFile(path.join(lambdaDir, 'index.ts'), lambdaContent);

  // 하이브리드 전용 파일
  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });

  const webhookContent = await renderTemplate('hybrid/webhook-handler.ts.ejs', data);
  await writeFile(path.join(lambdaDir, 'webhook-handler.ts'), webhookContent);

  const unifiedContent = await renderTemplate('hybrid/unified-client.ts.ejs', data);
  await writeFile(path.join(libDir, 'unified-client.ts'), unifiedContent);
}
