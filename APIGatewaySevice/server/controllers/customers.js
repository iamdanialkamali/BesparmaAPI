import client from '../../config/grpc'

function register(req, res, next) {
    client.register({},(err, data)=>{
        username: req.body.username
        password: req.body.password
        email: req.body.email
        phoneNumber: req.body.phone
    })
}


function getMe(req, res, next) {
  const message = { id: req.user.id }
  
  client.getMe(message, (error, data) => {
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

function emailVerify(req, res, next){
    
}
export default { register }