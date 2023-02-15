var jwt = require('jsonwebtoken');
const JWT_TOKEN = 'breakthematrix'


const fetchAdmin = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token) {
        res.status(401).send({error: "Please authentication using a void"})
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN)
        req.admin = data.admin
    } catch (error) {
        res.status(401).send({error: "token not verified"})
    }
    next();
}


module.exports = fetchAdmin;

