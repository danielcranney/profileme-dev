const fs = require('fs');
const https = require('https');

const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

https.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, {
  headers: { 'User-Agent': 'badge-bot' }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const issues = JSON.parse(data).filter(issue => !issue.pull_request);
    const count = issues.length;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <rect width="120" height="20" fill="#555"/>
  <rect x="60" width="60" height="20" fill="#4c1"/>
  <text x="30" y="14" fill="#fff" font-size="11">issues</text>
  <text x="90" y="14" fill="#fff" font-size="11">${count}</text>
</svg>`;

    fs.writeFileSync('badge.svg', svg);
    console.log(`Badge updated: ${count} open issues.`);
  });
});
