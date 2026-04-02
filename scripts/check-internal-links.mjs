import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const htmlFiles = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.isFile() && full.endsWith(".html")) {
      htmlFiles.push(full);
    }
  }
};

const toPosix = (p) => p.split(path.sep).join("/");

const resolveTarget = (urlPath) => {
  const cleaned = urlPath.split("#")[0].split("?")[0];
  if (!cleaned.startsWith("/")) {
    return null;
  }
  const decoded = cleaned
    .split("/")
    .map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    })
    .join("/");
  const raw = decoded.slice(1);
  if (!raw) {
    return path.join(distDir, "index.html");
  }
  if (raw.endsWith("/")) {
    return path.join(distDir, raw, "index.html");
  }
  if (path.extname(raw)) {
    return path.join(distDir, raw);
  }
  return path.join(distDir, raw, "index.html");
};

walk(distDir);

const broken = [];
const attrRegex = /\b(?:href|src)=["']([^"']+)["']/gi;

for (const file of htmlFiles) {
  const rel = toPosix(path.relative(distDir, file));
  const html = fs.readFileSync(file, "utf8");
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const url = match[1];
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("#") ||
      url.startsWith("data:")
    ) {
      continue;
    }

    const target = resolveTarget(url);
    if (!target) {
      continue;
    }
    if (!fs.existsSync(target)) {
      broken.push({
        from: rel,
        url,
        expected: toPosix(path.relative(process.cwd(), target))
      });
    }
  }
}

if (broken.length > 0) {
  console.error(`Broken internal links: ${broken.length}`);
  for (const item of broken) {
    console.error(`- from: ${item.from}`);
    console.error(`  url: ${item.url}`);
    console.error(`  expected: ${item.expected}`);
  }
  process.exit(1);
}

console.log(`OK: internal links checked (${htmlFiles.length} html files, 0 broken)`);
