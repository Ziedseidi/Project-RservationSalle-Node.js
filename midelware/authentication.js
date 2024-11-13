const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next) =>{
    const token = req.cookies.token??req.headers.token ;
    
console.log();
    if(!token) return res.status(401).send('Authentication failed:invalid token ')
    try {
        const tokenData = token.split(' ')[1];
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        console.log('decoded');
        console.log(decodedToken);
        req.userId=decodedToken.userId;
        next();
    } catch (error) {
        console.log('Error server');
        return res.status(401).send('Authentication failed:invalid token ')

    }
}
module.exports = authenticateToken;
