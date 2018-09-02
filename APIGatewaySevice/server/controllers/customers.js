import client from '../../config/grpc'

function register(req, res, next) {
    client.register({},(err, data)=>{
        res.
    })
}

export default { register }