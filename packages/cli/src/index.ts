#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('agentic-infra')
  .description('AI 기반 인프라/백엔드 자동 구성 도구')
  .version('0.0.1');

program
  .command('init')
  .description('새 프로젝트를 대화형으로 생성합니다')
  .argument('[project-name]', '프로젝트 이름')
  .action(async (projectName?: string) => {
    await initCommand(projectName);
  });

program.parse();
