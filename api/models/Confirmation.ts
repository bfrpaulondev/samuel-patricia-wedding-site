import mongoose, { Document, Schema } from 'mongoose';

export interface IConfirmation extends Document {
  fullName: string;
  email: string;
  phone?: string;
  willAttend: boolean;
  numberOfGuests: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

const ConfirmationSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    index: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s()-]+$/, 'Telefone inválido']
  },
  willAttend: {
    type: Boolean,
    required: [true, 'Confirmação de presença é obrigatória']
  },
  numberOfGuests: {
    type: Number,
    default: 0,
    min: [0, 'Número de acompanhantes não pode ser negativo'],
    max: [10, 'Número máximo de acompanhantes é 10']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Mensagem deve ter no máximo 1000 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Índice composto para busca eficiente
ConfirmationSchema.index({ email: 1, submittedAt: -1 });
ConfirmationSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<IConfirmation>('Confirmation', ConfirmationSchema);
