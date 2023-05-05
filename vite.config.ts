import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: "/spotify-loop-player/",
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
});
