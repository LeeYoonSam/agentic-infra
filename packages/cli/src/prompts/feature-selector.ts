import { checkbox } from '@inquirer/prompts';
import type { Feature } from '../types.js';

export async function selectFeatures(): Promise<Feature[]> {
  const features = await checkbox({
    message: '사용할 기능을 선택하세요:',
    choices: [
      { name: '인증 (Authentication)', value: 'auth' as const, checked: true },
      { name: '데이터베이스 (Database)', value: 'database' as const, checked: true },
      { name: '파일 스토리지 (Storage)', value: 'storage' as const },
      { name: '푸시 알림 (Push Notifications)', value: 'push' as const },
      { name: '결제 (Payments)', value: 'payments' as const },
      { name: '실시간 기능 (Realtime)', value: 'realtime' as const },
    ],
  });

  return features;
}
