import { writeFileSync, mkdirSync, rmSync } from "fs";

create("stream");
create("buffer", "buffer-es6", false);
create("events");
create("util");
create("process", "process-es6");

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

  rmSync(`./node_modules/${modName}/`, { recursive: true, force: true });
  mkdirSync(`./node_modules/${modName}/`);
  writeFileSync(`./node_modules/${modName}/package.json`, packageJson);
  writeFileSync(`./node_modules/${modName}/index.mjs`, indexMjs);
}
