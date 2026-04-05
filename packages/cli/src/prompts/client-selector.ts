import { checkbox } from '@inquirer/prompts';
import type { ClientType } from '../types.js';

export async function selectClients(): Promise<ClientType[]> {
  const clients = await checkbox({
    message: '클라이언트 플랫폼을 선택하세요 (복수 선택 가능):',
    choices: [
      {
        name: 'Web (Next.js 15)',
        value: 'web' as const,
        description: 'Next.js App Router 기반 웹 애플리케이션',
      },
      {
        name: 'Android (Kotlin/Compose)',
        value: 'android' as const,
        description: 'Kotlin 2.0 + Jetpack Compose',
      },
      {
        name: 'iOS (SwiftUI)',
        value: 'ios' as const,
        description: 'Swift 5.9 + SwiftUI (iOS 17+)',
      },
      {
        name: 'React Native (Expo)',
        value: 'react-native' as const,
        description: 'Expo SDK 52 + React Native (New Architecture)',
      },
      {
        name: 'Flutter',
        value: 'flutter' as const,
        description: 'Flutter 3.24 + Dart 3.5',
      },
    ],
  });

  return clients;
}
