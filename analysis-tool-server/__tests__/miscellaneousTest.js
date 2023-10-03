const axios = require('axios');
const { v4: uuid } = require('uuid');
const to = require('../lib/to');
const https = require('https');

const REMOTE_API_URL = `http://localhost:3001`;

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

describe('Miscellaneous', () => {
  describe('with non-existent route', () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`${REMOTE_API_URL}/${uuid()}`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test('return a status of 404', () => expect(response.status).toBe(404));
    test('should return status text - Not Found', () =>
      expect(response.statusText).toBe('Not Found'));
  });

  describe('with cors header', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test('return a status of 200', () => expect(response.status).toBe(200));
    test('should return status text - OK', () =>
      expect(response.statusText).toBe('OK'));
    test('should return access-control-allow-origin in headers', () =>
      expect(response.headers).toHaveProperty('access-control-allow-origin'));
  });

  describe('with suppressed x-powered-by header', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test('return a status of 200', () => expect(response.status).toBe(200));
    test('should return status text - OK', () =>
      expect(response.statusText).toBe('OK'));
    test('should not x-powered-by header property', () =>
      expect(response.headers).not.toHaveProperty('x-powered-by'));
  });
});