const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {

  console.log(req.headers)

  try {

    const authToken = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
    // console.log(payload)
    // .verify check is the token exists, if the token is valid, and if the token has not been tampered with.
    
    // I am passing the extracted payload info (the user making the request) to the route
    console.log(payload)
    req.payload = payload 

    next() // continue to the route, meaning that the token was valid

  } catch (error) {
    // if the token is not valid, it doesn't exist or if it was modified. then it goes into this catch.
    res.status(401).json({errorMessage: "token is not valid, it doesn't exist or it has been modified"})
  }


}

function verifyAdminRole(req, res, next) {
  // always after verifyToken
  if (req.payload.role === "admin") {
    next() // you are an admin so you can continue with the route
  } else {
    res.status(401).json({errorMessage: "You are not an admin, get out of here you hacker"})
  }

}

module.exports = {
  verifyToken,
  verifyAdminRole
}