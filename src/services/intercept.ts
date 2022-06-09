import { request } from 'http';

const option = {
  hostname: 'hpyyb.cn',
  port: 80,
  path: '/api/file/read?path=/logs',
  method: 'GET'
}

const startTime = Date.now();

const req = request(option, res => {
  console.log(res.statusCode);
  console.log(JSON.stringify(res.headers));
  res.on('data', chunk => {
    // console.log(Buffer.from(chunk).toString());
    console.log(Buffer.byteLength(chunk));
  });
  res.on('end', () => {
    console.log('intercept time:', Date.now() - startTime);
  })
})

req.on('error', err => {
  console.log(err);
})

req.end();