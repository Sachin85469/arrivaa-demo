const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const websiteDir = fs.existsSync(path.resolve(__dirname, '..', '..', 'website'))
  ? path.resolve(__dirname, '..', '..', 'website')
  : path.resolve(__dirname, '..', 'website');
const reportsDir = path.resolve(__dirname, '..', '..', 'dev', 'tools');
const httpPort = 8089;

function createStaticServer(rootDir, port) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    let relativePath = reqPath.replace(/^\/+/, '');
    let filePath = path.join(rootDir, relativePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!reqPath.endsWith('/')) {
        res.writeHead(301, { Location: reqPath + '/' });
        return res.end();
      }
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFoundPath = path.join(rootDir, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runLighthouseForUrl(url, reportName) {
  const reportPath = path.join(reportsDir, reportName);
  console.log(`Running Lighthouse for ${url}...`);
  const cmd = `npx lighthouse ${url} --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="${reportPath}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet`;
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 120000 });
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const categories = data.categories;
    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100)
    };
    console.log(`SCORES for ${url}:`);
    console.log(`  Performance:    ${scores.performance}`);
    console.log(`  Accessibility:  ${scores.accessibility}`);
    console.log(`  Best Practices: ${scores.bestPractices}`);
    console.log(`  SEO:            ${scores.seo}`);
    return scores;
  } catch (err) {
    console.error(`Error running lighthouse for ${url}:`, err.message);
    return null;
  }
}

async function main() {
  const server = await createStaticServer(websiteDir, httpPort);
  console.log(`Server started on http://localhost:${httpPort}`);

  try {
    await runLighthouseForUrl(`http://localhost:${httpPort}/`, 'lighthouse-home.json');
    await runLighthouseForUrl(`http://localhost:${httpPort}/tourist-guide/`, 'lighthouse-tourist-guide.json');
  } finally {
    server.close();
    console.log('Server stopped.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
