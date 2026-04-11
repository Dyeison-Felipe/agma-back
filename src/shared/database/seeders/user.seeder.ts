import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder';
import { ROLE } from '@/shared/constants/roles';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        '⚠️ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos. Pulando seeder de admin.',
      );
      return;
    }

    const userRepo = dataSource.getRepository('user');
    const roleRepo = dataSource.getRepository('role');

    const adminRole = await roleRepo.findOne({
      where: { name: ROLE.ADMIN },
    });

    if (!adminRole) {
      throw new Error('Role ADMIN não encontrada. Rode o RoleSeeder primeiro.');
    }

    const userExists = await userRepo.findOne({
      where: { email: adminEmail },
    });

    if (userExists) {
      console.log('👤 Admin já existe. Pulando...');
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await userRepo.save({
      id: randomUUID(),
      name: 'Administrador',
      email: adminEmail,
      password: passwordHash,
      role: adminRole.id,
      active: true,
    });

    console.log('✅ Admin criado');
  }
}
