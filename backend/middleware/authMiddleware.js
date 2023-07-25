// authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access LATO SERVER' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log("[MiddleWare] User from token:", user); // Aggiungi questo log per verificare il valore del payload del token
    req.user = user.userId;
    next();
  });
}

module.exports = { authenticateToken };
