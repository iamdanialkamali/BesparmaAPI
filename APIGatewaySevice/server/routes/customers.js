import express  from 'express'
import validate from 'express-validation'

import customerCtrl from '../controllers/customers'
import validations  from './validation/customers'
import auth from '../../config/jwt';

const router = express.Router()

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
  .get(validate(validations.userPassValidation), customerCtrl.verify)

router.route('/getMe')
  .get(auth, customerCtrl.getMe)
  
export default router