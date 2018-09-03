import client from '../../config/grpc'

function register(req, res, next) {
    const message = {
        fullName : req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        username: req.body.username,
        password: req.body.password
    }
    client.register(message , (error, data) => {
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
}


function login(req, res, next) {    
    const message = {
        username: req.body.username,
        password: req.body.password
    }
    client.login(message,(error, data) =>{
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
}




function forgetPassword(req, res, next) {
    const message = {
      email   : req.body.email
    }

    client.forgetPassword(message, (error, data) => {
      if (error) res.sendStatus(500)
      res.status(data.code).send({ message: data.message })
    })
}



function update(req, res, next) {
    const message = {
        id: req.user.id,
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phonenumber,
        username: req.body.username
    }

    client.update(message, (error, data) => {
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
}


function remove(req, res, next) {
    const message = {
        id: req.user.id
    }

    client.remove(message, (error, data) => {
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
}


function verify(req, res, next){
    const message = {
        token: req.body.token
    }

    client.verify(message, (error, data) => {
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
}



function resetPassword(req, res, next) {
    const message = {
      token   : req.body.token,
      password: req.body.password  
    }

    client.resetPassword(message, (error, data) => {
      if (error) res.sendStatus(500)
      res.status(data.code).send({ message: data.message })
    })
}


function changePassword(req, res, next) {
    const message = {
      id          : req.user.id,
      old_password: req.body.old_password,
      new_password: req.body.new_password
    }
  
    client.changePassword(message, (error, data) => {
      if (error) res.sendStatus(500)
      res.status(data.code).send({ message: data.message })
    })
  }



function getMe(req, res, next) {
    const message = { id: req.user.id }
    
    client.getMe(message, (error, data) => {
        if (error) res.sendStatus(500)
        res.status(data.code).send({ message: data.message })
    })
  }
  

export default { register, login, forgetPassword, update, remove, resetPassword, changePassword, getMe }