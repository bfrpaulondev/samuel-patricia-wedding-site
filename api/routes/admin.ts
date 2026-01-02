import { Router, Response } from 'express';
import { body } from 'express-validator';
import Admin from '../models/Admin';
import Confirmation from '../models/Confirmation';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validator';
import { generateToken } from '../utils/jwt';

const router = Router();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login de administrador
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  loginLimiter,
  validate([
    body('username').trim().notEmpty().withMessage('Username é obrigatório'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const { username, password } = req.body;

      // Buscar admin com senha
      const admin = await Admin.findOne({ username, isActive: true }).select('+password');
      
      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
        return;
      }

      // Verificar senha
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
        return;
      }

      // Atualizar último login
      admin.lastLogin = new Date();
      await admin.save();

      // Gerar token
      const token = generateToken({
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role
      });

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        }
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao realizar login'
      });
    }
  }
);

/**
 * @swagger
 * /api/admin/confirmations:
 *   get:
 *     summary: Listar todas as confirmações (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, all]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de confirmações
 */
router.get(
  '/confirmations',
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status = 'all', page = 1, limit = 20 } = req.query;
      
      const query: any = {};
      if (status !== 'all') {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const confirmations = await Confirmation.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Confirmation.countDocuments(query);

      const stats = {
        total: await Confirmation.countDocuments(),
        pending: await Confirmation.countDocuments({ status: 'pending' }),
        approved: await Confirmation.countDocuments({ status: 'approved' }),
        rejected: await Confirmation.countDocuments({ status: 'rejected' }),
        willAttend: await Confirmation.countDocuments({ willAttend: true, status: 'approved' }),
        wontAttend: await Confirmation.countDocuments({ willAttend: false })
      };

      res.json({
        success: true,
        data: {
          confirmations,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          },
          stats
        }
      });
    } catch (error: any) {
      console.error('Erro ao buscar confirmações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar confirmações'
      });
    }
  }
);

/**
 * @swagger
 * /api/admin/confirmations/{id}/approve:
 *   patch:
 *     summary: Aprovar confirmação
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmação aprovada
 */
router.patch(
  '/confirmations/:id/approve',
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      const confirmation = await Confirmation.findById(id);
      if (!confirmation) {
        res.status(404).json({
          success: false,
          message: 'Confirmação não encontrada'
        });
        return;
      }

      confirmation.status = 'approved';
      confirmation.reviewedAt = new Date();
      confirmation.reviewedBy = req.user?.username;
      await confirmation.save();

      res.json({
        success: true,
        message: 'Confirmação aprovada com sucesso',
        data: confirmation
      });
    } catch (error: any) {
      console.error('Erro ao aprovar confirmação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao aprovar confirmação'
      });
    }
  }
);

/**
 * @swagger
 * /api/admin/confirmations/{id}/reject:
 *   patch:
 *     summary: Rejeitar confirmação
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmação rejeitada
 */
router.patch(
  '/confirmations/:id/reject',
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      const confirmation = await Confirmation.findById(id);
      if (!confirmation) {
        res.status(404).json({
          success: false,
          message: 'Confirmação não encontrada'
        });
        return;
      }

      confirmation.status = 'rejected';
      confirmation.reviewedAt = new Date();
      confirmation.reviewedBy = req.user?.username;
      await confirmation.save();

      res.json({
        success: true,
        message: 'Confirmação rejeitada',
        data: confirmation
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar confirmação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao rejeitar confirmação'
      });
    }
  }
);

/**
 * @swagger
 * /api/admin/confirmations/{id}:
 *   delete:
 *     summary: Deletar confirmação
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmação deletada
 */
router.delete(
  '/confirmations/:id',
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      const confirmation = await Confirmation.findByIdAndDelete(id);
      if (!confirmation) {
        res.status(404).json({
          success: false,
          message: 'Confirmação não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Confirmação deletada com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao deletar confirmação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar confirmação'
      });
    }
  }
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Estatísticas gerais
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas
 */
router.get(
  '/stats',
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const totalConfirmations = await Confirmation.countDocuments();
      const pendingCount = await Confirmation.countDocuments({ status: 'pending' });
      const approvedCount = await Confirmation.countDocuments({ status: 'approved' });
      const rejectedCount = await Confirmation.countDocuments({ status: 'rejected' });
      
      const willAttendCount = await Confirmation.countDocuments({ 
        willAttend: true, 
        status: 'approved' 
      });
      
      const wontAttendCount = await Confirmation.countDocuments({ 
        willAttend: false 
      });

      // Calcular total de convidados
      const attendingConfirmations = await Confirmation.find({ 
        willAttend: true, 
        status: 'approved' 
      });
      
      const totalGuests = attendingConfirmations.reduce((sum, conf) => {
        return sum + conf.numberOfGuests + 1; // +1 para a pessoa principal
      }, 0);

      res.json({
        success: true,
        data: {
          totalConfirmations,
          pendingCount,
          approvedCount,
          rejectedCount,
          willAttendCount,
          wontAttendCount,
          totalGuests
        }
      });
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  }
);

export default router;
