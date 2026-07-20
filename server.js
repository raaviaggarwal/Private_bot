// Node.js Backend Server for Amberleigh Private Bank Assistant Portal
// Serves web assets, configuration API, and live policy JSON files from the /data directory.

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  // Log request
  console.log(`[Backend Server] ${req.method} ${req.url}`);
  
  // Clean URL path
  let safePath = req.url.split('?')[0];
  
  // API Endpoint: Serve env configurations securely to the local frontend client
  if (safePath === '/api/config') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      geminiApiKey: process.env.GEMINI_API_KEY || "",
      adminPasscode: process.env.ADMIN_PASSCODE || "DBAdmin2026"
    }), 'utf-8');
    return;
  }
  
  if (safePath === '/') safePath = '/index.html';
  
  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Read file from disk
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Policy / Page Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`  Amberleigh Private Bank Backend Server Running!          `);
  console.log(`  Access URL : http://localhost:${PORT}                    `);
  console.log(`  Data Directory: ${path.join(__dirname, 'data')}         `);
  console.log(`  Live JSON Files:                                         `);
  console.log(`   - data/onboarding_guide.json                            `);
  console.log(`   - data/expense_travel_policy.json                       `);
  console.log(`   - data/medical_health_benefits.json                     `);
  console.log(`   - data/infosec_data_privacy.json                        `);
  console.log(`   - data/compliance_aml_kyc.json                          `);
  console.log(`   - data/code_of_conduct_ethics.json                      `);
  console.log(`   - data/hr_policy_handbook.json                          `);
  console.log(`   - data/corporate_overview.json                          `);
  console.log(`===========================================================`);
});
