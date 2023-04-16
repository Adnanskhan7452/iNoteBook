const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Adnanisagoodboy$';

//Create a user using: POST "/api/auth/"  No login required

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "min. Length should be 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if there are errors return bad requests and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user with email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry the user with this Email Already Exist" });
      }
      const salt = await bcrypt.genSalt(10); 
      secPass = await bcrypt.hash(req.body.password,salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //   .then(user => res.json(user)).catch(err=>{console.log(err)
      // res.json({error : 'please enter a unique value for email', message : err.message})})
      
      const data ={
        user:{
            id: user.id
        }
      }


      const authToken = jwt.sign(data, JWT_SECRET);
      
      success = true;
      res.json({ success,authToken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


//Authenticate a User using  POST  "/api/auth/login".  No login required

router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password","Password can not be blank").exists()
    ],
    async (req, res) => {
       let success = false;
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
          success = false
        return res.status(400).json({error:"Try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          success = false
        return res.status(400).json({success,error:"Try to login with correct credentials"})  
        }
        const data ={
            user:{
                id: user.id
            }
          }
    
    
          const authToken = jwt.sign(data, JWT_SECRET);
          success = true;
        res.json({success,authToken});  


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }

});



//Route 3: get loggedin User Details using: POST"/api/auth/getuser".  login required
router.post(
    '/getuser',fetchuser,async (req, res) => {
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
