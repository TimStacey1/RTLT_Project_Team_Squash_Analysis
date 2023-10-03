const https = require('https');
const axios = require('axios');
const to = require('../lib/to');
const faker = require('faker');
const { between } = require('../lib/util');
const fs = require('fs');
const { annotationComponents } = require('../models/Annotation');

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
const TIMESTAMP_MIN_NUM = 0;
const TIMESTAMP_MAX_NUM = 7200;
const PLAYER_NUMBER_MIN_NUM = 1;
const PLAYER_NUMBER_MAX_NUM = 2;

let validMatchId = '';
let validAnnotationId = '';

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

const getValidGameAnnotation = () => {
  const gameAnnotationComponents =
    annotationComponents.filter((component) => component.type === 'game');
  return gameAnnotationComponents[faker.datatype.number({
      'min': 0,
      'max': gameAnnotationComponents.length - 1
    })]
}

const getValidShotAnnotation = () => {
  const shotAnnotationComponents =
    annotationComponents.filter((component) => component.type === 'shot');
  return shotAnnotationComponents[faker.datatype.number({
      'min': 0,
      'max': shotAnnotationComponents.length - 1
    })]
}

const getValidTimestamp = () => {
  return faker.datatype.number({
    'min': TIMESTAMP_MIN_NUM,
    'max': TIMESTAMP_MAX_NUM
  });
}

const getValidPlayerNumber = () => {
  return faker.datatype.number({
    'min': PLAYER_NUMBER_MIN_NUM,
    'max': PLAYER_NUMBER_MAX_NUM
  });
}

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

describe('Annotate', () => {
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

  describe('annotate match', () => {
    describe('annotate a valid match with a shot annotation', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(
            `${REMOTE_API_URL}/annotate/${validMatchId}/new`,
            {
              components: getValidShotAnnotation(),
              timestamp: getValidTimestamp(),
              playerNumber: getValidPlayerNumber()
            }
          )
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
      test('should contain the annotation id as type String', () =>
        expect(typeof response.data.annotation_id).toEqual('string'));
      test('should contain the annotation id as non-empty String', () =>
        expect(response.data.annotation_id).toBeTruthy());

      afterAll(() => {
        // store valid annotation id for later use
        validAnnotationId = response.data.annotation_id;
      });
    });

    describe('annotate a valid match with a game annotation', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(
            `${REMOTE_API_URL}/annotate/${validMatchId}/new`,
            {
              components: getValidGameAnnotation(),
              timestamp: getValidTimestamp(),
              playerNumber: getValidPlayerNumber()
            }
          )
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
      test('should contain the annotation id as type String', () =>
        expect(typeof response.data.annotation_id).toEqual('string'));
      test('should contain the annotation id as non-empty String', () =>
        expect(response.data.annotation_id).toBeTruthy());
    });
  });

  describe('get annotation', () => {
    describe('get a valid shot annotation', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/annotate/${validMatchId}/${validAnnotationId}/get`)
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
      test('should contain the annotation timestamp as type Number', () =>
        expect(typeof response.data.timestamp).toEqual('number'));
      test('should contain the annotation components as type Object', () =>
        expect(typeof response.data.components).toEqual('object'));
      test('should contain the annotation playerNumber as type Number', () =>
        expect(typeof response.data.playerNumber).toEqual('number'));
    });
  });

  describe('get annotations', () => {
    describe('get all annotations of a valid match', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`${REMOTE_API_URL}/annotate/${validMatchId}/all`)
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

  describe('edit annotation', () => {
    describe('edit a valid annotation', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(
            `${REMOTE_API_URL}/annotate/${validMatchId}/${validAnnotationId}/edit`,
            {
              components: getValidGameAnnotation(),
              timestamp: getValidTimestamp(),
              playerNumber: getValidPlayerNumber()
            }
          )
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
        expect(response.data).toBe('Successfully updated annotation.'));
    });
  });

  describe('remove annotation', () => {
    describe('remove a valid annotation', () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`${REMOTE_API_URL}/annotate/${validMatchId}/${validAnnotationId}/remove`)
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
        expect(response.data).toBe('Successfully removed annotation.'));
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
