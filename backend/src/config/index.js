require('dotenv').config();

// Validate required environment variables in production
const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cf_consultores'
  },
  jwt: {
    secret: process.env.JWT_SECRET || (nodeEnv === 'development' ? 'dev_secret_key_not_for_production' : ''),
    expire: process.env.JWT_EXPIRE || '24h'
  }
};
