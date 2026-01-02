import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin';
import connectDB from './config/database';

dotenv.config();

async function createInitialAdmin() {
  try {
    await connectDB();

    const adminExists = await Admin.findOne({ role: 'superadmin' });
    
    if (adminExists) {
      console.log('✅ Admin superusuário já existe!');
      console.log(`Username: ${adminExists.username}`);
      console.log(`Email: ${adminExists.email}`);
      mongoose.connection.close();
      return;
    }

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'samuel',
      email: process.env.ADMIN_EMAIL || 'samuel@casamento.com',
      password: process.env.ADMIN_PASSWORD || 'NoivosSamuelPatricia2026!',
      role: 'superadmin',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin criado com sucesso!');
    console.log('==================================');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log('==================================');
    console.log('⚠️  IMPORTANTE: Mude a senha após o primeiro login!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
}

createInitialAdmin();
