import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import type { ProjectConfig } from '../types.js';

const stackLabels: Record<string, string> = {
  supabase: 'Supabase',
  aws: 'AWS',
  hybrid: 'Supabase + AWS 하이브리드',
};

const clientLabels: Record<string, string> = {
  web: 'Web (Next.js)',
  android: 'Android (Kotlin/Compose)',
  ios: 'iOS (SwiftUI)',
  'react-native': 'React Native (Expo)',
  flutter: 'Flutter',
};

const featureLabels: Record<string, string> = {
  auth: '인증',
  database: '데이터베이스',
  storage: '파일 스토리지',
  realtime: '실시간',
};

const deployLabels: Record<string, string> = {
  vercel: 'Vercel',
  aws: 'AWS',
  manual: '수동 배포',
};

export async function confirmConfig(config: ProjectConfig): Promise<boolean> {
  console.log(chalk.bold('\n📋 프로젝트 설정 요약:\n'));
  console.log(`  ${chalk.cyan('프로젝트명:')}  ${config.name}`);
  console.log(`  ${chalk.cyan('백엔드:')}      ${stackLabels[config.stack]}`);
  console.log(`  ${chalk.cyan('클라이언트:')}  ${config.clients.map(c => clientLabels[c]).join(', ')}`);
  console.log(`  ${chalk.cyan('기능:')}        ${config.features.map(f => featureLabels[f]).join(', ')}`);
  console.log(`  ${chalk.cyan('배포:')}        ${deployLabels[config.deploy]}`);
  console.log('');

  const confirmed = await confirm({
    message: '위 설정으로 프로젝트를 생성할까요?',
    default: true,
  });

  return confirmed;
}
