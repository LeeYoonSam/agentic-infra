import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { runPromptFlow } from '../prompts/index.js';
import { generateProject } from '../generators/project-generator.js';

const SAFE_PROJECT_NAME = /^[a-zA-Z0-9_-]+$/;

export async function initCommand(projectName?: string): Promise<void> {
  console.log(chalk.bold.blue('\n🚀 Agentic Infra - 프로젝트 생성기\n'));

  const config = await runPromptFlow(projectName);

  if (!config) {
    console.log(chalk.yellow('\n프로젝트 생성이 취소되었습니다.\n'));
    return;
  }

  if (!SAFE_PROJECT_NAME.test(config.name)) {
    console.log(chalk.red(`\n잘못된 프로젝트 이름: "${config.name}". 영문, 숫자, 하이픈, 언더스코어만 사용 가능합니다.\n`));
    return;
  }

  const outputDir = path.resolve(process.cwd(), config.name);
  const spinner = ora('프로젝트를 생성하고 있습니다...').start();

  try {
    await generateProject(config, outputDir);
    spinner.succeed(chalk.green(`프로젝트 '${config.name}' 생성 완료!`));

    console.log(chalk.cyan('\n다음 단계:\n'));
    console.log(`  cd ${config.name}`);
    console.log('  npm install');
    console.log('  npm run dev\n');
  } catch (error) {
    spinner.fail(chalk.red('프로젝트 생성 실패'));
    throw error;
  }
}
