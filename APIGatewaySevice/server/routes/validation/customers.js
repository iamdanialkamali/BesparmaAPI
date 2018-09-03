import Joi from 'joi'

export default {
  registerDataValidation: {
    body: {
      email      : Joi.string().email({ minDomainAtoms: 2 }).required(),
      phonenumber: Joi.string().regex(/^[0-9]{11}$/).required(),
      username   : Joi.string().regex(/^[0-9a-zA-Z]{3,24}$/).required(),
      password   : Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
      fullname   : Joi.string().regex(/^[0-9a-zA-Z\s]{6,24}$/).required()
    }
  },
  userPassValidation: {
    body: {
        username: Joi.string().regex(/^[0-9a-zA-Z]{3,24}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
    }
  },
  forgetPassEmail: {
    body: {
      email: Joi.string().email({ minDomainAtoms: 2 }).required()
    }
  },
  updateUserData: {
    body: {
      phonenumber: Joi.string().regex(/^[0-9]{11}$/),
      username   : Joi.string().regex(/^[0-9a-zA-Z]{3,24}$/),
      fullname   : Joi.string().regex(/^[0-9a-zA-Z\s]{6,24}$/)
    }
  },
  changePassword: {
    body: {
      oldPassword: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
      newPassword: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
    }
  },
  resetPassword: {
    body: {
      password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
    }
  }
}