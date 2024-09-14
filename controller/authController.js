const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/userModel.js")

async function handelSignup(req, res) {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({email: email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email: email, 
        password: hashedPassword 
      });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = User.findOne({email : email});
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {

    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { handelSignup, handelLogin };
