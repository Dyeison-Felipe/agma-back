export const Transactional =
  () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
    descriptor;
