import express from 'express'

import customerCtrl from '../controllers/customers'

const router = express.Router()

router.route('register/')
  .post()