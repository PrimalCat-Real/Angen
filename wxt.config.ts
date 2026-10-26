import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifestVersion: 3,
  manifest: {
    name: 'Angen',
    permissions: ['tabCapture', 'offscreen', 'activeTab'],
    action: { default_title: 'Открыть Angen' },
  },
});
