import chalk from 'chalk';
import ora from 'ora';

export async function initCommand(projectName?: string): Promise<void> {
  console.log(chalk.bold.blue('\n🚀 Agentic Infra - 프로젝트 생성기\n'));

  const name = projectName ?? 'my-project';
  console.log(chalk.gray(`프로젝트: ${name}`));

  const spinner = ora('프로젝트 설정을 준비하고 있습니다...').start();

  // TODO: Step 1.3에서 대화형 프롬프트 플로우 구현
  await new Promise(resolve => setTimeout(resolve, 500));

  spinner.succeed(chalk.green('프로젝트 설정 준비 완료'));
  console.log(chalk.yellow('\n⚠️  대화형 프롬프트는 Step 1.3에서 구현 예정입니다.\n'));
}
