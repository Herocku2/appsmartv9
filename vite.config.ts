import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: [
				"favicon.ico",
				"robots.txt",
				"apple-touch-icon.png",
				"Asset1.png",
				"pwa-192x192.png",
				"pwa-512x512.png"
			],
			manifest: {
				name: "Smart Solution Fund",
				short_name: "SmartApp",
				description: "Aplicación React conectada al backend Smart Solution Fund.",
				theme_color: "#0d9488",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				scope: "/",
				orientation: "portrait",
				display_override: ["standalone", "fullscreen"],
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable"
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				]
			},
			workbox: {
				navigateFallback: "/index.html",
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
						handler: "NetworkFirst",
						options: {
							cacheName: "api-cache"
						}
					},
					{
						urlPattern: ({ request }) => request.destination === "document",
						handler: "NetworkFirst",
						options: {
							cacheName: "pages-cache"
						}
					}
				]
			},
			devOptions: {
				enabled: true,
				type: "module"
			}
		})
	],
	define: { "process.env": {} },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		host: true,
		cors: false,
		proxy: {
			"/api": {
				target: "https://backend.smartsolution.fund",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
				configure: (proxy, options) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// Agregar headers necesarios
						proxyReq.setHeader('Origin', 'https://backend.smartsolution.fund');
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						// Log para debugging (opcional)
						if (process.env.NODE_ENV === 'development') {
							console.log('Proxy response:', req.method, req.url, proxyRes.statusCode);
						}
					});
				}
			}
		}
	},
	build: {
		outDir: "dist"
	}
});
