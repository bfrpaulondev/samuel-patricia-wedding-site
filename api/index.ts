import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import confirmationsRouter from './routes/confirmations';
import adminRouter from './routes/admin';
import { apiLimiter } from './middleware/rateLimiter';

const app: Application = express();

// Cache da conexão MongoDB
let isConnected = false;

async function initializeDB() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB initialized');
    } catch (error) {
      console.error('❌ MongoDB failed:', error);
    }
  }
}

// Middlewares
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN as string, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding API',
      version: '1.0.0',
      description: 'Samuel & Patrícia Wedding Confirmation API'
    },
    servers: [{ url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://samuel-patricia-wedding-site.vercel.app' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
  },
  apis: ['./api/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Routes
app.get('/', (req, res) => res.json({ success: true, message: 'Wedding API', version: '1.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), mongodb: isConnected ? 'connected' : 'disconnected' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/confirmations', confirmationsRouter);
app.use('/admin', adminRouter);
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found' }));

// Vercel Handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeDB();
  return app(req as any, res as any);
}
