import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    headers: {
      "X-Frame-Options": "ALLOWALL"
    },
    cors: true,
    proxy: {
      '/engine-rest': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"]
  }
});