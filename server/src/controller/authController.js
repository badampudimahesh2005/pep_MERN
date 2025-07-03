const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {OAuth2Client} = require("google-auth-library");

const {validationResult} = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET ;

const login = async (req, res) => {
  try {
    const {  password, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role ? user.role : 'admin',
      adminId: user.adminId
    };

    const token = jwt.sign(userDetails, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      domain: "localhost",
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      userDetails: userDetails,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


const signup = async (req, res) => {
  try {
    const {username, email, password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const existingUser = await User.find({ email: email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        role: "admin", // Default role, can be changed later
        });

    await newUser.save();

    const userDetails = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role ? newUser.role : 'admin'
    };

    const token = jwt.sign(userDetails, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      domain: "localhost",
    });

    res.status(201).json({
      message: "Signup successful",
      userDetails: userDetails,
    });
    
    } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
    }
};

const googleAuth = async (req, res) => {
 const {idToken} = req.body;
 if (!idToken) {
   return res.status(400).json({ message: "Invalid Request  " });
 }
 try{
  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await googleClient.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const {sub: googleId, email, name} = payload;

  let user = await User.findOne({ email: email });
  if (!user) {
    user = new User({
      googleId: googleId,
      email: email,
      username: name,
      isGoogleUser: true,
      googleId: googleId,
      role: user.role ? user.role : 'admin',
    });
    await user.save();
  }
  const userDetails = {
    id: user._id ? user._id : googleId,
    username: user.username,
    email: user.email,
  };
  const token = jwt.sign(userDetails, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    domain: "localhost",
  });
  res.status(200).json({
    message: "Google authentication successful",
    userDetails: userDetails,
  });
  } catch (error) {
  console.error("Error during Google authentication:", error);
  res
    .status(500)
    .json({ message: "Internal server error", error: error.message });
  }
};


const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



module.exports = {
  login,
  logout,
  signup,
  googleAuth
};
