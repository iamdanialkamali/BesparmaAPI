import client from '../../config/grpc'

function register(req, res, next) {
    client.register({
        fullName : req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phonenumber,
        username: req.body.username,
        password: req.body.password
    },(err, data)=>{
        return res.json();
    })
}


function login(req, res, next) {
    client.login({
        username: req.body.username,
        password: req.body.password
    },(err, data)=>{
        return res.json();
    })
}



export default { register }