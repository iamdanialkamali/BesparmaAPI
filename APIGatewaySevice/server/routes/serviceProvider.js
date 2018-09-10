import express  from 'express'
import validate from 'express-validation'

import serviceProvideCtrl from '../controllers/serviceProviders'
import validations  from './validation/serviceProviders'
import auth from '../../config/jwt';

const router = express.Router()

router.route('/register')
/**
 * @api {post} /api/customers/register
 * @apiGroup Customers
 *
 * @apiParam {String} username        unique username { 3 to 24 characters }
 * @apiParam {String} email           unique && valid email (email will be verified and use for resetPassword)
 * @apiParam {String} phonenumber     unique phonenumber { 11 charachters }
 * @apiParam {String} password        { 6 to 30 charachters }
 * @apiParam {String} fullname        full name for contact things { 6 to 24 characters }
 * 
 * @apiParamExample {json} register-example: 
 *   {
 *     "username": "a_otadi",
 *     "email": "ali@gmail.com",
 *     "phonenumber": "09100000000",
 *     "password": "12{M}34",
 *     "fullname": "ali otadi"
 *   }
 * 
 * @apiSuccess (201) {object} response               Response Object
 * @apiSuccess (201) {String} response.message       Server message
 * @apiSuccess (201) {String} response.token         Access-token
 * @apiSuccessExample {json} Register-Response:
 *   HTTP/1.1 201 UserCreated
 *   {
 *     "message": "User created, Please verify your email address",
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * 
 **/
  .post(validate(validations.registerDataValidation), serviceProviderCtrl.register)

router.route('/login')
/**
 * @api {post} /api/customers/login
 * @apiGroup Customers
 *
 * @apiParam {String} username        user's unique username { 3 to 24 characters }
 * @apiParam {String} password        user's password { 6 to 30 charachters }
 * 
 * @apiParamExample {json} Login-example: 
 *   {
 *     "username": "a_otadi",
 *     "password": "12{M}34"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccess (200) {String} response.token         Access-token
 * @apiSuccessExample {json} login-Response:
 *   HTTP/1.1 200 Logged In
 *   {
 *     "message": "Logged in",
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * @apiError (4xx) UserORPassWrong      username or password is wrong or usern doe's nor exist
 * 
 **/
  .post(validate(validations.userPassValidation), serviceProviderCtrl.login)


router.route('/update')
/**
 * @api {put} /api/customers/update
 * @apiGroup Customers
 * 
 * @apiUse AuthorizationHeader
 *
 * @apiParam {String} username        Optional, unique username { 3 to 24 characters }
 * @apiParam {String} phonenumber     Optional, unique phonenumber { 11 charachters }
 * @apiParam {String} fullname        Optional, full name for contact things { 6 to 24 characters }
 * 
 * @apiParamExample {json} update-example: 
 *   {
 *     "username": "a.otadi",
 *     "phonenumber": "09120000000",
 *     "fullname": "alireza otadi"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccessExample {json} update-Response:
 *   HTTP/1.1 200 Success
 *   {
 *     "message": "updated"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 * 
 **/
  .put(serviceProviderCtrl.getToken ,validate(validations.updateUserData), serviceProviderCtrl.update)

router.route('/remove')
/**
 * @api {delete} /api/customers/remove
 * @apiGroup Customers
 * 
 * @apiUse AuthorizationHeader
 * 
 * @apiSuccess (204) {object} response               Response Object
 * @apiSuccess (204) {String} response.message       Server message
 * @apiSuccessExample {json} remove-Response:
 *   HTTP/1.1 204 noContent
 *   {
 *     "message": "deleted"
 *   }
 * 
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 * 
 **/
  .delete(serviceProviderCtrl.getToken, serviceProviderCtrl.remove)

