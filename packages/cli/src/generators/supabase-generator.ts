import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateSupabase(config: ProjectConfig, outputDir: string): Promise<void> {
  const supabaseDir = path.join(outputDir, 'supabase');
  await mkdir(supabaseDir, { recursive: true });
  await mkdir(path.join(supabaseDir, 'functions'), { recursive: true });
  await mkdir(path.join(supabaseDir, 'migrations'), { recursive: true });

  const data = { name: config.name, features: config.features };

  // config.toml
  const configContent = await renderTemplate('supabase/config.toml.ejs', data);
  await writeFile(path.join(supabaseDir, 'config.toml'), configContent);

  // lib/supabase.ts
  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });
  const clientContent = await renderTemplate('supabase/client.ts.ejs', data);
  await writeFile(path.join(libDir, 'supabase.ts'), clientContent);

  // .env.example
  const envContent = await renderTemplate('supabase/env.example.ejs', data);
  await writeFile(path.join(outputDir, '.env.example'), envContent);
}
