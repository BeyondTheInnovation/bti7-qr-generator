import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { NodeHtmlMarkdown } from "node-html-markdown";

const OUT = join(import.meta.dirname, "..", "out");
const SITE_URL = "https://qr.beyondtheinnovation.com";
const SKIP = new Set(["404.html", "_not-found.html"]);

const converter = new NodeHtmlMarkdown({
  ignore: ["script", "style", "svg", "nav", "footer", "button", "form", "input", "select"],
});

async function htmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html") && !SKIP.has(relative(OUT, path))) files.push(path);
  }
  return files;
}

function absoluteLinks(markdown: string): string {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_, path: string) => `](${SITE_URL}${path})`);
}

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

const GENERATORS = [
  "url",
  "vcard",
  "wifi",
  "email",
  "phone",
  "sms",
  "event",
  "mecard",
  "text",
  "x-profile",
];

function generatorList(): string {
  return GENERATORS.map((type) => `- [${type}](${SITE_URL}/${type})`).join("\n");
}

let written = 0;
for (const file of await htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
  const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1];
  if (!main) continue;
  const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const heading = title ? decode(title) : "";
  let content: string;
  if (/<(input|form|canvas)\b/.test(main) && heading) {
    const lines = [`# ${heading}`, description ? decode(description) : ""];
    if (relative(OUT, file) === "index.html") lines.push("QR code types:", generatorList());
    content = lines.filter(Boolean).join("\n\n");
  } else {
    const body = absoluteLinks(decode(converter.translate(main))).trim();
    if (!body) continue;
    content = /^# /m.test(body) || !heading ? body : `# ${heading}\n\n${body}`;
  }
  await writeFile(file.replace(/\.html$/, ".md"), `${content}\n`);
  written++;
}
console.log(`markdown twins: ${written}`);
