import express  from 'express'
import validate from 'express-validation'

import customerCtrl from '../controllers/customers'
import validations  from './validation/customers'

const router = express.Router()

router.route('/register')
  .post(validate(validations.registerDataValidation), customerCtrl.register)

export default router