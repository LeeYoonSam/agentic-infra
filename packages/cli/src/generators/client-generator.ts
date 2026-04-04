import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';

export async function generateClient(config: ProjectConfig, outputDir: string): Promise<void> {
  if (config.client === 'web' || config.client === 'both') {
    await generateWebClient(config, outputDir);
  }
  if (config.client === 'android' || config.client === 'both') {
    await generateAndroidClient(config, outputDir);
  }
}

async function generateWebClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const webDir = path.join(outputDir, 'web');
  await mkdir(path.join(webDir, 'src', 'app'), { recursive: true });
  await mkdir(path.join(webDir, 'public'), { recursive: true });

  const webPackageJson = {
    name: `${config.name}-web`,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
    },
    dependencies: {
      next: '^15.1.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      typescript: '^5.7.2',
    },
  };

  await writeFile(
    path.join(webDir, 'package.json'),
    JSON.stringify(webPackageJson, null, 2) + '\n',
  );

  const pageTs = `export default function Home() {
  return (
    <main>
      <h1>${config.name}</h1>
      <p>Welcome to your new project!</p>
    </main>
  );
}
`;
  await writeFile(path.join(webDir, 'src', 'app', 'page.tsx'), pageTs);
}

async function generateAndroidClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const androidDir = path.join(outputDir, 'android');
  await mkdir(path.join(androidDir, 'app', 'src', 'main', 'kotlin'), { recursive: true });

  const buildGradle = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.${config.name.replace(/-/g, '')}"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.${config.name.replace(/-/g, '')}"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }
}

dependencies {
    implementation("androidx.compose.ui:ui:1.7.6")
    implementation("androidx.compose.material3:material3:1.3.1")
}
`;

  await writeFile(path.join(androidDir, 'app', 'build.gradle.kts'), buildGradle);
}