router.route('/changepassword')
/**
 * @api {post} /api/customers/changepassword
 * @apiGroup Customers
 * 
 * @apiUse AuthorizationHeader
 * 
 * @apiParam {String} oldpassword     user's old password { 6 to 30 charachters }
 * @apiParam {String} newpassword     new password { 6 to 30 charachters }
 * 
 * @apiParamExample {json} update-example: 
 *   {
 *     "oldpassword": "12{M}34",
 *     "newpassword": "43{M}21"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccessExample {json} changepassword-Response:
 *   HTTP/1.1 200 Success
 *   {
 *     "message": "Password changed"
 *   }
 * 
 * @apiUse NotAuthorizedError
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * 
 **/
  .post(serviceProviderCtrl.getToken, validate(validations.changePassword), serviceProviderCtrl.changePassword)

router.route('/forgetPassword')
/**
 * @api {post} /api/customers/forgetpassword
 * @apiGroup Customers
 * 
 * @apiParam {String} email     user's valid email address
 * 
 * @apiParamExample {json} forgetpassword-example: 
 *   {
 *     "email": "ali@gmail.com"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccessExample {json} forgetpassword-Response:
 *   HTTP/1.1 200 Success
 *   {
 *     "message": "ckeck your email address"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * 
 **/
  .post(validate(validations.forgetPassEmail), serviceProviderCtrl.forgetPassword)
  
router.route('/resetPassword')
/**
 * @api {post} /api/customers/resetpassword
 * @apiGroup Customers
 * 
 * @apiParam {String} token     token that has sent to user's email
 * @apiParam {String} password  user's new password { 6 to 30 charachters }
 * 
 * @apiParamExample {json} forgetpassword-example: 
 *   {
 *     "token": "kjhguYhliIGIYGoiIUHIUhiUHIUHiuHIUHIuhIUHIgyOG"
 *     "password": "{{{ma}}}"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccessExample {json} forgetpassword-Response:
 *   HTTP/1.1 200 Success
 *   {
 *     "message": "password reset successfully"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * 
 **/
  .post(validate(validations.resetPassword), serviceProviderCtrl.resetPassword)


router.route('/verify/:token')
/**
 * @api {get} /api/customers/verify/:token
 * @apiGroup Customers
 * 
 * @apiParam {String} token     token that has sent to user's email
 * @apiParamExample {json} verify-example: 
 *   {
 *     "token": "kjhguYhliIGIYGoiIUHIUhiUHIUHiuHIUHIuhIUHIgyOG"
 *   }
 * 
 * @apiSuccess (200) {object} response               Response Object
 * @apiSuccess (200) {String} response.message       Server message
 * @apiSuccessExample {json} forgetpassword-Response:
 *   HTTP/1.1 200 Success
 *   {
 *     "message": "email verified :)"
 *   }
 * 
 * @apiUse BadRequest
 * @apiUse InternalServerError
 * 
 **/
  .get(serviceProviderCtrl.verify)

router.route('/getMe')
  /**
   * @api {get} /api/customers/getme
   * @apiGroup Customers
   * 
   * @apiUse AuthorizationHeader
   *
   * @apiSuccess {object} response                         Response Object
   * @apisuccess {String} response.message                 Server message
   * @apiSuccess {object} response.profile                 User profile information
   * @apiSuccess {String} response.profile.username        User's username
   * @apiSuccess {String} response.profile.email           User's Email
   * @apiSuccess {String} response.profile.phonenumber     User's Phone number
   * @apiSuccess {String} response.profile.fullname        User's Fullname
   * @apiSuccess {String} response.profile.status          User's status
   * @apiSuccessExample {json} GetMe-Response:
   *   HTTP/1.1 200 Success
   *   {
   *     message : "Ok"
   *     profile: {
   *       "username": "a_otadi",
   *       "email": "ali@gmail.com",
   *       "phonenumber": "09100000000",
   *       "fullname": "ali otadi",
   *       "status": "active"
   *     }
   *   }
   * 
   * @apiUse NotAuthorizedError
   * @apiUse InternalServerError
   * 
   **/
  .get(serviceProviderCtrl.getToken, serviceProviderCtrl.getMe)

router.route('/getSuggestedServiceProviders')
  .get(serviceProviderCtrl.getSuggestedSPs)
  
export default router