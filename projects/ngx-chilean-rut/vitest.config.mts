import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
    plugins: [
        angular({
            tsconfig: 'projects/ngx-chilean-rut/tsconfig.spec.json',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [resolve(__dirname, 'src/test-setup.ts')],
        include: ['**/*.spec.ts'],
        reporters: ['default'],
        server: {
            deps: {
                inline: ['@analogjs/vitest-angular'],
            },
        },
    },
    define: {
        'import.meta.vitest': mode !== 'production',
    },
}));
