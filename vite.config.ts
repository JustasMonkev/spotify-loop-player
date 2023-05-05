import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

const base = '/';

export default defineConfig({
    base,
    plugins: [react()],
})
