import { DOMParser } from "xmldom";
import fs from "fs";
import { indexTemplateLoader } from "./indexTemplate";

jest.mock("fs", () => require("../../tests/utils/fsMock").mock());

describe("Index template", () => {
  const mockBundleDir = `${process.cwd()}/dist/assets`;

  beforeEach(() => {
    fs.mkdirSync(mockBundleDir, { recursive: true });
  });

  afterEach(() => {
    require("../../tests/utils/fsMock").reset();
  });

  it("Returns valid HTML", async () => {
    const loader = indexTemplateLoader();
    const template = await loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    expect(parsed.documentElement.nodeName).toEqual("html");
  });

  it("Creates script tags in the body for script assets", async () => {
    const fakeJsString = "if(true) { console.log('this is some Javascript!); }";
    fs.writeFileSync(`${mockBundleDir}/app.js`, fakeJsString);

    const loader = indexTemplateLoader();
    const template = await loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.querySelectorAll("head")[0];
    const body = parsed.documentElement.querySelectorAll("body")[0];
    const scripts = body.querySelectorAll("script");

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: any) => item.getAttribute("rel") === "stylesheet"
    );

    expect(scripts.length).toEqual(1);
    expect(scripts[0].getAttribute("src")).toEqual("/assets/app.js");
    expect(cssLinks.length).toEqual(0);
  });

  it("Creates stylesheet tags in the header for css assets", async () => {
    const fakeCssString = "head { font-size: 1em; }";
    fs.writeFileSync(`${mockBundleDir}/app.css`, fakeCssString);

    const loader = indexTemplateLoader();
    const template = await loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.querySelectorAll("head")[0];
    const body = parsed.documentElement.querySelectorAll("body")[0];
    const scripts = body.querySelectorAll("script");

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: any) => item.getAttribute("rel") === "stylesheet"
    );

    expect(scripts.length).toEqual(1);
    expect(cssLinks.length).toEqual(1);
    expect(cssLinks[0].getAttribute("href")).toEqual("/assets/app.css");
  });

  it("Uses the cached version on subsequent loads", async () => {
    const fakeCssString = "head { font-size: 1em; }";
    fs.writeFileSync(`${mockBundleDir}/app.css`, fakeCssString);

    const loader = indexTemplateLoader();
    await loader();
    fs.writeFileSync(`${mockBundleDir}/app2.css`, fakeCssString);
    const template = await loader();
    const parser = new DOMParser();
    const parsed = parser.parseFromString(template, "text/xml");
    const head = parsed.documentElement.querySelectorAll("head")[0];

    const cssLinks = Array.from(head.getElementsByTagName("link")).filter(
      (item: any) => item.getAttribute("rel") === "stylesheet"
    );

    expect(cssLinks.length).toEqual(1);
  });
});
