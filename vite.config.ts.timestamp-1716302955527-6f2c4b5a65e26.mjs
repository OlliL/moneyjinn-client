// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///mnt/share/git/moneyjinn-client/node_modules/vite/dist/node/index.js";
import vue from "file:///mnt/share/git/moneyjinn-client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve, dirname } from "node:path";
import VueI18nPlugin from "file:///mnt/share/git/moneyjinn-client/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///mnt/share/git/moneyjinn-client/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(
        dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
        "./src/locales/**"
      )
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  base: "/",
  server: {
    host: true,
    watch: {
      usePolling: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L3NoYXJlL2dpdC9tb25leWppbm4tY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L3NoYXJlL2dpdC9tb25leWppbm4tY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvc2hhcmUvZ2l0L21vbmV5amlubi1jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICAvKiBvcHRpb25zICovXG4gICAgICAvLyBsb2NhbGUgbWVzc2FnZXMgcmVzb3VyY2UgcHJlLWNvbXBpbGUgb3B0aW9uXG4gICAgICBpbmNsdWRlOiByZXNvbHZlKFxuICAgICAgICBkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgIFwiLi9zcmMvbG9jYWxlcy8qKlwiXG4gICAgICApLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBiYXNlOiBcIi9cIixcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZVxuICAgIH1cbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUSxTQUFTLGVBQWUsV0FBVztBQUVsVCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsU0FBUyxTQUFTLGVBQWU7QUFDakMsT0FBTyxtQkFBbUI7QUFMNEksSUFBTSwyQ0FBMkM7QUFRdk4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osY0FBYztBQUFBO0FBQUE7QUFBQSxNQUdaLFNBQVM7QUFBQSxRQUNQLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
