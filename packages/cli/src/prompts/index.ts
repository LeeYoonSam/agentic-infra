import { inputProjectName } from './project-name.js';
import { selectStack } from './stack-selector.js';
import { selectClients } from './client-selector.js';
import { selectFeatures } from './feature-selector.js';
import { selectDeploy } from './deploy-selector.js';
import { confirmConfig } from './confirm.js';
import type { ProjectConfig } from '../types.js';

export async function runPromptFlow(defaultProjectName?: string): Promise<ProjectConfig | null> {
  const name = await inputProjectName(defaultProjectName);
  const stack = await selectStack();
  const clients = await selectClients();
  const features = await selectFeatures();
  const deploy = await selectDeploy();

  const config: ProjectConfig = { name, stack, clients, features, deploy };

  const confirmed = await confirmConfig(config);

  if (!confirmed) {
    return null;
  }

  return config;
}

export { inputProjectName } from './project-name.js';
export { selectStack } from './stack-selector.js';
export { selectClients } from './client-selector.js';
export { selectFeatures } from './feature-selector.js';
export { selectDeploy } from './deploy-selector.js';
export { confirmConfig } from './confirm.js';
