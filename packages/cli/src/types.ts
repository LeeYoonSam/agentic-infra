export type BackendStack = 'supabase' | 'aws' | 'hybrid';
export type ClientType = 'web' | 'android' | 'both';
export type Feature = 'auth' | 'database' | 'storage' | 'realtime';
export type DeployPlatform = 'vercel' | 'aws' | 'manual';

export interface ProjectConfig {
  name: string;
  stack: BackendStack;
  client: ClientType;
  features: Feature[];
  deploy: DeployPlatform;
}
