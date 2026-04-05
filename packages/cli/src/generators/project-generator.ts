import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';
import { generateSupabase } from './supabase-generator.js';
import { generateAws } from './aws-generator.js';
import { generateVercel } from './vercel-generator.js';
import { generateClient } from './client-generator.js';
import { generateApiClient } from './api-client-generator.js';
import { generateClaudeCode } from './claude-generator.js';

const stackLabels: Record<string, string> = {
  supabase: 'Supabase',
  aws: 'AWS',
  hybrid: 'Supabase + AWS 하이브리드',
};

const clientLabels: Record<string, string> = {
  web: 'Next.js',
  android: 'Android (Kotlin/Compose)',
  ios: 'iOS (SwiftUI)',
  'react-native': 'React Native (Expo)',
  flutter: 'Flutter',
};

export async function generateProject(config: ProjectConfig, outputDir: string): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const clientLabel = config.clients.map(c => clientLabels[c]).join(' + ');

  const data = {
    name: config.name,
    stack: config.stack,
    clients: config.clients,
    features: config.features,
    deploy: config.deploy,
    stackLabel: stackLabels[config.stack],
    clientLabel,
  };

  // 공통 템플릿으로 생성
  const packageJsonContent = await renderTemplate('shared/package.json.ejs', data);
  await writeFile(path.join(outputDir, 'package.json'), packageJsonContent);

  const tsconfigContent = await renderTemplate('shared/tsconfig.json.ejs', data);
  await writeFile(path.join(outputDir, 'tsconfig.json'), tsconfigContent);

  const readmeContent = await renderTemplate('shared/README.md.ejs', data);
  await writeFile(path.join(outputDir, 'README.md'), readmeContent);

  // src 디렉토리 생성
  await mkdir(path.join(outputDir, 'src'), { recursive: true });

  // 스택별 생성기 실행
  if (config.stack === 'hybrid') {
    const { generateHybrid } = await import('./hybrid-generator.js');
    await generateHybrid(config, outputDir);
  } else if (config.stack === 'supabase') {
    await generateSupabase(config, outputDir);
  } else if (config.stack === 'aws') {
    await generateAws(config, outputDir);
  }
  if (config.deploy === 'vercel') {
    await generateVercel(config, outputDir);
  }

  // 클라이언트 생성기 실행
  await generateClient(config, outputDir);

  // API 클라이언트 생성
  await generateApiClient(config, outputDir);

  // Claude Code 통합 생성
  await generateClaudeCode(config, outputDir);
}
