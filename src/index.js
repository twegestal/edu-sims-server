import dotenv from 'dotenv';
import { createServer } from './server.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const server = createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});