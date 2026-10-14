import {createServer} from 'node:http';
import { json } from 'node:stream/consumers';

const server = createServer((req, res) => {
  switch(req.url){
    case "/": 
      res.writeHead(200, {'Content-Type': 'aplication/json'});
      res.end(JSON.stringify({ message: 'Welcome to Campus Events'}));
      break;
    case "/time": 
      res.writeHead(200, {'Content-Type': 'aplication/json'});
      res.end(JSON.stringify({now: new Date().toISOString()}));
      break;
    default: 
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Not found" }));  
      break;
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});