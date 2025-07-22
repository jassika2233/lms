import {User} from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";


// export const register = TryCatch(async(req,res)=>{
//   const {email,name,password}=req.body;

//         let user= await User.findOne({email});

//         if (user) 
//           return res.status(400).json({
//             message: "User Already exists",
//           });

//           const hashPassword= await bcrypt.hash(password,10)

//           user={
//             name,
//             email,
//             password: hashPassword,
//           }

//           const otp = Math.floor(Math.random()*1000000);

//           const activationToken= jwt.sign({
//             user,
//             otp,
//           }, process.env.Activation_Secret,{
//             expiresIn:"5m",
//           });
//           const data={
//             name,
//             otp,
//           };

//           await sendMail(
//             email,
//             "E Learning",
//             data
//           )
//           res.status(200).json({
//             message:"Otp send to your mail",
//             activationToken,
//           });
// })

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  // 1. Validate input
  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Check if user already exists
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 5. Generate JWT token
  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  // 6. Respond
  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});


// STEP 1: REGISTER (Send OTP via email)
// export const register = TryCatch(async (req, res) => {
//   const { email, name, password } = req.body;

//   // 1. Basic validation
//   if (!email || !name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // 2. Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   // 3. Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 4. Generate OTP (6-digit, zero-padded)
//   const otp = String(Math.floor(100000 + Math.random() * 900000));

//   // 5. Create activation token with user info + OTP
//   const activationToken = jwt.sign(
//     {
//       user: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//       otp,
//     },
//     process.env.Activation_Secret,
//     { expiresIn: "5m" }
//   );

//   // 6. Prepare and send email
//   await sendMail(email, "E-Learning | Verify Your Email", { name, otp });

//   // 7. Respond
//   res.status(200).json({
//     message: "OTP sent to your email",
//     activationToken,
//   });
// });


// export const verifyUser= TryCatch(async(req,res) =>{
//   const{otp,activationToken}=req.body; 

//   const verify= jwt.verify(activationToken,process.env.Activation_Secret);

//   if(!verify)
//     return res.status(400).json({
//       message:" Otp Expired",
//   })

//   if(verify.otp !== otp)
//     return res.status(400).json({
//       message:" Wrong otp",
//   })

//   await User.create({
//     name: verify.user.name,
//     email: verify.user.email,
//     password: verify.user.password,
//   })
  
//   res.json({
//     message: "User Registered"
//   });
// });

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  if (!otp || !activationToken) {
    return res.status(400).json({ message: "OTP and token are required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(activationToken, process.env.Activation_Secret);
  } catch (err) {
    return res.status(400).json({ message: "OTP expired or invalid token" });
  }

  if (decoded.otp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  const { name, email, password } = decoded.user;

  // Check if user already exists (to avoid duplicate insert)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const user = await User.create({ name, email, password });

  // Issue login token after verification
  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});


export const loginUser= TryCatch(async(req,res)=>{
  const{email,password} =req.body;

  const user= await User.findOne({email});

  if(!user)
    return res.status(400).json({
      message: "No user with this email",
    });

    const mathPassword= await bcrypt.compare(password,user.password);

    if(!mathPassword)
      return res.status(400).json({
        message: "Wrong Password",
      })

      const token = jwt.sign({_id: user._id},process.env.Jwt_Sec,{
        expiresIn:"15d",
      });

      res.json({
        message: `Welcome Back ${user.name}`,
        token,
        user,
      });
});


export const myProfile= TryCatch(async(req,res)=>{
  const user =await User.findById(req.user._id);

  res.json({user});
})
