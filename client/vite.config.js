import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,

    proxy: {
      "/api": {
        target: "http://import.meta.env.VITE_API_URL",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});