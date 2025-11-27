const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Demasiadas solicitudes, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register attempts per windowMs
  message: {
    message: 'Demasiados intentos de autenticación, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    message: 'Límite de carga de archivos alcanzado, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { apiLimiter, authLimiter, uploadLimiter };
