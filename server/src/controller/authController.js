const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {OAuth2Client} = require("google-auth-library");
const emailService = require("../service/emailService");

const {validationResult} = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET ;

const generateAccessToken = (userDetails) => {
  return jwt.sign(userDetails, JWT_SECRET, { expiresIn: "1m" });
}

const generateRefreshToken = (userDetails) => {
  return jwt.sign(userDetails, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

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
      adminId: user.adminId,
      credits: user.credits ? user.credits : 0,
    };

    const token = generateAccessToken(userDetails);
    const refreshToken = generateRefreshToken(userDetails);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      domain: "localhost",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
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
      role: newUser.role ? newUser.role : 'admin',
      credits: newUser.credits ? newUser.credits : 0,
    };

    const token = generateAccessToken(userDetails);
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
    role: user.role ? user.role : 'admin',
    credits: user.credits ? user.credits : 0,
  };
  const token = generateAccessToken(userDetails);
  const refreshToken = generateRefreshToken(userDetails);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    domain: "localhost",
  });

  res.cookie("refreshToken", refreshToken, {
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
    res.clearCookie("refreshToken");
    // Optionally, you can also invalidate the refresh token in your database if you store it
    // For now, we just clear the cookie
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendResetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate 6-digit code
    const resetCode = generateResetCode();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // Code expires in 10 minutes

    // Update user with reset code and expiry
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = expiry;
    await user.save();

    // Send email with reset code
    const subject = "Password Reset Code";
    const body = `Your password reset code is: ${resetCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

    await emailService.send(email, subject, body);

    res.status(200).json({
      message: "Reset code sent to your email address"
    });

  } catch (error) {
    console.error("Error sending reset password token:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        message: "Email, code, and new password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if reset code exists and matches
    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Check if code has expired
    if (!user.resetPasswordExpiry || new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

module.exports = {
  login,
  logout,
  signup,
  googleAuth,
  sendResetPasswordToken,
  resetPassword
};
