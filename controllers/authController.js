const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/users');
const { signUpSchema, signInSchema } = require('../utils/validation');

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate input
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    // Validate input
    const { error } = signInSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT or Send Success Message
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { signUp, signIn };
