import { writeFileSync, mkdirSync, rmdirSync, existsSync } from "fs";

// create stub node modules
create("stream");
create("buffer", "buffer-es6", false);
create("events");
create("util");
create("process", "process-es6");

// shim @emotion/cache since patch-package can't
emotionCacheShim();

function create(modName, polyfillName = modName, hasDefault = true) {
  console.log("mocking node library:", modName);

  const packageJson = `{
    "name": "${modName}",
    "version": "1.0.0",
    "main": "index.mjs",
    "license": "MIT"
}`;

  const indexMjs = `
export * from "rollup-plugin-node-polyfills/polyfills/${polyfillName}";
${
  hasDefault &&
  `export { default } from "rollup-plugin-node-polyfills/polyfills/${polyfillName}";`
}
`;

  if (existsSync(`./node_modules/${modName}/`)) {
    rmdirSync(`./node_modules/${modName}/`, { recursive: true });
  }

  mkdirSync(`./node_modules/${modName}/`);
  writeFileSync(`./node_modules/${modName}/package.json`, packageJson);
  writeFileSync(`./node_modules/${modName}/index.mjs`, indexMjs);
}

function emotionCacheShim() {
  const packageJson = `{
  "name": "@emotion/cache",
  "version": "11.7.1",
  "description": "emotion's cache",
  "main": "dist/emotion-cache.cjs.js",
  "module": "dist/emotion-cache.esm.js",
  "browser": {
    "./dist/emotion-cache.cjs.js": "./dist/emotion-cache.cjs.js",
    "./dist/emotion-cache.esm.js": "./dist/emotion-cache.esm.js"
  },
  "types": "types/index.d.ts",
  "license": "MIT",
  "repository": "https://github.com/emotion-js/emotion/tree/main/packages/cache",
  "scripts": {
    "test:typescript": "dtslint types"
  },
  "dependencies": {
    "@emotion/memoize": "^0.7.4",
    "@emotion/sheet": "^1.1.0",
    "@emotion/utils": "^1.0.0",
    "@emotion/weak-memoize": "^0.2.5",
    "stylis": "4.0.13"
  },
  "devDependencies": {
    "@emotion/hash": "*",
    "dtslint": "^0.3.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "src",
    "dist",
    "types/*.d.ts"
  ]
}`;

  writeFileSync(`./node_modules/@emotion/cache/package.json`, packageJson);
}
