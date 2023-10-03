const https = require('https');
const axios = require('axios');
const to = require('../lib/to');
const faker = require('faker');
const { between } = require('../lib/util');
const fs = require('fs');

const REMOTE_API_URL = `http://localhost:3001`;

const WORDS = faker.lorem.words(500);
const TITLE_MIN_CHARS = 5;
const TITLE_MAX_CHARS = 100;
const DESCRIPTION_MIN_CHARS = 0;
const DESCRIPTION_MAX_CHARS = 250;
const NAME_MIN_CHARS = 1;
const NAME_MAX_CHARS = 50;
const DURATION_MIN_NUM = 0;
const DURATION_MAX_NUM = 7200;

let validMatchId = '';

const getValidMatch = () => {
  return {
    title: WORDS.substring(0, between(TITLE_MIN_CHARS, TITLE_MAX_CHARS)),
    description: WORDS.substring(0, between(DESCRIPTION_MIN_CHARS + 1, DESCRIPTION_MAX_CHARS)),
    players: {
      player1: {
        firstName: WORDS.substring(0, between(NAME_MIN_CHARS, NAME_MAX_CHARS)),
        lastName: WORDS.substring(0, between(NAME_MIN_CHARS, NAME_MAX_CHARS)),
      },
      player2: {
        firstName: WORDS.substring(0, between(NAME_MIN_CHARS, NAME_MAX_CHARS)),
        lastName: WORDS.substring(0, between(NAME_MIN_CHARS, NAME_MAX_CHARS)),
      },
    },
    duration: between(DURATION_MIN_NUM, DURATION_MAX_NUM),
  }
}

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

describe('Match', () => {
  describe('create match', () => {
    describe('create a valid match with description', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/match/new`, getValidMatch())
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test('should return a status of 200', () =>
        expect(response.status).toBe(200));
      test('should return status text - OK', () =>
        expect(response.statusText).toBe('OK'));
      test('should return type Object', () =>
        expect(typeof response.data).toEqual('object'));
      test('should return a non-empty Object', () =>
        expect(response.data).toBeTruthy());
      test('should contain the match id as type String', () =>
        expect(typeof response.data.match_id).toEqual('string'));
      test('should contain the match id as non-empty String', () =>
        expect(response.data.match_id).toBeTruthy());

      afterAll(() => {
        // store valid match id for later use
        validMatchId = response.data.match_id;
        // copy test video file to video upload location
        fs.copyFile(
          './__tests__/test_videos/test_video.mp4',
          `./videos/${validMatchId}.mp4`,
          fs.constants.COPYFILE_EXCL,
          (err) => { err ? console.log(err) : null }
        );
      });
    });
  });

  describe('get match', () => {
    describe('get a valid match', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/match/${validMatchId}/get`)
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test('should return a status of 200', () =>
        expect(response.status).toBe(200));
      test('should return status text - OK', () =>
        expect(response.statusText).toBe('OK'));
      test('should return type Object', () =>
        expect(typeof response.data).toEqual('object'));
      test('should return a non-empty Object', () =>
        expect(response.data).toBeTruthy());
      test('should contain the match id type String', () =>
        expect(typeof response.data.id).toEqual('string'));
      test('should contain the match id as non-empty String', () =>
        expect(response.data.id).toBeTruthy());
      test('should contain the match title as type String', () =>
        expect(typeof response.data.title).toEqual('string'));
      test('should contain the match title as non-empty String', () =>
        expect(response.data.title).toBeTruthy());
      test('should contain the match players as type Object', () =>
        expect(typeof response.data.players).toEqual('object'));
      test('should contain the match players as non-empty Object', () =>
        expect(response.data.players).toBeTruthy());
      test('should contain player1 as type String', () =>
        expect(typeof response.data.players.player1).toEqual('string'));
      test('should contain player1 as non-empty String', () =>
        expect(response.data.players.player1).toBeTruthy());
      test('should contain player2 as type String', () =>
        expect(typeof response.data.players.player2).toEqual('string'));
      test('should contain player2 as non-empty String', () =>
        expect(response.data.players.player2).toBeTruthy());
      test('should contain match description as type String', () =>
        expect(typeof response.data.description).toEqual('string'));
      test('should contain match description as type Number', () =>
        expect(typeof response.data.description).toEqual('string'));
    });
  });

  describe('get matches', () => {
    describe('get all matches', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/match/all`)
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test('should return a status of 200', () =>
        expect(response.status).toBe(200));
      test('should return status text - OK', () =>
        expect(response.statusText).toBe('OK'));
      test('should return type Object', () =>
        expect(typeof response.data).toEqual('object'));
    });
  });

  describe('update match', () => {
    describe('update a valid match with a valid video', () => {
      beforeAll(async () => {
        const match = getValidMatch();
        const request = await to.object(
          instance.post(
            `${REMOTE_API_URL}/match/${validMatchId}/update`,
            {
              duration: match.duration,
              players: match.players,
            })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test('should return a status of 200', () =>
        expect(response.status).toBe(200));
      test('should return status text - OK', () =>
        expect(response.statusText).toBe('OK'));
      test('should return type String', () =>
        expect(typeof response.data).toEqual('string'));
      test('should contain a non-empty String', () =>
        expect(response.data).toBeTruthy());
      test('should contain a success message', () =>
        expect(response.data).toBe('Successfully updated match.'));
    });
  });

  describe('remove match', () => {
    describe('remove a valid match with a valid video', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(
            `${REMOTE_API_URL}/match/${validMatchId}/remove`,
            {
              match_id: validMatchId
            })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test('should return a status of 200', () =>
        expect(response.status).toBe(200));
      test('should return status text - OK', () =>
        expect(response.statusText).toBe('OK'));
      test('should return type String', () =>
        expect(typeof response.data).toEqual('string'));
      test('should contain a non-empty String', () =>
        expect(response.data).toBeTruthy());
      test('should contain a success message', () =>
        expect(response.data).toBe('Successfully removed match.'));
    });
  });
});
