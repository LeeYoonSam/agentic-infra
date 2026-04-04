import { select } from '@inquirer/prompts';

export type ClientType = 'web' | 'android' | 'both';

export async function selectClient(): Promise<ClientType> {
  const client = await select({
    message: '클라이언트 유형을 선택하세요:',
    choices: [
      {
        name: 'Web (Next.js)',
        value: 'web' as const,
        description: 'Next.js 기반 웹 애플리케이션',
      },
      {
        name: 'Android (Kotlin/Compose)',
        value: 'android' as const,
        description: 'Kotlin + Jetpack Compose 앱',
      },
      {
        name: '둘 다 (Web + Android)',
        value: 'both' as const,
        description: 'Next.js 웹 + Android 앱',
      },
    ],
  });

  return client;
}
