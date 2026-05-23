/// <reference types="vite/client" />

// Allow importing CSS files as side-effect modules in TypeScript
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// If Vite types are not picked up for some toolchains, provide minimal ImportMeta typing
interface ImportMetaEnv {
	readonly BASE_URL?: string;
	// add other env vars here as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
