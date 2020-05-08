import { PRODUCTION_MODE_STRING } from "./constants";
import { default as fsWithCallbacks } from "fs";
const fs = fsWithCallbacks.promises;
import path from "path";
import pretty from "pretty";

const reactCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react@16/umd/react.production.min.js"
    : "https://unpkg.com/react@16/umd/react.development.js";

const reactDomCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
    : "https://unpkg.com/react-dom@16/umd/react-dom.development.js";

const getItems = async (assetsDir: string): Promise<string[]> => {
  try {
    return await fs.readdir(assetsDir);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    return [];
  }
};

const getScripts = (items: string[]): string[] => {
  const scripts = items.filter((item) => item.endsWith(".js"));

  if (scripts.length !== 0) {
    return scripts;
  }

  return ["app.js", "vendor.js"];
};

const indexTemplateLoader = async (): Promise<() => string> => {
  const assetsDir = path.join(process.cwd(), "dist", "assets");
  const items = await getItems(assetsDir);
  const scripts = getScripts(items);
  const scriptsString = scripts
    .map(
      (item) =>
        `<script src="/assets/${item}" type="application/javascript"></script>`
    )
    .join("\n");

  const css = items.filter((item) => item.endsWith(".css"));
  const cssString = css
    .map((item) => `<link rel="stylesheet" href="/assets/${item}" />`)
    .join("\n");

  const indexFile = pretty(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Hello React!</title>
            ${cssString}
          </head>
          <body>
            <div id="root"></div>
            <script src="${reactCdnPath}" type="text/javascript"></script>
            <script src="${reactDomCdnPath}" type="text/javascript"></script>
            ${scriptsString}
          </script>
          </body>
          </html>`);

  return (): string => indexFile;
};

export default indexTemplateLoader;
