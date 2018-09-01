import Joi from 'joi'

export default {
  registerDataValidation: {
    body: {
      fullname: Joi.string().regex(/^[0-9a-zA-Z]{3,24}$/),
      email: Joi.string().email({ minDomainAtoms: 2 })
    }
  }
}