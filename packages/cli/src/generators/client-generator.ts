import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';

export async function generateClient(config: ProjectConfig, outputDir: string): Promise<void> {
  if (config.clients.includes('web')) {
    await generateWebClient(config, outputDir);
  }
  if (config.clients.includes('android')) {
    await generateAndroidClient(config, outputDir);
  }
  if (config.clients.includes('ios')) {
    await generateIosClient(config, outputDir);
  }
  if (config.clients.includes('react-native')) {
    await generateReactNativeClient(config, outputDir);
  }
  if (config.clients.includes('flutter')) {
    await generateFlutterClient(config, outputDir);
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
      lint: 'next lint',
    },
    dependencies: {
      next: '^16.2.0',
      react: '^19.2.0',
      'react-dom': '^19.2.0',
    },
    devDependencies: {
      '@types/react': '^19.2.0',
      typescript: '^5.8.0',
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
  const packageName = `com.example.${config.name.replace(/-/g, '')}`;
  const packagePath = packageName.replace(/\./g, '/');
  const kotlinDir = path.join(androidDir, 'app', 'src', 'main', 'kotlin', packagePath);
  await mkdir(kotlinDir, { recursive: true });
  await mkdir(path.join(androidDir, 'app', 'src', 'main', 'res', 'values'), { recursive: true });

  // settings.gradle.kts
  await writeFile(path.join(androidDir, 'settings.gradle.kts'), `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolution {
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${config.name}"
include(":app")
`);

  // build.gradle.kts (root)
  await writeFile(path.join(androidDir, 'build.gradle.kts'), `plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.3.20" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.3.20" apply false
}
`);

  // app/build.gradle.kts
  await writeFile(path.join(androidDir, 'app', 'build.gradle.kts'), `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "${packageName}"
    compileSdk = 35

    defaultConfig {
        applicationId = "${packageName}"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    buildFeatures {
        compose = true
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2026.03.00")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
`);

  // AndroidManifest.xml
  await writeFile(path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml'), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:label="${config.name}"
        android:supportsRtl="true"
        android:theme="@style/Theme.Material3.DayNight.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`);

  // MainActivity.kt
  await writeFile(path.join(kotlinDir, 'MainActivity.kt'), `package ${packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "${config.name}",
                            style = MaterialTheme.typography.headlineMedium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Welcome to your new project!")
                    }
                }
            }
        }
    }
}
`);
}

async function generateIosClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const iosDir = path.join(outputDir, 'ios');
  const appName = config.name.replace(/-/g, '');
  const srcDir = path.join(iosDir, appName);
  await mkdir(srcDir, { recursive: true });

  // Package.swift (SPM)
  await writeFile(path.join(iosDir, 'Package.swift'), `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "${appName}",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "${appName}", targets: ["${appName}"])
    ],
    targets: [
        .target(name: "${appName}", path: "${appName}")
    ]
)
`);

  // App entry point
  await writeFile(path.join(srcDir, `${appName}App.swift`), `import SwiftUI

@main
struct ${appName}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`);

  // ContentView
  await writeFile(path.join(srcDir, 'ContentView.swift'), `import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Text("${config.name}")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                Text("Welcome to your new project!")
                    .foregroundStyle(.secondary)
            }
            .padding()
        }
    }
}

#Preview {
    ContentView()
}
`);
}

async function generateReactNativeClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const rnDir = path.join(outputDir, 'mobile');
  await mkdir(path.join(rnDir, 'app'), { recursive: true });
  await mkdir(path.join(rnDir, 'components'), { recursive: true });

  const rnPackageJson = {
    name: `${config.name}-mobile`,
    version: '0.1.0',
    private: true,
    main: 'expo-router/entry',
    scripts: {
      dev: 'expo start',
      android: 'expo run:android',
      ios: 'expo run:ios',
      web: 'expo start --web',
      lint: 'expo lint',
    },
    dependencies: {
      expo: '~55.0.0',
      'expo-router': '~5.0.0',
      'expo-status-bar': '~3.0.0',
      react: '^19.2.0',
      'react-native': '0.83.0',
      'react-native-safe-area-context': '5.4.0',
      'react-native-screens': '~5.0.0',
    },
    devDependencies: {
      '@types/react': '~19.2.0',
      typescript: '^5.8.0',
    },
  };

  await writeFile(
    path.join(rnDir, 'package.json'),
    JSON.stringify(rnPackageJson, null, 2) + '\n',
  );

  // app.json (Expo config)
  const appJson = {
    expo: {
      name: config.name,
      slug: config.name,
      version: '0.1.0',
      scheme: config.name,
      newArchEnabled: true,
      platforms: ['ios', 'android'],
    },
  };
  await writeFile(path.join(rnDir, 'app.json'), JSON.stringify(appJson, null, 2) + '\n');

  // app/_layout.tsx (Expo Router)
  await writeFile(path.join(rnDir, 'app', '_layout.tsx'), `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '${config.name}' }} />
    </Stack>
  );
}
`);

  // app/index.tsx
  await writeFile(path.join(rnDir, 'app', 'index.tsx'), `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${config.name}</Text>
      <Text style={styles.subtitle}>Welcome to your new project!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
});
`);

  // tsconfig.json
  await writeFile(path.join(rnDir, 'tsconfig.json'), JSON.stringify({
    extends: 'expo/tsconfig.base',
    compilerOptions: { strict: true },
  }, null, 2) + '\n');
}

async function generateFlutterClient(config: ProjectConfig, outputDir: string): Promise<void> {
  const flutterDir = path.join(outputDir, 'flutter');
  await mkdir(path.join(flutterDir, 'lib'), { recursive: true });

  // pubspec.yaml
  await writeFile(path.join(flutterDir, 'pubspec.yaml'), `name: ${config.name.replace(/-/g, '_')}
description: ${config.name} Flutter app
version: 0.1.0

environment:
  sdk: ">=3.5.0 <4.0.0"
  flutter: ">=3.41.0"

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.2
  provider: ^6.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true
`);

  // lib/main.dart
  await writeFile(path.join(flutterDir, 'lib', 'main.dart'), `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${config.name}',
      theme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${config.name}')),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${config.name}',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Welcome to your new project!',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
`);

  // analysis_options.yaml
  await writeFile(path.join(flutterDir, 'analysis_options.yaml'), `include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_const_constructors: true
    prefer_const_declarations: true
    avoid_print: true
`);
}
