const jwt = require('jsonwebtoken');  // For JWT token handling

// Define the authentication middleware function
const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verify the token using the secret stored in the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};
module.exports = authMiddleware;