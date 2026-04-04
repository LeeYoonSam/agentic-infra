import chalk from 'chalk';
import ora from 'ora';
import { runPromptFlow } from '../prompts/index.js';

export async function initCommand(projectName?: string): Promise<void> {
  console.log(chalk.bold.blue('\n🚀 Agentic Infra - 프로젝트 생성기\n'));

  const config = await runPromptFlow(projectName);

  if (!config) {
    console.log(chalk.yellow('\n프로젝트 생성이 취소되었습니다.\n'));
    return;
  }

  const spinner = ora('프로젝트를 생성하고 있습니다...').start();

  // TODO: Step 1.4에서 프로젝트 생성기 구현
  await new Promise(resolve => setTimeout(resolve, 500));

  spinner.succeed(chalk.green(`프로젝트 '${config.name}' 생성 준비 완료`));
  console.log(chalk.yellow('\n⚠️  프로젝트 생성기는 Step 1.4에서 구현 예정입니다.\n'));
}
