// backend/src/utils/seed.ts
import mongoose from 'mongoose';
import { connectDatabase, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } from '../config';
import { User } from '../models';
import { hashPassword } from './password';

export const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin user seed...');
    if (!ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD is not defined in environment variables. Please set it in backend/.env.');
      return;
    }
    await connectDatabase();

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
    if (existingAdmin) {
      console.log(`ℹ️ Admin user (${ADMIN_EMAIL}) already exists. Updating role to admin.`);
      existingAdmin.role = 'admin';
      existingAdmin.name = ADMIN_NAME;
      // If password needs reset:
      existingAdmin.password = await hashPassword(ADMIN_PASSWORD);
      await existingAdmin.save();
      console.log('✅ Admin user verified and updated.');
    } else {
      const hashedPassword = await hashPassword(ADMIN_PASSWORD);
      const newAdmin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
      });
      await newAdmin.save();
      console.log(`✅ Admin user (${ADMIN_EMAIL}) created successfully.`);
    }

    console.log('🌱 Seed process finished.');
  } catch (error: any) {
    console.error('❌ Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

if (require.main === module) {
  seedAdmin();
}
