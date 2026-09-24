const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set. Server cannot generate tokens securely.');
  }
  return secret;
};

const generateToken = (userId, role = 'user') => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
