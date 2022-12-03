const { required } = require('joi');
const request = require('supertest');
/*
const app = require('../index');

it('check status services', (done) => {
    request(app)
    .post('/signin')
    .send({
        email:"administrator@dietcomposer.pl",
        password:"Admin"
    }).then(res => {
        expect(res.status).toBe(200);
        done();
    });
})*/

describe('Initial Test', () => {
    it('should test that 1 + 1 === 2', () => {
      expect(1+1).toBe(2)
    })
  });

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    //expect(value).toBe(0.3);           This won't work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works.
  });
  