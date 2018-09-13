import express  from 'express'
import validate from 'express-validation'

import serviceProviderCtrl from '../controllers/serviceProviders'
import validations  from './validation/serviceProviders'
import auth from '../../config/jwt';

const router = express.Router()

router.route('/register')
/**
 * @api {post} /api/serviceProviders/register
 * @apiGroup ServiceProviders
 *
 * @apiParam {String} username        unique username { 3 to 24 characters }
 * @apiParam {String} email           unique && valid email (email will be verified and use for resetPassword)
 * @apiParam {String} phonenumber     unique phonenumber { 11 charachters }
 * @apiParam {String} password        { 6 to 30 charachters }
 * @apiParam {String} fullname        full name for contact things { 6 to 24 characters }
 * @apiParam {String} degree          degree of service provider
 * @apiParam {String} nationalCode    unique && valid national code { 10 characters }
 * @apiParam {Boolean} marriage       marriage status 
 * @apiParam {String} address         valid address { 8 to 50 characters}
 * @apiParam {Number} age             age of SP {greater than 18}
 * @apiParam {String} homePhonenumber home phone number {10 to 13 characters}
 * 
 * @apiParamExample {json} register-example: 
 *   {
 *     "username": "a_otadi",
 *     "email": "ali@gmail.com",
 *     "phonenumber": "09100000000",
 *     "password": "12{M}34",
 *     "fullname": "ali otadi"
 *     "degree"  : "Bachelor"
 *     "nationalCode" : "0371810906"
 *     "marraige" : "true"
 *     "addres" : "Tehran - Forsat"
 *     "age" : "21"
 *     "homePhonenumber" : "02166140940"
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
 * @api {post} /api/serviceProviders/login
 * @apiGroup ServiceProviders
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
 * @api {put} /api/serviceProviders/update
 * @apiGroup ServiceProviders
 * 
 * @apiUse AuthorizationHeader
 *
 * @apiParam {String} username        Optional, unique username { 3 to 24 characters }
 * @apiParam {String} phonenumber     Optional, unique phonenumber { 11 charachters }
 * @apiParam {String} fullname        Optional, full name for contact things { 6 to 24 characters }
 * 
 * @apiParamExample {json} update-example: 
 *   {
 *     "username": "h.otadi",
 *     "phonenumber": "09120000000",
 *     "fullname": "hamed otadi"
 *     "degree"  : "Bachelor"
 *     "nationalCode" : "0020582552"
 *     "marraige" : "false"
 *     "addres" : "Tehran - Nosrat"
 *     "age" : "22"
 *     "homePhonenumber" : "02188140940"
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
 * @api {delete} /api/serviceProviders/remove
 * @apiGroup ServiceProviders
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
 * @api {post} /api/serviceProviders/changepassword
 * @apiGroup ServiceProviders
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
 * @api {post} /api/serviceProviders/forgetpassword
 * @apiGroup ServiceProviders
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
 * @api {post} /api/serviceProviders/resetpassword
 * @apiGroup ServiceProviders
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
 * @api {get} /api/serviceProviders/verify/:token
 * @apiGroup ServiceProviders
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
   * @api {get} /api/serviceProviders/getme
   * @apiGroup ServiceProviders
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
   * @apiSuccess {String} response.profile.degree          User's Degree
   * @apiSuccess {String} response.profile.nationalCode    User's National Code
   * @apiSuccess {Boolean} response.profile.marriage       User's Marriage status
   * @apiSuccess {String} response.profile.address         User's Address
   * @apiSuccess {Number} response.profile.age             User's Age
   * @apiSuccess {String} response.profile.homePhonenumber User's Home phone number   * 
   * @apiSuccess {String} response.profile.status          User's status
   * @apiSuccessExample {json} GetMe-Response:
   *   HTTP/1.1 200 Success
   *   {
   *     message : "Ok"
   *     profile: {
   *      "username": "h.otadi",
   *      "phonenumber": "09120000000",
   *      "fullname": "hamed otadi"
   *      "degree"  : "Bachelor"
   *      "nationalCode" : "0020582552"
   *      "marraige" : "false"
   *      "addres" : "Tehran - Nosrat"
   *      "age" : "22"
   *      "homePhonenumber" : "02188140940"
   *       "status": "active"
   *     }
   *   }
   * 
   * @apiUse NotAuthorizedError
   * @apiUse InternalServerError
   * 
   **/
  .get(serviceProviderCtrl.getToken, serviceProviderCtrl.getMe)

export default router