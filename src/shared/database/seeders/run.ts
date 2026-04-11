import { DataSource } from 'typeorm';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

export async function runSeeds(dataSource: DataSource) {
  const seeds = [new RoleSeeder(), new UserSeeder()];

  for (const seed of seeds) {
    await seed.run(dataSource);
  }
}
