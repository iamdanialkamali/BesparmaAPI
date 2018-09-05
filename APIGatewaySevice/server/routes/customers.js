import express  from 'express'
import validate from 'express-validation'

import customerCtrl from '../controllers/customers'
import validations  from './validation/customers'
import auth from '../../config/jwt';

const router = express.Router()

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
 * @apiError (400) BadRequest data verification error
 * @apiError (5xx) InternalServerError server is down probably.
 * @apiErrorExample {json} 5xx Error:
 *   HTTP/1.1 500 Not Found
 *   {
 *     "message": "Internal server error"
 *   }
 * 
 **/

router.route('/register')
  .post(validate(validations.registerDataValidation), customerCtrl.register)


router.route('/login')
  /* Login customer */
  .post(validate(validations.userPassValidation), customerCtrl.login)


router.route('/update')
  /* Update a customer */
  .put(auth ,validate(validations.updateUserData), customerCtrl.update)

router.route('/remove')
  /* Remove a customer */
  .delete(auth,customerCtrl.remove)

router.route('/changePassword')
  /* Change password */
  .post(validate(validations.changePassword), customerCtrl.changePassword)

router.route('/forgetPassword')
  .post(validate(validations.forgetPassEmail), customerCtrl.forgetPassword)
  
router.route('/resetPassword')
  .post(validate(validations.resetPassword), customerCtrl.resetPassword)


router.route('/verify/:token')
  .get(customerCtrl.verify)

router.route('/getMe')
  /**
   * @api {get} /api/customers/getme
   * @apiGroup Customers
   * 
   * @apiHeader {String} Authorization User's unique access-token.
   * @apiHeaderExample {json} Authorization header-Example:
   *   {
   *     "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   *   }
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
   * @apiError (4xx) UserNotFound The token of the User was not found.
   * @apiError (5xx) InternalServerError server is down probably.
   * @apiErrorExample {json} 4xx Error:
   *   HTTP/1.1 404 Not Found
   *   {
   *     "message": "User not found"
   *   }
   * 
   * @apiErrorExample {json} 5xx Error:
   *   HTTP/1.1 500 Not Found
   *   {
   *     "message": "Internal server error"
   *   }
   * 
   **/
  .get(auth, customerCtrl.getMe)
  
export default router