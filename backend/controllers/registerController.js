const User = require("../models/userModel")
const bcrypt = require('bcrypt');

registerNewUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    // Verifica se l'utente esiste già nel database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Crea una nuova istanza dell'utente e crittografa la password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    // Salva l'utente nel database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error ' + error });
  }
}

module.exports = {registerNewUser}
