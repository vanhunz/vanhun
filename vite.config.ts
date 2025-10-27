import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/vanhun/", // ✅ bắt buộc có để GitHub Pages nhận đúng thư mục
  server: {
    host: "0.0.0.0", // 👈 thay "::" bằng "0.0.0.0" để tương thích Windows
    port: 8080,
  },
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
