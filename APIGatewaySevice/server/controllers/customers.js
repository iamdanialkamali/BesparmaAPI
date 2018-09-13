import client from '../../config/grpc'

function getToken(req, res, next) {
    if (req.get('Authorization')){
        req.body.token = req.get("Authorization").split(' ')[1]
        next()
    } else res.status(401).send({ "message": "No authorization token was found" })
}

function register(req, res, next) {
    const message = {
        fullname : req.body.fullname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        username: req.body.username,
        password: req.body.password
    }

    client.register(message , (error, data) => {
        try {
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({
                message: data.message,
                token: data.token})}
        catch(exeption) {
            res.status(500).send({message: "Internal server error"})
        }
      })
    
}


function login(req, res, next) {    
    const message = {
        username: req.body.username,
        password: req.body.password
    }

    client.login(message,(error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({
                message: data.message,
                token: data.token})
        }
        catch(exeption) {
          res.status(500).send({message: "Internal server error"})
        }
    })
}




function forgetPassword(req, res, next) {
    const message = { email   : req.body.email }

    client.forgetPassword(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
            res.status(500).send({message: "Internal server error"})
        }
    })
}



function update(req, res, next) {
    const message = {
        token: req.user.token,
        fullname: req.body.fullname,
        phonenumber: req.body.phonenumber,
        username: req.body.username
    }
    
    client.update(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
            res.status(500).send({message: "Internal server error"})
        }
    })
}


function remove(req, res, next) {
    const message = { token: req.body.token }

    client.remove(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
            res.status(500).send({message: "Internal server error"})
        }
    })
}




function verify(req, res, next){
    const message = { token: req.params.token }

    client.verify(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
            res.status(500).send({message: "Internal server error"})
        }
    })
}



function resetPassword(req, res, next) {
    const message = {
      token   : req.token,
      password: req.body.password  
    }
    
    client.resetPassword(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
          res.status(500).send({message: "Internal server error"})
        }
    })
}


function changePassword(req, res, next) {
    const message = {
      token      : req.user.id,
      oldpassword: req.body.oldpassword,
      newpassword: req.body.newpassword
    }
  
    client.changePassword(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
          res.status(500).send({message: "Internal server error"})
        }
    })
  }



function getMe(req, res, next) {
    const message = { token: req.body.token }
    
    client.getMe(message, (error, data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ 
                message: data.message,
                fullname: data.fullname,
                email: data.email,
                phonenumber: data.phonenumber,
                username: data.username,
                status: data.status
            })
        }
        catch(exeption) {
          res.status(500).send({message: "Internal server error"})
        }
    })
    
}
 
function getSuggestedSPs(req, res, next) {
    const message = { location : req.body.location }

    client.getSuggestedSPs(message, (error,data) => {
        try{
            if (error) res.status(data.code).send(data.message)
            res.status(data.code).send({ message: data.message })
        }
        catch(exeption) {
          res.status(500).send({message: "Internal server error"})
        }
    })
    
}


export default { register, login, forgetPassword, update, remove, resetPassword, changePassword, getMe, verify, getToken, getSuggestedSPs }

