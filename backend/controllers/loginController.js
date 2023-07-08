const User = require("../models/userModel")
const bcrypt = require('bcrypt');

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste nel database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Verifica la corrispondenza della password crittografata
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const userId = user._id;

    res.status(200).json({ message: 'Login successful', user: { _id: userId } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({message: 'Internal server error' });
  }
}

module.exports = { loginUser }
