interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BASE: string
  readonly VITE_HOST: string
  readonly VITE_PORT: string
  readonly VITE_ALLOWED_HOST_1: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}