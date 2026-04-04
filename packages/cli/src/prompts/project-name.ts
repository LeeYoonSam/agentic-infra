import { input } from '@inquirer/prompts';

export async function inputProjectName(defaultName?: string): Promise<string> {
  const name = await input({
    message: '프로젝트 이름을 입력하세요:',
    default: defaultName ?? 'my-project',
    validate: (value) => {
      if (!value.trim()) return '프로젝트 이름을 입력해주세요.';
      if (!/^[a-z0-9-]+$/.test(value)) return '소문자, 숫자, 하이픈(-)만 사용 가능합니다.';
      return true;
    },
  });

  return name;
}
