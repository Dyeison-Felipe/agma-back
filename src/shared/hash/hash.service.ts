import { Inject } from '@nestjs/common';
import { HashService } from './hash.interface';
import { PROVIDERS } from '../constants/providers';
import { EnvConfigService } from '../env-config/env-config.interface';
import * as bcrypt from 'bcrypt';

export class HashServiceImpl implements HashService {
  constructor(
    @Inject(PROVIDERS.ENV_CONFIG_SERVICE)
    private readonly configService: EnvConfigService,
  ) {}
  async hash(value: string): Promise<string> {
    const salts = this.configService.getSalts();

    const hashed = await bcrypt.hash(value, salts);

    return hashed;
  }
  compareHash(value: string, valueHash: string): boolean {
    const compare = bcrypt.compareSync(value, valueHash);
    return compare;
  }
}
