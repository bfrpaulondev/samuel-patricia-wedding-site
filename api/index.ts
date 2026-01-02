// Carregar variáveis de ambiente PRIMEIRO
import { config } from './config/env';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import confirmationsRouter from './routes/confirmations';
import adminRouter from './routes/admin';
import { apiLimiter } from './middleware/rateLimiter';

const app: Application = express();
const PORT = config.server.port;

// Conectar ao MongoDB
connectDB();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));

// Middlewares gerais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Confirmation API',
      version: '1.0.0',
      description: 'API para gerenciamento de confirmações de casamento',
      contact: {
        name: 'Samuel & Patrícia',
        email: 'contato@casamento.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://samuel-patricia-wedding-site.vercel.app',
        description: 'Servidor de Desenvolvimento'
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
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./api/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wedding API Docs'
}));

// Rotas
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Wedding Confirmation API',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/confirmations', confirmationsRouter);
app.use('/api/admin', adminRouter);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de erro global
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Iniciar servidor (apenas se não for Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
