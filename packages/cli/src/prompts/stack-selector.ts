import { select } from '@inquirer/prompts';

export type BackendStack = 'supabase' | 'aws' | 'hybrid';

export async function selectStack(): Promise<BackendStack> {
  const stack = await select({
    message: '백엔드 스택을 선택하세요:',
    choices: [
      {
        name: 'Supabase (추천 - 빠른 시작)',
        value: 'supabase' as const,
        description: 'DB, Auth, Storage, Edge Functions 통합',
      },
      {
        name: 'AWS (커스텀 - 풀 컨트롤)',
        value: 'aws' as const,
        description: 'Lambda, API Gateway, DynamoDB/RDS, Cognito',
      },
      {
        name: '하이브리드 (Supabase + AWS)',
        value: 'hybrid' as const,
        description: 'Supabase DB/Auth + AWS Lambda 비즈니스 로직',
      },
    ],
  });

  return stack;
}
