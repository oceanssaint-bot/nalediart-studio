// A plain static server for previewing docs/ locally.  node site/serve.js
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'docs');
const TYPES = { '.html':'text/html', '.webp':'image/webp', '.png':'image/png',
                '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
http.createServer(function (req, res) {
  let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(4173, function () { console.log('docs/ on http://localhost:4173'); });
