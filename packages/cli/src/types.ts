export type BackendStack = 'supabase' | 'aws' | 'hybrid';
export type ClientType = 'web' | 'android' | 'ios' | 'react-native' | 'flutter';
export type Feature = 'auth' | 'database' | 'storage' | 'realtime';
export type DeployPlatform = 'vercel' | 'aws' | 'manual';

export interface ProjectConfig {
  name: string;
  stack: BackendStack;
  clients: ClientType[];
  features: Feature[];
  deploy: DeployPlatform;
}
