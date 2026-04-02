import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const distDir = path.resolve("dist");
const port = 4173;
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon"
};

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run `npm run build` first.");
  process.exit(1);
}

if (!fs.existsSync(edgePath)) {
  console.error(`Edge executable not found: ${edgePath}`);
  process.exit(1);
}

const resolveCandidatePaths = (pathname) => {
  const clean = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  if (!clean) {
    return [path.join(distDir, "index.html")];
  }
  const hasExt = path.extname(clean) !== "";
  if (hasExt) {
    return [path.join(distDir, clean)];
  }
  if (pathname.endsWith("/")) {
    return [path.join(distDir, clean, "index.html")];
  }
  return [path.join(distDir, clean), path.join(distDir, clean, "index.html")];
};

const isInsideDist = (target) => {
  const rel = path.relative(distDir, target);
  return !rel.startsWith("..") && !path.isAbsolute(rel);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  const candidates = resolveCandidatePaths(url.pathname);
  const target = candidates.find((p) => isInsideDist(p) && fs.existsSync(p) && fs.statSync(p).isFile());

  if (!target) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  const ext = path.extname(target).toLowerCase();
  const contentType = contentTypes[ext] ?? "application/octet-stream";
  res.setHeader("Content-Type", contentType);
  fs.createReadStream(target).pipe(res);
});

const walkHtmlFiles = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, files);
      continue;
    }
    if (entry.isFile() && full.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
};

const collectArticlePaths = () => {
  const files = walkHtmlFiles(distDir);
  return files
    .map((file) => path.relative(distDir, file).split(path.sep).join("/"))
    .filter((rel) => /^\d{4}\/\d{2}\/\d{2}\/.+\/index\.html$/.test(rel))
    .map((rel) => `/${rel.replace(/\/index\.html$/, "/")}`);
};

const responsiveChecks = async () => {
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage();
  const basePaths = ["/", "/profile/", "/contactus/", "/privacy/", "/activities/"];
  const articlePaths = collectArticlePaths().slice(0, 2);
  const testPaths = [...basePaths, ...articlePaths];

  const viewports = [
    { width: 375, height: 812, label: "mobile" },
    { width: 768, height: 1024, label: "tablet" },
    { width: 1280, height: 800, label: "desktop" }
  ];

  const failures = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const testPath of testPaths) {
      const target = `http://localhost:${port}${testPath}`;
      await page.goto(target, { waitUntil: "networkidle" });
      const result = await page.evaluate(() => {
        const html = document.documentElement;
        return {
          scrollWidth: html.scrollWidth,
          innerWidth: window.innerWidth
        };
      });
      if (result.scrollWidth > result.innerWidth + 1) {
        failures.push({
          viewport: vp.label,
          path: testPath,
          scrollWidth: result.scrollWidth,
          innerWidth: result.innerWidth
        });
      }
    }
  }

  await browser.close();
  return { failures, testedCount: viewports.length * testPaths.length };
};

const runLighthouseAudit = async () => {
  const chrome = await launch({
    chromePath: edgePath,
    port: 9222,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"]
  });

  try {
    const result = await lighthouse(`http://localhost:${port}/`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"]
    });

    if (!result?.lhr) {
      throw new Error("Lighthouse result is empty.");
    }

    const scores = {
      performance: result.lhr.categories.performance.score ?? 0,
      accessibility: result.lhr.categories.accessibility.score ?? 0,
      bestPractices: result.lhr.categories["best-practices"].score ?? 0,
      seo: result.lhr.categories.seo.score ?? 0
    };

    fs.mkdirSync("reports", { recursive: true });
    fs.writeFileSync("reports/lighthouse-home.json", JSON.stringify(result.lhr, null, 2));

    return scores;
  } finally {
    chrome.kill();
  }
};

const thresholds = {
  performance: 0.7,
  accessibility: 0.9,
  bestPractices: 0.9,
  seo: 0.9
};

server.listen(port, async () => {
  try {
    const responsive = await responsiveChecks();
    const scores = await runLighthouseAudit();

    console.log(`Responsive checks: ${responsive.testedCount} pages/viewports tested`);
    if (responsive.failures.length > 0) {
      console.error("Responsive failures:");
      for (const failure of responsive.failures) {
        console.error(
          `- ${failure.viewport} ${failure.path} scrollWidth=${failure.scrollWidth} innerWidth=${failure.innerWidth}`
        );
      }
    } else {
      console.log("Responsive checks passed (no horizontal overflow).");
    }

    console.log("Lighthouse scores:");
    console.log(`- Performance: ${Math.round(scores.performance * 100)}`);
    console.log(`- Accessibility: ${Math.round(scores.accessibility * 100)}`);
    console.log(`- Best Practices: ${Math.round(scores.bestPractices * 100)}`);
    console.log(`- SEO: ${Math.round(scores.seo * 100)}`);

    const lighthouseFailures = [];
    if (scores.performance < thresholds.performance) lighthouseFailures.push("performance");
    if (scores.accessibility < thresholds.accessibility) lighthouseFailures.push("accessibility");
    if (scores.bestPractices < thresholds.bestPractices) lighthouseFailures.push("best-practices");
    if (scores.seo < thresholds.seo) lighthouseFailures.push("seo");

    if (responsive.failures.length > 0 || lighthouseFailures.length > 0) {
      if (lighthouseFailures.length > 0) {
        console.error(`Lighthouse thresholds not met: ${lighthouseFailures.join(", ")}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("QA checks passed.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
