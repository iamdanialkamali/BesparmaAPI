import client from '../../config/grpc'

function register(req, res, next) {
    client.register({},(err, data)=>{
        username: req.body.username
        password: req.body.password
        email: req.body.email
        phoneNumber: req.body.phone
    })
}

export default { register }