import client from '../../config/grpc'

function register(req, res, next) {
    const message = {
        fullname : req.body.fullname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        username: req.body.username,
        password: req.body.password
    }
    console.log(message)
    client.register(message , (error, data) => {

        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ 
            message: data.message,
            token: data.token
        })
    })
}


function login(req, res, next) {    
    const message = {
        username: req.body.username,
        password: req.body.password
    }

    client.login(message,(error, data) =>{
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ 
            message: data.message,
            token: data.token
        })
    })
}




function forgetPassword(req, res, next) {
    const message = {
      email   : req.body.email
    }

    client.forgetPassword(message, (error, data) => {
      if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
}



function update(req, res, next) {
    const message = {
        id: req.user.id,
        fullname: req.body.fullname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        username: req.body.username
    }

    client.update(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ message: data.message })
    })
}


function remove(req, res, next) {
    const message = {
        id: req.user.id
    }

    client.remove(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ message: data.message })
    })
}




function verify(req, res, next, token){
    const message = { token }

    client.verify(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ message: data.message })
    })
}



function resetPassword(req, res, next) {
    const message = {
      id      : req.user.id,
      password: req.body.password  
    }

    client.resetPassword(message, (error, data) => {
      if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
}


function changePassword(req, res, next) {
    const message = {
      id          : req.user.id,
      oldpassword: req.body.oldpassword,
      newpassword: req.body.newpassword
    }
  
    client.changePassword(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
  }



function getMe(req, res, next) {
    const message = { id: req.user.id }
    
    client.getMe(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ 
            message: data.message,
            fullname: data.fullname,
            email: data.email,
            phonenumber: data.phonenumber,
            username: data.username,
            status: data.status
        })
    })
}
  


export default { register, login, forgetPassword, update, remove, resetPassword, changePassword, getMe, verify }
