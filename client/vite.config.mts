import { fileURLToPath } from 'url';
import { UserConfig, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
    const { VITE_APP_PORT } = loadEnv(mode, process.cwd());

    const APP_PORT = Number(VITE_APP_PORT) ?? 4173;

    const config: UserConfig = {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        plugins: [
            react()
        ],
        server: {
            host: true,
            port: APP_PORT
        }
    };
    return config;
});