import { defineConfig } from 'cypress';
export default defineConfig({ e2e: { baseUrl: 'http://127.0.0.1:5173', video: true, screenshotOnRunFailure: true }, viewportWidth: 390, viewportHeight: 844 });
