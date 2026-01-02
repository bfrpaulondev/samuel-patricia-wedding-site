import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔍 Tentando conectar ao MongoDB...');
    console.log('🔗 URI:', config.mongodb.uri.substring(0, 30) + '...');
    
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    // Não fazer exit para permitir que a API rode sem MongoDB (para testes)
    console.log('⚠️ API rodando sem MongoDB');
  }
};

export default connectDB;
