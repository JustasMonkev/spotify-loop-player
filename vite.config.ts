import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.NODE_ENV === 'production' ? '/spotify-loop-player/spotify/' : '/';

export default defineConfig({
    base,
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
});
