import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import Confirmation from '../models/Confirmation';
import { confirmationLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validator';

const router = Router();

/**
 * @swagger
 * /api/confirmations:
 *   post:
 *     summary: Criar nova confirmação de presença
 *     tags: [Confirmations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - willAttend
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               willAttend:
 *                 type: boolean
 *               numberOfGuests:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Confirmação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       429:
 *         description: Limite de requisições excedido
 */
router.post(
  '/',
  confirmationLimiter,
  validate([
    body('fullName')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Nome deve ter entre 3 e 100 caracteres'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[\d\s()-]+$/)
      .withMessage('Telefone inválido'),
    body('willAttend')
      .isBoolean()
      .withMessage('Confirmação de presença deve ser verdadeiro ou falso'),
    body('numberOfGuests')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Número de acompanhantes deve ser entre 0 e 10'),
    body('message')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Mensagem deve ter no máximo 1000 caracteres')
  ]),
  async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, willAttend, numberOfGuests, message } = req.body;

      // Verificar se já existe confirmação para este email
      const existingConfirmation = await Confirmation.findOne({ email });
      if (existingConfirmation) {
        res.status(409).json({
          success: false,
          message: 'Já existe uma confirmação para este email'
        });
        return;
      }

      // Capturar informações da requisição
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const confirmation = new Confirmation({
        fullName,
        email,
        phone,
        willAttend,
        numberOfGuests: willAttend ? (numberOfGuests || 0) : 0,
        message,
        ipAddress,
        userAgent
      });

      await confirmation.save();

      res.status(201).json({
        success: true,
        message: 'Confirmação enviada com sucesso!',
        data: {
          id: confirmation._id,
          fullName: confirmation.fullName,
          email: confirmation.email,
          willAttend: confirmation.willAttend,
          status: confirmation.status
        }
      });
    } catch (error: any) {
      console.error('Erro ao criar confirmação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar confirmação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @swagger
 * /api/confirmations/check/{email}:
 *   get:
 *     summary: Verificar se email já confirmou presença
 *     tags: [Confirmations]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status da confirmação
 */
router.get('/check/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    const confirmation = await Confirmation.findOne({ email }).select('fullName email willAttend status submittedAt');
    
    if (!confirmation) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma confirmação encontrada para este email'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        exists: true,
        fullName: confirmation.fullName,
        willAttend: confirmation.willAttend,
        status: confirmation.status,
        submittedAt: confirmation.submittedAt
      }
    });
  } catch (error: any) {
    console.error('Erro ao verificar confirmação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar confirmação'
    });
  }
});

export default router;
