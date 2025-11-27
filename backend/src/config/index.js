require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cf_consultores'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expire: process.env.JWT_EXPIRE || '24h'
  }
};
