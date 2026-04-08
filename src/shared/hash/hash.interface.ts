export interface HashService {
  hash(value: string): Promise<string>;
  compareHash(value: string, valueHase: string): boolean;
}
