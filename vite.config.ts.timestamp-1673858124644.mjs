// vite.config.ts
import { babel, getBabelOutputPlugin } from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/@rollup/plugin-babel/dist/es/index.js";
import { svelte } from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/@sveltejs/vite-plugin-svelte/dist/index.js";
import { resolve } from "path";
import css from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/rollup-plugin-css-only/dist/index.mjs";
import del from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/rollup-plugin-delete/dist/index.cjs.js";
import topLevelAwait from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/vite-plugin-top-level-await/exports/import.mjs";
import { defineConfig } from "file:///Users/liki/Repos/KaiOS/Kaistodon/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/liki/Repos/KaiOS/Kaistodon";
var isLegacy = !!process.env.IS_LEGACY;
var legacyPlugins = [
  css({ output: "bundle.css" }),
  babel({
    extensions: [".js", ".ts", ".html", ".svelte"],
    babelHelpers: "runtime",
    exclude: ["node_modules/@babel/**"],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      [
        "@babel/plugin-transform-runtime",
        {
          useESModules: true,
          regenerator: false
        }
      ]
    ]
  }),
  getBabelOutputPlugin({
    allowAllFormats: true,
    presets: [
      [
        "@babel/preset-env",
        {
          targets: { firefox: "48" },
          exclude: ["@babel/plugin-transform-regenerator"]
        }
      ]
    ]
  }),
  del({ targets: ["dist/*.webmanifest"], hook: "generateBundle" })
];
var legacyExtraConfig = {
  css: {
    postcss: true
  },
  build: {
    target: "es2015",
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "iife",
        dir: resolve(__vite_injected_original_dirname, "dist"),
        entryFileNames: `bundle.js`,
        chunkFileNames: `bundle.js`,
        assetFileNames: `bundle.[ext]`
      },
      context: "window"
    }
  }
};
var vite_config_default = defineConfig({
  plugins: [
    svelte(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: (i) => `__tla_${i}`
    }),
    ...isLegacy ? legacyPlugins : []
  ],
  build: {
    rollupOptions: {
      output: {
        name: "app",
        entryFileNames: `bundle.[hash].js`,
        chunkFileNames: `bundle.[hash].js`,
        assetFileNames: `bundle.[hash].[ext]`
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    port: 5173
  },
  ...isLegacy && legacyExtraConfig
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGlraS9SZXBvcy9LYWlPUy9LYWlzdG9kb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saWtpL1JlcG9zL0thaU9TL0thaXN0b2Rvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGlraS9SZXBvcy9LYWlPUy9LYWlzdG9kb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBiYWJlbCwgZ2V0QmFiZWxPdXRwdXRQbHVnaW4gfSBmcm9tICdAcm9sbHVwL3BsdWdpbi1iYWJlbCc7XG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBjc3MgZnJvbSAncm9sbHVwLXBsdWdpbi1jc3Mtb25seSc7XG5pbXBvcnQgZGVsIGZyb20gJ3JvbGx1cC1wbHVnaW4tZGVsZXRlJztcbmltcG9ydCB0b3BMZXZlbEF3YWl0IGZyb20gJ3ZpdGUtcGx1Z2luLXRvcC1sZXZlbC1hd2FpdCc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBpc0xlZ2FjeSA9ICEhcHJvY2Vzcy5lbnYuSVNfTEVHQUNZO1xuXG5jb25zdCBsZWdhY3lQbHVnaW5zID0gW1xuICAvLyB3ZSdsbCBleHRyYWN0IGFueSBjb21wb25lbnQgQ1NTIG91dCBpbnRvXG4gIC8vIGEgc2VwYXJhdGUgZmlsZSAtIGJldHRlciBmb3IgcGVyZm9ybWFuY2VcbiAgY3NzKHsgb3V0cHV0OiAnYnVuZGxlLmNzcycgfSksXG4gIGJhYmVsKHtcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICcudHMnLCAnLmh0bWwnLCAnLnN2ZWx0ZSddLFxuICAgIGJhYmVsSGVscGVyczogJ3J1bnRpbWUnLFxuICAgIGV4Y2x1ZGU6IFsnbm9kZV9tb2R1bGVzL0BiYWJlbC8qKiddLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICdAYmFiZWwvcGx1Z2luLXN5bnRheC1keW5hbWljLWltcG9ydCcsXG4gICAgICBbXG4gICAgICAgICdAYmFiZWwvcGx1Z2luLXRyYW5zZm9ybS1ydW50aW1lJyxcbiAgICAgICAge1xuICAgICAgICAgIHVzZUVTTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgICByZWdlbmVyYXRvcjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIF0sXG4gIH0pLFxuICAvLyB2aXRlIHRyYW5zcGlyZSB0byBlczU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS9pc3N1ZXMvMTA5ODEjaXNzdWVjb21tZW50LTEzMjEzODMxMTRcbiAgZ2V0QmFiZWxPdXRwdXRQbHVnaW4oe1xuICAgIGFsbG93QWxsRm9ybWF0czogdHJ1ZSxcbiAgICBwcmVzZXRzOiBbXG4gICAgICBbXG4gICAgICAgICdAYmFiZWwvcHJlc2V0LWVudicsXG4gICAgICAgIHtcbiAgICAgICAgICB0YXJnZXRzOiB7IGZpcmVmb3g6ICc0OCcgfSxcbiAgICAgICAgICBleGNsdWRlOiBbJ0BiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJlZ2VuZXJhdG9yJ10sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIF0sXG4gIH0pLFxuICBkZWwoeyB0YXJnZXRzOiBbJ2Rpc3QvKi53ZWJtYW5pZmVzdCddLCBob29rOiAnZ2VuZXJhdGVCdW5kbGUnIH0pLFxuXTtcblxuY29uc3QgbGVnYWN5RXh0cmFDb25maWcgPSB7XG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHRydWUsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogJ3NyYy9tYWluLnRzJyxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgZGlyOiByZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBidW5kbGUuanNgLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogYGJ1bmRsZS5qc2AsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgYnVuZGxlLltleHRdYCxcbiAgICAgIH0sXG4gICAgICBjb250ZXh0OiAnd2luZG93JyxcbiAgICB9LFxuICB9LFxufTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoKSxcbiAgICB0b3BMZXZlbEF3YWl0KHtcbiAgICAgIC8vIFRoZSBleHBvcnQgbmFtZSBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBmb3IgZWFjaCBjaHVuayBtb2R1bGVcbiAgICAgIHByb21pc2VFeHBvcnROYW1lOiAnX190bGEnLFxuICAgICAgLy8gVGhlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGltcG9ydCBuYW1lcyBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBpbiBlYWNoIGNodW5rIG1vZHVsZVxuICAgICAgcHJvbWlzZUltcG9ydE5hbWU6IChpKSA9PiBgX190bGFfJHtpfWAsXG4gICAgfSksXG4gICAgLi4uKGlzTGVnYWN5ID8gbGVnYWN5UGx1Z2lucyA6IFtdKSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAvLyBAdHMtaWdub3JlOiBuZXh0LWxpbmVcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBidW5kbGUuW2hhc2hdLmpzYCxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBidW5kbGUuW2hhc2hdLmpzYCxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGBidW5kbGUuW2hhc2hdLltleHRdYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgfSxcbiAgLi4uKGlzTGVnYWN5ICYmIGxlZ2FjeUV4dHJhQ29uZmlnKSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixTQUFTLE9BQU8sNEJBQTRCO0FBQ2pVLFNBQVMsY0FBYztBQUN2QixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUNoQixPQUFPLG1CQUFtQjtBQUUxQixTQUFTLG9CQUFvQjtBQVA3QixJQUFNLG1DQUFtQztBQVN6QyxJQUFNLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUUvQixJQUFNLGdCQUFnQjtBQUFBLEVBR3BCLElBQUksRUFBRSxRQUFRLGFBQWEsQ0FBQztBQUFBLEVBQzVCLE1BQU07QUFBQSxJQUNKLFlBQVksQ0FBQyxPQUFPLE9BQU8sU0FBUyxTQUFTO0FBQUEsSUFDN0MsY0FBYztBQUFBLElBQ2QsU0FBUyxDQUFDLHdCQUF3QjtBQUFBLElBQ2xDLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxjQUFjO0FBQUEsVUFDZCxhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQUEsRUFHRCxxQkFBcUI7QUFBQSxJQUNuQixpQkFBaUI7QUFBQSxJQUNqQixTQUFTO0FBQUEsTUFDUDtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxTQUFTLEVBQUUsU0FBUyxLQUFLO0FBQUEsVUFDekIsU0FBUyxDQUFDLHFDQUFxQztBQUFBLFFBQ2pEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFBQSxFQUNELElBQUksRUFBRSxTQUFTLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRTtBQUVBLElBQU0sb0JBQW9CO0FBQUEsRUFDeEIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxNQUNQLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQUEsUUFDOUIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsY0FBYztBQUFBLE1BRVosbUJBQW1CO0FBQUEsTUFFbkIsbUJBQW1CLENBQUMsTUFBTSxTQUFTO0FBQUEsSUFDckMsQ0FBQztBQUFBLElBQ0QsR0FBSSxXQUFXLGdCQUFnQixDQUFDO0FBQUEsRUFDbEM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUViLFFBQVE7QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsR0FBSSxZQUFZO0FBQ2xCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
