import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {ghPages} from 'vite-plugin-gh-pages';

export default defineConfig({
    base: '/spotify-loop-player/', // Replace with your GitHub Pages repository name
    plugins: [react(), ghPages()],
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
});
