const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {

  console.log(req.headers)

  try {

    const authToken = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
    // console.log(payload)
    // .verify check is the token exists, if the token is valid, and if the token has not been tampered with.
    
    // I am passing the extracted payload info (the user making the request) to the route
    req.payload = payload 

    next() // continue to the route, meaning that the token was valid

  } catch (error) {
    // if the token is not valid, it doesn't exist or if it was modified. then it goes into this catch.
    res.status(401).json({errorMessage: "token is not valid, it doesn't exist or it has been modified"})
  }


}

module.exports = verifyToken