const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const userId = user._id;

    // Genera un token JWT valido e restituiscilo come risposta
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: token, message: 'Login successful', user: { _id: userId } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginUser };
