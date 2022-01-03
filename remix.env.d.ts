/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-pages/globals" />
/// <reference types="@cloudflare/workers-types" />

declare interface CloudflareEnv {
  MINECRAFT_UUIDS: KVNamespace;
  VOXYL_CACHE: KVNamespace;
  API_KEY: string;
}
