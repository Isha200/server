const Users = require('../models/userSchema');

const authenticate = async (req, res,next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).send("No token")
        }
        else {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await
                Users.findOne({
                    _id: verifyToken._id,
                    "tokens.tokens": token
                });

                if(!rottUser) 
                {
                    res.status(401).send("User not found")
                }
                else{
                    res.status(200).send("Authorised user")
                }
        }
        next()
    } catch (error) {
        res.status(401).send("Error")
        console.log(error)
    }
}