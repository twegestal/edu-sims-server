import dotenv from 'dotenv';
import { createServer } from './server.js';

dotenv.config();
const server = createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});