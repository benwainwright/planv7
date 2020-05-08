import { PRODUCTION_MODE_STRING } from "./constants";
import { default as fsWithCallbacks } from "fs";
const fs = fsWithCallbacks.promises;
import path from "path";
import pretty from "pretty";
export const reactCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react@16/umd/react.production.min.js"
    : "https://unpkg.com/react@16/umd/react.development.js";

export const reactDomCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
    : "https://unpkg.com/react-dom@16/umd/react-dom.development.js";

export const indexTemplateLoader = (
  externalScripts?: string[],
  externalCss?: string[]
) => {
  const assetsDir = path.join(process.cwd(), "dist", "assets");

  let cachedIndexFile: string | undefined = undefined;

  return async () => {
    return new Promise<string>(async resolve => {
      if (!cachedIndexFile) {
        let items: string[] = [];
        try {
          items = await fs.readdir(assetsDir);
        } catch (error) {
          if (process.env.NODE_ENV === "production") {
            throw error;
          }
        }

        let scripts = items.filter(item => item.endsWith(".js"));

        if (scripts.length === 0) {
          scripts = ["app.js", "vendor.js"];
        }

        if (externalScripts) {
          scripts = [...scripts, ...externalScripts];
        }

        scripts = scripts.map(item =>
          item.startsWith("http") ? item : `/assets/${item}`
        );

        const scriptsString = scripts
          .map(
            item =>
              `<script src="${item}" type="application/javascript"></script>`
          )
          .join("\n");

        let css = items.filter(item => item.endsWith(".css"));

        if (externalCss) {
          css = [...css, ...externalCss];
        }

        css = css.map(item =>
          item.startsWith("http") ? item : `/assets/${item}`
        );

        const cssString = css
          .map(item => `<link rel="stylesheet" href="${item}" />`)
          .join("\n");

        cachedIndexFile = pretty(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Hello React!</title>
            ${cssString}
          </head>
          <body>
            <div id="root"></div>
            ${scriptsString}
          </body>
          </html>`);
      }

      if (cachedIndexFile) {
        resolve(cachedIndexFile);
        
      }
    });
  };
};
