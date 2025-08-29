/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  // add more env vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
