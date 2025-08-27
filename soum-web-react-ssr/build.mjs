import { build } from "esbuild";
import postCssPlugin from "esbuild-style-plugin";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { copy } from "esbuild-plugin-copy";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

(async () => {
  const define = {};

  for (const key in env) {
    if (key.startsWith("REACT_APP_")) {
      define[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  define["process.env.NODE_ENV"] = JSON.stringify(
    process.env.NODE_ENV ?? "development"
  );

  // Build client code
  await build({
    entryPoints: ["./src/client/index.tsx"],
    bundle: true,
    splitting: true,
    format: "esm",
    minify: true,
    treeShaking: true,
    sourcemap: true,
    outdir: "./build/public",
    platform: "browser",
    target: "es2017",
    define,
    external: ["@public"],
    plugins: [
      postCssPlugin({
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
    ],
    loader: {
      ".ttf": "file",
      ".png": "file",
      ".jpg": "file",
      ".eot": "file",
      ".woff": "file",
      ".svg": "file",
    },
    assetNames: "assets/[ext]/[name]-[hash]",
  });

  // Build server code
  await build({
    entryPoints: ["./src/server/index.tsx"],
    bundle: true,
    sourcemap: true,
    outfile: "./build/server.js",
    platform: "node",
    target: "es2020",
    external: ["react", "react-dom", "@public"],
    define,
    plugins: [
      copy({
        assets: [
          {
            from: ["./public/**/*"],
            to: ["./public"],
          },
        ],
      }),
    ],
    loader: {
      ".ttf": "file",
      ".png": "file",
      ".jpg": "file",
      ".eot": "file",
      ".woff": "file",
      ".svg": "file",
    },
    assetNames: "public/assets/[ext]/[name]-[hash]",
  });

  console.log("Build completed!");
})();
