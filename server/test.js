const http = require('http');

const body = JSON.stringify({ removeAvatar: 'true' });
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/profile',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Body:', data));
});

req.on('error', e => console.error(e));
req.write(body);
req.end();
