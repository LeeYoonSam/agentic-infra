import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';

export async function generateSupabase(config: ProjectConfig, outputDir: string): Promise<void> {
  // supabase 디렉토리
  const supabaseDir = path.join(outputDir, 'supabase');
  await mkdir(supabaseDir, { recursive: true });
  await mkdir(path.join(supabaseDir, 'functions'), { recursive: true });
  await mkdir(path.join(supabaseDir, 'migrations'), { recursive: true });

  // config.toml
  const configToml = `[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]

[db]
port = 54322

[studio]
enabled = true
port = 54323
`;

  await writeFile(path.join(supabaseDir, 'config.toml'), configToml);

  // lib/supabase.ts
  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });

  const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

  await writeFile(path.join(libDir, 'supabase.ts'), supabaseClient);

  // .env.example
  const envExample = `SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
`;

  await writeFile(path.join(outputDir, '.env.example'), envExample);
}
