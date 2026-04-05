import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

const deployLabels: Record<string, string> = {
  vercel: 'Vercel',
  aws: 'AWS',
  manual: '수동 배포',
};

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

export async function generateClaudeCode(config: ProjectConfig, outputDir: string): Promise<void> {
  const claudeDir = path.join(outputDir, '.claude');
  await mkdir(claudeDir, { recursive: true });

  const clientLabel = config.clients.map(c => clientLabels[c]).join(' + ');

  const data = {
    name: config.name,
    stack: config.stack,
    clients: config.clients,
    features: config.features,
    deploy: config.deploy,
    stackLabel: stackLabels[config.stack],
    clientLabel,
    deployLabel: deployLabels[config.deploy],
    hasAuth: config.features.includes('auth'),
  };

  // CLAUDE.md (프로젝트 루트)
  const claudeMdContent = await renderTemplate('claude/CLAUDE.md.ejs', data);
  await writeFile(path.join(outputDir, 'CLAUDE.md'), claudeMdContent);

  // .claude/settings.json (hooks & permissions)
  const settingsContent = await renderTemplate('claude/settings.json.ejs', data);
  await writeFile(path.join(claudeDir, 'settings.json'), settingsContent);

  // Skills (.claude/skills/<name>/SKILL.md)
  const skills = ['add-api', 'add-page', 'add-table', 'deploy'];
  for (const skill of skills) {
    const skillDir = path.join(claudeDir, 'skills', skill);
    await mkdir(skillDir, { recursive: true });
    const content = await renderTemplate(`claude/skills/${skill}/SKILL.md.ejs`, data);
    await writeFile(path.join(skillDir, 'SKILL.md'), content);
  }
}
