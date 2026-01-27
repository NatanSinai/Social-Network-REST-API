import { beforeAll, describe, expect, it } from '@jest/globals';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { envVar } from '.';
import { appRouter } from './app.controller';

describe('appRouter', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use('/', appRouter);
  });

  it('should return welcome message with version', async () => {
    const response = await request(app).get('');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.text).toBe(`Welcome to NASH API (v${envVar.npm_package_version})`);
  });
});
