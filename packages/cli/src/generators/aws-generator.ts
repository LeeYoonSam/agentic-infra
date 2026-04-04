import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateAws(config: ProjectConfig, outputDir: string): Promise<void> {
  const data = { name: config.name, features: config.features, stack: config.stack };

  const lambdaDir = path.join(outputDir, 'lambda');
  await mkdir(lambdaDir, { recursive: true });

  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });

  const cdkDir = path.join(outputDir, 'cdk');
  await mkdir(cdkDir, { recursive: true });

  // CDK Stack (항상)
  const cdkContent = await renderTemplate('aws/cdk-stack.ts.ejs', data);
  await writeFile(path.join(cdkDir, 'stack.ts'), cdkContent);

  // Lambda CRUD (항상)
  const lambdaContent = await renderTemplate('aws/lambda-crud.ts.ejs', data);
  await writeFile(path.join(lambdaDir, 'index.ts'), lambdaContent);

  // API Gateway config (항상)
  const apiGwContent = await renderTemplate('aws/api-gateway.ts.ejs', data);
  await writeFile(path.join(libDir, 'api-gateway.ts'), apiGwContent);

  // API Client (항상)
  const apiClientContent = await renderTemplate('aws/api-client.ts.ejs', data);
  await writeFile(path.join(libDir, 'api-client.ts'), apiClientContent);

  // .env.example
  const envContent = await renderTemplate('aws/env.example.ejs', data);
  await writeFile(path.join(outputDir, '.env.example'), envContent);

  // DynamoDB (database 선택 시)
  if (config.features.includes('database')) {
    const dynamoContent = await renderTemplate('aws/dynamodb-table.ts.ejs', data);
    await writeFile(path.join(libDir, 'dynamodb-table.ts'), dynamoContent);
  }

  // Cognito (auth 선택 시)
  if (config.features.includes('auth')) {
    const cognitoContent = await renderTemplate('aws/cognito-auth.ts.ejs', data);
    await writeFile(path.join(libDir, 'cognito-auth.ts'), cognitoContent);
  }

  // S3 (storage 선택 시)
  if (config.features.includes('storage')) {
    const s3Content = await renderTemplate('aws/s3-storage.ts.ejs', data);
    await writeFile(path.join(libDir, 's3-storage.ts'), s3Content);
  }
}
