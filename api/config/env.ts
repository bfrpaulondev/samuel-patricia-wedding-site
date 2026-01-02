import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding-app'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'samuel',
    email: process.env.ADMIN_EMAIL || 'samuel@casamento.com',
    password: process.env.ADMIN_PASSWORD || 'NoivosSamuelPatricia2026!'
  }
};
