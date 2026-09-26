import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const getManualChunks = (id: string): string | undefined => {
  if (!id.includes('node_modules')) return;

  if (
    id.includes('/vue/') ||
    id.includes('/@vue/') ||
    id.includes('/pinia/') ||
    id.includes('/pinia-plugin-persistedstate/') ||
    id.includes('/vue-router/')
  ) {
    return 'vendor-vue';
  }
  if (id.includes('/reka-ui/') || id.includes('/@internationalized/date/')) {
    return 'vendor-reka';
  }
  if (id.includes('/@tanstack/')) {
    return 'vendor-tanstack';
  }
  // if (id.includes('/@unovis/')) {
  //   return 'vendor-unovis';
  // }
  // if (id.includes('/firebase/') || id.includes('/@firebase/')) {
  //   return 'vendor-firebase';
  // }
  if (id.includes('/vee-validate/') || id.includes('/@vee-validate/') || id.includes('/yup/')) {
    return 'vendor-form';
  }
};

export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd(), '');

  return {
    // server: {
    //   watch: {
    //     usePolling: true,
    //   },
    //   host: !!env.APP_HOST || true,
    //   strictPort: true,
    //   port: Number(env.APP_PORT) || 3000,
    // },

    build: {
      outDir: 'dist',
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        checks: {
          invalidAnnotation: false,
          pluginTimings: false,
        },
        output: {
          assetFileNames: 'project_assets/[name]-[hash][extname]',
          chunkFileNames: 'project_assets/[name]-[hash].js',
          entryFileNames: 'project_assets/[name]-[hash].js',
          manualChunks: getManualChunks,
        },
      },
    },

    server: {
      port: 3002,
      strictPort: false,
    },

    plugins: [vue(), tailwindcss()],

    resolve: {
      alias: {
        '@/components': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
        '@/composables': fileURLToPath(
          new URL('../../packages/core/src/composables', import.meta.url)
        ),
        '@/stores': fileURLToPath(new URL('../../packages/core/src/stores', import.meta.url)),
        '@/utils': fileURLToPath(new URL('../../packages/core/src/utils', import.meta.url)),
        '@/lib': fileURLToPath(new URL('../../packages/core/src/lib', import.meta.url)),
        '@/types': fileURLToPath(new URL('../../packages/core/src/types', import.meta.url)),
        '@/constants': fileURLToPath(new URL('../../packages/core/src/constants', import.meta.url)),
        '@/config': fileURLToPath(new URL('../../packages/core/src/config', import.meta.url)),
        '@/tests': fileURLToPath(new URL('./tests', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
