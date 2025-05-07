import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run task-manager:serve-static',
        production: 'nx run task-manager:serve:production',
      },
      ciWebServerCommand: 'nx run task-manager:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
