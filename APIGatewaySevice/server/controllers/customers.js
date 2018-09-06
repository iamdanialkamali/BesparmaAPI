import client from '../../config/grpc'

function getToken(req, res, next) {
    if (req.get('Authorization')){
        req.body.token = req.get("Authorization").split(' ')[1]
        next()
    } else res.status(401).send({ "message": "No authorization token was found" })
}

function register(req, res, next) {
    const message = {
        full_name : req.body.full_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        username: req.body.username,
        password: req.body.password
    }

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
    const message = { email   : req.body.email }

    client.forgetPassword(message, (error, data) => {
      if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
}



function update(req, res, next) {
    const message = {
        token: req.body.token,
        full_name: req.body.full_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        username: req.body.username
    }

    client.update(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ message: data.message })
    })
}


function remove(req, res, next) {
    const message = { token: req.body.token }

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
      token   : req.params.token,
      password: req.body.password  
    }

    client.resetPassword(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
}


function changePassword(req, res, next) {
    const message = {
      token       : req.body.token,
      old_password: req.body.old_password,
      new_password: req.body.new_password
    }
  
    client.changePassword(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
      res.status(data.code).send({ message: data.message })
    })
  }



function getMe(req, res, next) {
    const message = { token: req.body.token }
    
    client.getMe(message, (error, data) => {
        if (error) res.status(error.code).send(error.message)
        res.status(data.code).send({ 
            message: data.message,
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            username: data.username,
            status: data.status
        })
    })
}
  

export default { register, login, forgetPassword, update, remove, resetPassword, changePassword, getMe, verify, getToken }
