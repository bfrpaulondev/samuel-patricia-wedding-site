import type { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from '../api-src/config/env';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from '../api-src/config/database';
import confirmationsRouter from '../api-src/routes/confirmations';
import adminRouter from '../api-src/routes/admin';
import { apiLimiter } from '../api-src/middleware/rateLimiter';

const app: Application = express();

// Cache da conexão MongoDB
let isConnected = false;

async function initializeDB() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB connection initialized');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
    }
  }
}

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar para Vercel
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares gerais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (ajustado para serverless)
app.use(apiLimiter);

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Confirmation API',
      version: '1.0.0',
      description: 'API para gerenciamento de confirmações de casamento - Samuel & Patrícia',
      contact: {
        name: 'Samuel & Patrícia',
        email: 'samuel@casamento.com'
      }
    },
    servers: [
      {
        url: process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:5000',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./api-src/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rotas principais
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Wedding Confirmation API - Samuel & Patrícia',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      confirmations: '/api/confirmations',
      admin: '/api/admin',
      docs: '/api/api-docs'
    },
    wedding: {
      couple: 'Samuel & Patrícia',
      date: '2026-05-17',
      location: 'Setúbal, Portugal'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: isConnected ? 'connected' : 'disconnected'
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wedding API - Samuel & Patrícia'
}));

// Rotas da aplicação
app.use('/confirmations', confirmationsRouter);
app.use('/admin', adminRouter);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Handler para Vercel Serverless
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Inicializar MongoDB na primeira requisição
  await initializeDB();
  
  // Processar requisição através do Express
  return app(req as any, res as any);
}
