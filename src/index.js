import { createServer } from './server';

const server = createServer();

server.listen(3000, () => {
  console.log('server listening on port 3000');
});