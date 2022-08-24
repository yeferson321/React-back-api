import jwt from "jsonwebtoken";

function verifyToken (req, res, next) {

    const token = req.headers['x-access-token'];

    if (!token){
        return res.status(401).json({
            auth: false,
            message: "Token not found"
        });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.KEY_TOKEN_AUTH );
            if (!decoded.id || decoded.id == undefined || decoded.id == ""){
                res.json({ auth: false, message: "Invalid Token"});
            } else {
                req.userId = decoded.id;
                next();
            }            
        } catch (error) {
            res.json({ auth: false, response: error.name, message: "Token has expired"});
        }
    }
}

module.exports = verifyToken;