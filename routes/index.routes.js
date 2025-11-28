const router = require("express").Router();

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)


// EXAMPLE OF A PRIVATE ROUTE
const { verifyToken, verifyAdminRole } = require("../middlewares/auth.middlewares")

router.get("/example-private-route", verifyToken, (req, res) => {

  //! VERY IMPORTANT
  console.log("here is the user requesting things", req.payload)

  // res.send("example of private data. Here have some private potatoes!")
  res.send("example of sending private information from your profile")

})

// EXAMPLE OF AN ADMIN ONLY ROUTE

router.delete("/example-admin-route/:userId", verifyToken, verifyAdminRole, (req, res) => {

  res.send("you are an admin, you have succesfully deleted this user")

})


module.exports = router;
