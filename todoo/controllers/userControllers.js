const user = require("../model/user");
const asyncHandler = require("express-async-handler");
const validator = require('validator');
const bcrypt = require("bcrypt");
const token = require("../util/generateToken");

const signUp = asyncHandler (async(req,res,next) => {
  // check email is correct and not duplicated
  const {email , password} = req.body;
  if(!email || !validator.isEmail(email)){
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if(!req.body.password){
    return res.status(400).json({ error: 'Password is required' });
  }
 
  const encryptedPassword = await bcrypt.hash(password,10);
  const newUser = new user({email:email,password:encryptedPassword});
  const userToken = await token({id:newUser._id});
  newUser.token = userToken;
  const retUser = await newUser.save();
  res.json({message:"Successfully registered",user:retUser});
})


const login = asyncHandler(async( req,res,next )=>{
 // check if it is correct email format
 // if it is fetch el user
 // check the password is correct
 // return user
   const {email , password} = req.body;
   if(!email || !validator.isEmail(email)){
    return res.status(400).json({ error: 'Invalid email address' });
   }
  
   const isUser = await user.findOne({email});
   if(!isUser){
    return res.status(400).json({ error: 'Invalid email address' });
   }
   const checkPassword = await bcrypt.compare(password,isUser.password);
   if(!checkPassword){
    return res.status(400).json({ error: 'Incorrect password' });
   }

   res.status(200).json({message:"Logged in successfully",user:isUser});

})

const users = asyncHandler( async (req,res,next) =>{
     const users = await user.find()
     res.json(users);
})

const showUser = asyncHandler (async (req,res)=>{
  
  const users = await user.find();
  res.json({users:users});

})

module.exports = {
  login,
  users,
  signUp,
  showUser
}
