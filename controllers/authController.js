
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (user) => {
  // Assuming you have a secret key for JWT
  const secretKey = 'SecretKey';

  // Create a token with user information and role
  const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });

  return token;
};
// Function to send reset password email
const sendResetPasswordEmail = (userEmail, resetPasswordToken) => {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user : "mesobselfservingrestaurant@gmail.com",
      pass: 'hohporafehngrcqf'
    },
  });

  const resetPasswordLink = `https://yourapp.com/reset-password?token=${resetPasswordToken}`;

  const mailOptions = {
    from: 'mesobselfservingrestaurant@gmail.com',
    to: userEmail,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset password email:', error);
    } else {
      console.log('Reset password email sent:', userEmail, info.response);
    }
  });
};





const signup = async (req, res) => {
  try {
    const { fullname, email, phone_number, password, role = 'customer' } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user with the provided role or default to 'customer'
    const newUser = await User.create({ fullname, email, phone_number, password, role });

    // Generate a token and send it back to the client
    const token = generateToken(newUser);
    res.json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Logic for user login (verify email and password)
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token and send it back to the client
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User with this email does not exist' });
    }

    // Generate reset password token and set expiration time (e.g., 1 hour)
    const resetPasswordToken = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour in milliseconds

    // Save the token and expiration time in the user model
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send reset password email
    sendResetPasswordEmail(user.email, resetPasswordToken);

    res.json({ message: 'Password reset email sent. Check your email for instructions.',user: user.email }); 
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset password token' });
    }

    // Update user's password and clear the reset password fields
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };



