import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';

export async function generateAws(config: ProjectConfig, outputDir: string): Promise<void> {
  // lambda 디렉토리
  const lambdaDir = path.join(outputDir, 'lambda');
  await mkdir(lambdaDir, { recursive: true });

  // lambda/index.ts
  const lambdaHandler = `import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello from ${config.name}!' }),
  };
}
`;

  await writeFile(path.join(lambdaDir, 'index.ts'), lambdaHandler);

  // lib/api-client.ts
  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });

  const apiClient = `const API_BASE_URL = process.env.API_BASE_URL ?? '';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(\`API error: \${response.status} \${response.statusText}\`);
  }

  return response.json() as Promise<T>;
}
`;

  await writeFile(path.join(libDir, 'api-client.ts'), apiClient);
}
