import { writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';

export async function generateVercel(config: ProjectConfig, outputDir: string): Promise<void> {
  // vercel.json
  const vercelConfig = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: 'nextjs',
  };

  await writeFile(
    path.join(outputDir, 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2) + '\n',
  );

  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;

  await writeFile(path.join(outputDir, 'next.config.js'), nextConfig);
}
