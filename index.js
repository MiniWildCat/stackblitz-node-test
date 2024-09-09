const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

// 静态资源访问
app.use(express.static(__dirname + '/public'));

app.use(cors());

// 使用路由解析请求体
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api2/json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(req.body.name);
  res.send({ name: 'Hello World!' });
});

app.get('/api/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', //核心返回数据流
    Connection: 'close',
  });
  const data = fs.readFileSync('./index.txt', 'utf8');
  const list = data.split('');
  const total = data.length;
  let current = 0;
  //mock sse 数据
  let time = setInterval(() => {
    console.log('发送进度', current, total);
    if (current >= total) {
      console.log('已完成发送');
      clearInterval(time);
      return;
    }
    //返回自定义事件名
    res.write(`event:reply\n`);
    // 返回数据
    res.write(`data:${list[current]}\n\n`);
    current++;
  }, 300);
});

app.post('/api/beacon', (req, res) => {
  console.log('123456');
  console.log(req.body);
  res.send('ok');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
