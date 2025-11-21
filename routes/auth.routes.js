const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup" => creates the document of the user
router.post("/signup", async (req, res, next) => {
  console.log(req.body)
  const { username, email, password } = req.body

  // 1. All 3 properties are mandatory
  if (!username || !email || !password) {
     res.status(400).json({errorMessage: "username, email and password properties are mandatory"})
     return; // stop the route
  }

  // 2. The password should be strong enough
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g
  if (passwordRegex.test(password) === false) {
      res.status(400).json({errorMessage: "password is not strong enough, it needs at least one uppercase, one lowercase, one number and 8 characters."})
     return; // stop the route
  }

  
  // Examples of other validations
  // - Email should have the correct format
  // - username to also be unique
  // - set max length and min length of username or email
  
  try {
    // 3. The email should be unique. // TODO
    const foundUser = await User.findOne({email: email})
    // response could be null if there is no other user with that email
    // response could be a user object f there is a user with that email
    if (foundUser) {
      res.status(400).json({errorMessage: "user found with the same email. Please login or use a different email to signup."})
      return; // stop the route  
    }

    // hash the password because we are good devs :) 
    const hashPassword = await bcrypt.hash(password, 12)
    
    await User.create({
      username: username,
      email: email,
      password: hashPassword
    })

    res.sendStatus(201)

  } catch (error) {
    next(error)
  }
  
})

// POST "/api/auth/login" => verify user credentials (authenticate the user) and send the token
router.post("/login", async (req, res, next) => {
  console.log(req.body)

  const {email, password} = req.body

  if (!email || !password) {
    res.status(400).json({errorMessage: "email and password properties are mandatory"})
     return; // stop the route
  }

  try {
    
    const foundUser = await User.findOne({email: email})
    console.log(foundUser)
    if (!foundUser) {
      res.status(400).json({errorMessage: "no user with that email, please signup first or try a different email"})
      return; // stop the route
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (isPasswordMatch === false) {
      res.status(400).json({errorMessage: "password is not correct, try again with the correct password"})
      return; // stop the route
    }

    //* at this point we have succesfully authenticated the user.

    // the payload is the hashed info from the user that should be UNIQUE and STATIC
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256", expiresIn: "7d"
    })

    res.status(200).json( {authToken: authToken} )
  } catch (error) {
    next(error)
  }
})


// GET "/api/auth/verify" => indicate to the client who the user is
router.get("/verify", verifyToken ,(req, res) => {

  // we validate the token and then send to the client side who this person is by passing the payload
  res.status(200).json(req.payload)

})


module.exports = router