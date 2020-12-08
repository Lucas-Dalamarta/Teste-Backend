import express, { request, response } from 'express';

import routes from './routes';

const port = 8080;

const app = express();

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`=> Server started on http://localhost:${port}`);
});
