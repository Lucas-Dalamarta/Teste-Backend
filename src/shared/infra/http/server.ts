import express, { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

import routes from './routes';

const port = 8080;

const app = express();

app.use('/', routes);

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`=> Server started on http://localhost:${port}`);
});
''
