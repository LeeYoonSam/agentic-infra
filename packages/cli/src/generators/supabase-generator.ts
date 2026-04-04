import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { renderTemplate } from '../utils/template-renderer.js';

export async function generateSupabase(config: ProjectConfig, outputDir: string): Promise<void> {
  const supabaseDir = path.join(outputDir, 'supabase');
  await mkdir(supabaseDir, { recursive: true });
  await mkdir(path.join(supabaseDir, 'functions'), { recursive: true });
  await mkdir(path.join(supabaseDir, 'migrations'), { recursive: true });

  const libDir = path.join(outputDir, 'src', 'lib');
  await mkdir(libDir, { recursive: true });

  const data = { name: config.name, features: config.features };

  // 기본 설정 (항상 생성)
  const configContent = await renderTemplate('supabase/config.toml.ejs', data);
  await writeFile(path.join(supabaseDir, 'config.toml'), configContent);

  const clientContent = await renderTemplate('supabase/client.ts.ejs', data);
  await writeFile(path.join(libDir, 'supabase.ts'), clientContent);

  const envContent = await renderTemplate('supabase/env.example.ejs', data);
  await writeFile(path.join(outputDir, '.env.example'), envContent);

  // DB 마이그레이션 (auth 또는 database 선택 시)
  if (config.features.includes('auth') || config.features.includes('database')) {
    const migrationContent = await renderTemplate('supabase/migration.sql.ejs', data);
    await writeFile(
      path.join(supabaseDir, 'migrations', '00001_initial.sql'),
      migrationContent,
    );
  }

  // 인증 설정 (auth 선택 시)
  if (config.features.includes('auth')) {
    const authContent = await renderTemplate('supabase/auth-config.ts.ejs', data);
    await writeFile(path.join(libDir, 'auth.ts'), authContent);
  }

  // 스토리지 (storage 선택 시)
  if (config.features.includes('storage')) {
    const storageContent = await renderTemplate('supabase/storage.ts.ejs', data);
    await writeFile(path.join(libDir, 'storage.ts'), storageContent);
  }

  // Edge Functions (항상 생성)
  const edgeFnDir = path.join(supabaseDir, 'functions', 'api');
  await mkdir(edgeFnDir, { recursive: true });
  const edgeFnContent = await renderTemplate('supabase/edge-function.ts.ejs', data);
  await writeFile(path.join(edgeFnDir, 'index.ts'), edgeFnContent);

  // 실시간 (realtime 선택 시)
  if (config.features.includes('realtime')) {
    const realtimeContent = await renderTemplate('supabase/realtime.ts.ejs', data);
    await writeFile(path.join(libDir, 'realtime.ts'), realtimeContent);
  }
}
