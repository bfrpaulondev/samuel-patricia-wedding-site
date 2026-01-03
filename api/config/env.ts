import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI as string
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string
  },
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV as string,
    corsOrigin: process.env.CORS_ORIGIN as string
  },
  admin: {
    username: process.env.ADMIN_USERNAME as string,
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string
  }
};
