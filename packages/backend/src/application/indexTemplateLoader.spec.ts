/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/prefer-query-selector */

import * as execa from "execa";
import * as path from "path";
import { DOMParser } from "xmldom";
import fs from "fs";
import indexTemplateLoader from "./indexTemplateLoader";

describe("Index template", () => {
  const bundleDir = `dist/assets`;

  const oldCwd = process.cwd();

  beforeEach(async () => {
    const { stdout: tempDir } = await execa.command("mktemp -d");
    process.chdir(tempDir);
    fs.mkdirSync(path.join(tempDir, bundleDir), { recursive: true });
  });

  afterEach(async () => {
    await execa.command("rm -rf $PWD");
    process.chdir(oldCwd);
  });

  it("Returns valid HTML", async () => {
    const loader = await indexTemplateLoader();
    const template = loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    expect(parsed.documentElement.nodeName).toEqual("html");
  });

  it("Creates script tags in the body for script assets", async () => {
    const fakeJsString = "if(true) { console.log('this is some Javascript!); }";
    fs.writeFileSync(`${bundleDir}/app.js`, fakeJsString);

    const loader = await indexTemplateLoader();
    const template = loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.getElementsByTagName("head")[0];
    const body = parsed.documentElement.getElementsByTagName("body")[0];
    const scripts = body.getElementsByTagName("script");

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: HTMLLinkElement) => item.getAttribute("rel") === "stylesheet"
    );

    expect(scripts.length).toEqual(3);
    expect(scripts[2].getAttribute("src")).toEqual("/assets/app.js");
    expect(cssLinks.length).toEqual(0);
  });

  it("Creates stylesheet tags in the header for css assets", async () => {
    const fakeCssString = "head { font-size: 1em; }";
    fs.writeFileSync(`${bundleDir}/app.css`, fakeCssString);

    const loader = await indexTemplateLoader();
    const template = loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.getElementsByTagName("head")[0];
    const body = parsed.documentElement.getElementsByTagName("body")[0];
    const scripts = body.getElementsByTagName("script");

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: HTMLLinkElement) => item.getAttribute("rel") === "stylesheet"
    );

    expect(scripts.length).toEqual(4);
    expect(cssLinks.length).toEqual(1);
    expect(cssLinks[0].getAttribute("href")).toEqual("/assets/app.css");
  });

  it("Uses the cached version on subsequent loads", async () => {
    const fakeCssString = "head { font-size: 1em; }";
    fs.writeFileSync(`${bundleDir}/app.css`, fakeCssString);

    const loader = await indexTemplateLoader();
    loader();
    fs.writeFileSync(`${bundleDir}/app2.css`, fakeCssString);
    const template = loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.getElementsByTagName("head")[0];

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: HTMLLinkElement) => item.getAttribute("rel") === "stylesheet"
    );

    expect(cssLinks.length).toEqual(1);
  });
});
