/// <reference types="vite/client" />

declare interface ImportMetaEnv {
    readonly VITE_URL: string;
    readonly VITE_PORT: string;
    // Add other environment variables as needed
}

declare interface ImportMeta {
    readonly env: ImportMetaEnv;
}