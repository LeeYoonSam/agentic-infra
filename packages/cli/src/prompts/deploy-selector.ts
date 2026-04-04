import { select } from '@inquirer/prompts';
import type { DeployPlatform } from '../types.js';

export async function selectDeploy(): Promise<DeployPlatform> {
  const deploy = await select({
    message: '배포 플랫폼을 선택하세요:',
    choices: [
      {
        name: 'Vercel (추천 - 간편 배포)',
        value: 'vercel' as const,
        description: 'Git push로 자동 배포, 프리뷰 환경 제공',
      },
      {
        name: 'AWS (직접 관리)',
        value: 'aws' as const,
        description: 'S3 + CloudFront 또는 EC2/ECS 배포',
      },
      {
        name: '수동 배포',
        value: 'manual' as const,
        description: '직접 빌드 후 원하는 곳에 배포',
      },
    ],
  });

  return deploy;
}
