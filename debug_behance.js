
const https = require('https');

// const targetUrl = 'https://www.behance.net/adobe'; // Profile
// Try a project url too? User provided profile.
const targetUrl = 'https://www.behance.net/adobe';
const url = `https://www.behance.net/services/oembed?url=${encodeURIComponent(targetUrl)}`;

console.log("Fetching OEmbed " + url);

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
}, (res) => {
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Data:', data);
    });
}).on('error', (e) => {
    console.error(e);
});
