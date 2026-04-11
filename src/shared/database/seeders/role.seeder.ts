import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { Seeder } from './seeder';
import { ROLE } from '@/shared/constants/roles';

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository('role');

    const exists = await repo.findOne({
      where: { name: ROLE.ADMIN },
    });

    if (!exists) {
      await repo.save({
        id: randomUUID(),
        name: ROLE.ADMIN,
      });
    }
  }
}
