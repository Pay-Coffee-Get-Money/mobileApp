const jwt = require('jsonwebtoken');
const config = require('../config');

function authorize(allowedRoles) {
  return (req, res, next) => {
    const token = req.header('token');

    if (!token) {
      return res.status(401).json({ code: 'Unauthorized', message: 'No token provided' });
    }

    jwt.verify(token, config.jwtSecrectKey, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ code: 'Forbidden', message: 'Invalid token' });
      }

      const userRoles = decodedToken.role || [];
      const hasPermission = userRoles.some(role => allowedRoles.includes(role));

      if (hasPermission) {
        next();
      } else {
        res.status(403).json({ code: 'Forbidden', message: 'Access denied' });
      }
    });
  };
}

module.exports = authorize;
