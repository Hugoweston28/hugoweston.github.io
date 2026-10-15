import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ command }) => ({
  root: resolve(projectRoot, 'app'),
  // GitHub Pages 部署在 https://hugoweston28.github.io/hugoweston.github.io/ 子路径下，
  // 构建时必须带 base，否则资源 404 白屏；本地 dev 仍用根路径，保持 localhost:5173/ 不变。
  base: command === 'build' ? '/hugoweston.github.io/' : '/',
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    // 微信 / QQ 内置浏览器用的是腾讯 X5 内核，老机型仍停留在 Chrome 77 上下，
    // 而 Vite 默认 target 是 es2020（需要 Chrome 87+）。降到 es2018 可避免
    // 低版本内核直接抛 SyntaxError 导致整页白屏。
    target: 'es2018',
  },
}));
