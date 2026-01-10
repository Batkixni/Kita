
const https = require('https');
const fs = require('fs');

const username = 'torvalds';
const url = `https://github.com/users/${username}/contributions`;

console.log("Fetching " + url);

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
}, (res) => {
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('github_dump.html', data);
        console.log('Dumped to github_dump.html');
    });
}).on('error', (e) => {
    console.error(e);
});
