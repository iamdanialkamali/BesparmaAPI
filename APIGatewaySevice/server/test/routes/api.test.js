import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai /*, { expect } */ from 'chai';
import sinon from 'sinon';
import config from '../../../config/env';
import app from '../../../index';
import { clearDatabase } from '../../helpers/clearDb';
//import customers from '../../controllers/customers.js';
import Customer from '../../models/customer.js';

require('sinon-mongoose');
require('sinon-as-promised');

const expect = require('expect');
/* 'npm run test' for running this test */

describe('## API Tests', () => {
let sandbox , user;

before((done) => {
  
  Customer.create({
    
    username: 'hamed',
    password: '123456',
    email:'test@test.com',
    phonenumber: '09121111111',
    fullname: 'hamed mirzaei'
  }).then((resolve, reject) => {
    done()
  })
});


beforeEach((done) => {
  clearDatabase(() => {
    sandbox = sinon.sandbox.create();
    done();
  })
});

afterEach((done) => {
  sandbox.restore();
  done();
});


  describe('### POST /register', () => {

    it('should create a customer succesfully', (done) => {
      request(app)
        .post('http://localhost:3000/api/register')
        .type('form')
        .send({ 
          username: 'hamed', 
          password: '123456',
          email: 'test@test.com',
          phonenumber: '09352858401',
          fullname: 'hamed mirzaei'
        })
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.username).toBe('hamed');
          expect(res.body.email).toBe('test@test.com');
          expect(res.body.phonenumber).toBe('09352858401')
          done();
        });
        //done();
    });
 })

//     it('should return Bad Request', (done) => {
//       request(app)
//         .post('/api/register')
//         .type('form')
//         .send({ 
//           //username: 'hamed', ##usernamed missing in reques 
//           password: '123456',
//           email: 'test@test.com',
//           phonenumber: '09352858401',
//           fullname: 'hamed mirzaei'
//         })
//         .expect(httpStatus.BAD_REQUEST)
//         .then(res,err => {
//           console.log('It iss a bad request');
//           done(err);
//         });
//     });


//     it('should return Not Found', (done) => {
//       request(app)
//         .post('/appi/register') //bad url
//         .type('form')
//         .send({ 
//           username: 'hamed', 
//           password: '123456',
//           email: 'test@test.com',
//           phonenumber: '09352858401',
//           fullname: 'hamed mirzaei'
//         })
//         .expect(httpStatus.NOT_FOUND)
//         .then(res,err => {
//           console.log('It is a bad request');
//           done(err);
//         });
//     });


//   });
  

//   describe('### POST /login', () => {

//     it('should login the customer succesfully', (done) => {
//       request(app)
//         .post('/api/login')
//         .type('form')
//         .send({ 
//           username: 'hamed', 
//           password: '123456'
//         })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.token).toBeA('JWT')
//           done();
//         });
//     });

//     it('should return Bad Request', (done) => {
//       request(app)
//         .post('/api/login')
//         .type('form')
//         .send({ 
//           username: 'hamed'
//         })
//         .expect(httpStatus.BAD_REQUEST)
//         .then(res,err => {
//           console.log('It is a bad request');
//           done(err);
//         });
//     });
    
//   });
  

//   describe('PUT /api/update',() => {
//     it('should update data', (done) => {
//       request(app)
//         .post('/api/update')
//         .type('form')
//         .send({ 
//           id: '1',
//           username: 'danial', 
//           password: '123456',
//           email: 'test@test.com',
//           phonenumber: '09352858401',
//           fullname: 'hamed mirzaei'
//         })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.username).toBe('danial');
//           expect(res.body.password).toBe('123456');
//           expect(res.body.email).toBe('test@test.com');
//           expect(res.body.phonenumber).toBe('09352858401')
//           done();
//         });
//     });

//     it('should return bad request', (done) => {
//       request(app)
//         .post('/api/update')
//         .type('form')
//         .send({ 
//           //id: '1',  # id missing in request
//           username: 'danial', 
//           password: '123456',
//           email: 'test@test.com',
//           phonenumber: '09352858401',
//           fullname: 'hamed mirzaei'
//         })
//         .expect(httpStatus.BAD_REQUEST)
//         .then(res,err => {
//           console.log('it is a bad request')
//           done(err);
//         });
//     });

//   });
  

//   describe('### DELETE /remove', () => {
//     it('should delete a customer', function(done) {
//       request(app)
//         .post('/api/remove')
//         .send({ 
//           id: '1'
//         })
//         .expect(httpStatus.OK)
//         .then(res => {
//           done();
//         });
//     });

//     it('should return bad request', function(done) {
//       request(app)
//         .post('/api/remove')
//         .send({ 
//           phonenumber: '09352858401'
//         })
//         .expect(httpStatus.BAD_REQUEST)
//         .then(res,err => {
//           console.log('it is a bad request');
//           done(err);
//         });
//     });

//   });
 
//   describe('### GET /getMe', () => {
//     it('should get data of customer', function(done) {
//       request(app)
//         .post('/api/getMe')
//         .send({ 
//           id: '1'
//         })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.username).toBe('danial');
//           expect(res.body.password).toBe('123456');
//           expect(res.body.email).toBe('test@test.com');
//           expect(res.body.phonenumber).toBe('09352858401')
//           done();
//         });
//     });

//     it('should return bad request', function(done) {
//       request(app)
//         .post('/api/remove')
//         .send({ 
//           phonenumber: '09352858401'
//         })
//         .expect(httpStatus.BAD_REQUEST)
//         .then(res,err => {
//           console.log('it is a bad request');
//           done(err);
//         });
//     });
//   });


});

