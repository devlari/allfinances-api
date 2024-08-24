import { HttpResponse } from './http';
import logger from '@/tools/logger';

export const badRequest = (error: Error): HttpResponse => {
  logger.warn(`RESPONSE Bad request: ${error.message}`);

  return {
    statusCode: 400,
    body: { errorMessage: error.message }
  };
};
export const notFound = (error?: Error): HttpResponse => {
  logger.warn(`RESPONSE Not found: ${error?.message || 'not found'}`);

  return {
    statusCode: 404,
    body: { errorMessage: error?.message || 'not found' }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ok = (data: any): HttpResponse => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug(`RESPONSE Success: ${JSON.stringify(data)}`);
  }

  return {
    statusCode: 200,
    body: data
  };
};

export const serverError = (
  error: Error | unknown,
  info = ''
): HttpResponse => {
  let message = 'Problemas em processar a requisição pelo servidor';
  let stack = '';

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack ?? '';
  }

  logger.error(`RESPONSE ${message} ${info} ${stack}`.trim());

  return {
    statusCode: 500,
    body: { errorMessage: message }
  };
};

export const unauthorized = (error: Error): HttpResponse => {
  logger.warn(`RESPONSE Unauthorized: ${error.message}`);

  return {
    statusCode: 401,
    body: { errorMessage: error.message }
  };
};

export const forbidden = (error?: Error): HttpResponse => {
  logger.warn(`RESPONSE Forbidden: ${error?.message || ''}`);

  return {
    statusCode: 403,
    body: { errorMessage: error?.message || '' }
  };
};

export const created = (data: any): HttpResponse => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug(`RESPONSE Success: ${JSON.stringify(data)}`);
  }

  return {
    statusCode: 201,
    body: data
  };
};

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
