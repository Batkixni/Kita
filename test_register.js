const fetch = require('http').request;

const data = JSON.stringify({
    email: "testuser" + Date.now() + "@example.com",
    password: "password123",
    name: "Test User",
    username: "testuser" + Date.now()
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/sign-up/email',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = fetch(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
