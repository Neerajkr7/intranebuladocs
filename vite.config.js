import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/intranebuladocs/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
